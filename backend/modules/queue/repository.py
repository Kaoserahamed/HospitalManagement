"""Queue repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


PRIORITY_ORDER = {"critical": 0, "high": 1, "normal": 2, "low": 3}


class QueueRepository:
    def __init__(self) -> None:
        self._tasks: dict[int, dict] = {}
        self._counter: int = 0

    def enqueue(self, data: dict) -> dict:
        self._counter += 1
        record = {"id": self._counter, **data, "status": data.get("status", "queued"), "attempts": 0}
        self._tasks[self._counter] = record
        return dict(record)

    def get(self, task_id: int) -> Optional[dict]:
        record = self._tasks.get(task_id)
        return dict(record) if record else None

    def update(self, task_id: int, data: dict) -> dict:
        record = self._tasks.get(task_id)
        if record is None:
            raise KeyError(f"Task {task_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._tasks[task_id] = record
        return dict(record)

    def dequeue(self) -> Optional[dict]:
        queued = [t for t in self._tasks.values() if t.get("status") == "queued"]
        if not queued:
            return None
        queued.sort(key=lambda t: (PRIORITY_ORDER.get(t.get("priority", "normal"), 2), t.get("created_at") or datetime.min))
        task = queued[0]
        task["status"] = "running"
        task["started_at"] = datetime.utcnow()
        task["attempts"] = task.get("attempts", 0) + 1
        self._tasks[task["id"]] = task
        return dict(task)

    def complete(self, task_id: int) -> dict:
        return self.update(task_id, {"status": "completed", "completed_at": datetime.utcnow()})

    def fail(self, task_id: int, error: str) -> dict:
        task = self.get(task_id)
        if task is None:
            raise KeyError(f"Task {task_id} not found")
        attempts = task.get("attempts", 0)
        max_attempts = task.get("max_attempts", 3)
        status = "failed" if attempts >= max_attempts else "queued"
        return self.update(task_id, {"status": status, "error": error})

    def cancel(self, task_id: int) -> dict:
        return self.update(task_id, {"status": "cancelled"})

    def list(self, params: PageParams, status: str | None = None, priority: str | None = None) -> PageResult:
        items = list(self._tasks.values())
        if status is not None:
            items = [t for t in items if t.get("status") == status]
        if priority is not None:
            items = [t for t in items if t.get("priority") == priority]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def retry(self, task_id: int) -> dict:
        task = self.get(task_id)
        if task is None:
            raise KeyError(f"Task {task_id} not found")
        if task.get("status") != "failed":
            raise ValueError("Only failed tasks can be retried")
        return self.update(task_id, {"status": "queued", "error": None})

    def size(self) -> int:
        return sum(1 for t in self._tasks.values() if t.get("status") == "queued")

    def clear(self) -> None:
        self._tasks.clear()
        self._counter = 0
