"""Queue service."""

from __future__ import annotations

from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import QueueRepository
from .schemas import TaskCreate, TaskUpdate


class QueueService:
    def __init__(self, repository: QueueRepository | None = None) -> None:
        self.repository = repository or QueueRepository()

    def enqueue(self, data: TaskCreate | dict, priority: str = "normal") -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        payload["priority"] = payload.get("priority", priority)
        record = self.repository.enqueue(payload)
        default_bus.publish(DomainEvent(name="TaskEnqueued", payload={"task_id": record["id"]}))
        return record

    def get(self, task_id: int) -> dict:
        record = self.repository.get(task_id)
        if record is None:
            raise NotFoundError("Task", task_id)
        return record

    def update(self, task_id: int, data: TaskUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        return self.repository.update(task_id, payload)

    def dequeue(self) -> dict | None:
        task = self.repository.dequeue()
        if task:
            default_bus.publish(DomainEvent(name="TaskDequeued", payload={"task_id": task["id"]}))
        return task

    def complete(self, task_id: int) -> dict:
        record = self.repository.complete(task_id)
        default_bus.publish(DomainEvent(name="TaskCompleted", payload={"task_id": task_id}))
        return record

    def fail(self, task_id: int, error: str) -> dict:
        record = self.repository.fail(task_id, error)
        default_bus.publish(DomainEvent(name="TaskFailed", payload={"task_id": task_id, "error": error}))
        return record

    def cancel(self, task_id: int) -> dict:
        return self.repository.cancel(task_id)

    def retry(self, task_id: int) -> dict:
        return self.repository.retry(task_id)

    def list(self, params: PageParams, status: str | None = None, priority: str | None = None) -> PageResult:
        return self.repository.list(params, status=status, priority=priority)

    def size(self) -> int:
        return self.repository.size()

    def process_next(self, handler) -> dict | None:
        task = self.dequeue()
        if task is None:
            return None
        try:
            result = handler(task)
            self.complete(task["id"])
            task["result"] = result
            return task
        except Exception as exc:  # noqa: BLE001
            self.fail(task["id"], str(exc))
            task["error"] = str(exc)
            return task

    def clear(self) -> None:
        self.repository.clear()

    def stats(self) -> dict:
        all_tasks = self.repository.list(PageParams(page=1, per_page=100))
        items = list(all_tasks.items)
        return {
            "total": len(items),
            "queued": sum(1 for t in items if t.get("status") == "queued"),
            "running": sum(1 for t in items if t.get("status") == "running"),
            "completed": sum(1 for t in items if t.get("status") == "completed"),
            "failed": sum(1 for t in items if t.get("status") == "failed"),
            "cancelled": sum(1 for t in items if t.get("status") == "cancelled"),
        }
