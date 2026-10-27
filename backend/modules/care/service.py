"""Care coordination service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import CareRepository
from .schemas import (
    CareTaskCreate,
    CareTaskUpdate,
    CareTeamCreate,
    CareTeamMemberCreate,
    DischargePlanCreate,
    HandoffCreate,
)


class CareService:
    def __init__(self, repository: CareRepository | None = None) -> None:
        self.repository = repository or CareRepository()

    def create_team(self, data: CareTeamCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_team(payload)
        default_bus.publish(DomainEvent(name="CareTeamCreated", payload={"team_id": record["id"]}))
        return record

    def list_teams(self, patient_id: int | None = None) -> list[dict]:
        return self.repository.list_teams(patient_id=patient_id)

    def add_member(self, data: CareTeamMemberCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.add_member(payload)
        default_bus.publish(DomainEvent(name="CareTeamMemberAdded", payload={"member_id": record["id"]}))
        return record

    def list_members(self, care_team_id: int) -> list[dict]:
        return self.repository.list_members(care_team_id)

    def create_task(self, data: CareTaskCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("title"):
            raise ValidationError("title is required")
        record = self.repository.create_task(payload)
        default_bus.publish(DomainEvent(name="CareTaskCreated", payload={"task_id": record["id"]}))
        return record

    def get_task(self, task_id: int) -> dict:
        record = self.repository.get_task(task_id)
        if record is None:
            raise NotFoundError("CareTask", task_id)
        return record

    def update_task(self, task_id: int, data: CareTaskUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        if payload.get("status") == "done":
            payload["completed_at"] = datetime.utcnow()
        record = self.repository.update_task(task_id, payload)
        default_bus.publish(DomainEvent(name="CareTaskUpdated", payload={"task_id": task_id}))
        return record

    def complete_task(self, task_id: int) -> dict:
        return self.update_task(task_id, {"status": "done"})

    def list_tasks(self, params: PageParams, patient_id: int | None = None, assigned_to: int | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_tasks(params, patient_id=patient_id, assigned_to=assigned_to, status=status)

    def create_handoff(self, data: HandoffCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload["from_user"] == payload["to_user"]:
            raise ValidationError("from_user and to_user must differ")
        record = self.repository.create_handoff(payload)
        default_bus.publish(DomainEvent(name="HandoffCreated", payload={"handoff_id": record["id"]}))
        return record

    def acknowledge_handoff(self, handoff_id: int) -> dict:
        record = self.repository.update_handoff(handoff_id, {"status": "acknowledged", "acknowledged_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="HandoffAcknowledged", payload={"handoff_id": handoff_id}))
        return record

    def list_handoffs(self, patient_id: int | None = None, to_user: int | None = None) -> list[dict]:
        return self.repository.list_handoffs(patient_id=patient_id, to_user=to_user)

    def create_discharge_plan(self, data: DischargePlanCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_discharge_plan(payload)
        default_bus.publish(DomainEvent(name="DischargePlanCreated", payload={"plan_id": record["id"]}))
        return record

    def get_discharge_plan(self, plan_id: int) -> dict:
        record = self.repository.get_discharge_plan(plan_id)
        if record is None:
            raise NotFoundError("DischargePlan", plan_id)
        return record

    def list_discharge_plans(self, patient_id: int | None = None) -> list[dict]:
        return self.repository.list_discharge_plans(patient_id=patient_id)

    def open_tasks_for_patient(self, patient_id: int) -> list[dict]:
        result = self.repository.list_tasks(PageParams(page=1, per_page=1000), patient_id=patient_id, status="open")
        return list(result.items)

    def overdue_tasks(self) -> list[dict]:
        now = datetime.utcnow()
        result = self.repository.list_tasks(PageParams(page=1, per_page=1000))
        return [t for t in result.items if t.get("due_date") and t["due_date"] < now and t.get("status") != "done"]

    def count_tasks(self) -> int:
        result = self.repository.list_tasks(PageParams(page=1, per_page=10000))
        return result.total
