"""Telemedicine service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import TelemedicineRepository
from .schemas import (
    SessionMetricCreate,
    VirtualVisitCreate,
    VirtualVisitUpdate,
    WaitingRoomEntry,
)


class TelemedicineService:
    def __init__(self, repository: TelemedicineRepository | None = None) -> None:
        self.repository = repository or TelemedicineRepository()

    def schedule_visit(self, data: VirtualVisitCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload["scheduled_start"] >= payload["scheduled_end"]:
            raise ValidationError("scheduled_start must be before scheduled_end")
        record = self.repository.create_visit(payload)
        default_bus.publish(DomainEvent(name="VirtualVisitScheduled", payload={"visit_id": record["id"]}))
        return record

    def get_visit(self, visit_id: int) -> dict:
        record = self.repository.get_visit(visit_id)
        if record is None:
            raise NotFoundError("VirtualVisit", visit_id)
        return record

    def update_visit(self, visit_id: int, data: VirtualVisitUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        record = self.repository.update_visit(visit_id, payload)
        default_bus.publish(DomainEvent(name="VirtualVisitUpdated", payload={"visit_id": visit_id}))
        return record

    def start_visit(self, visit_id: int) -> dict:
        record = self.repository.update_visit(visit_id, {"status": "in_progress", "actual_start": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="VirtualVisitStarted", payload={"visit_id": visit_id}))
        return record

    def end_visit(self, visit_id: int, quality: str | None = None, notes: str | None = None) -> dict:
        payload = {"status": "completed", "actual_end": datetime.utcnow()}
        if quality:
            payload["session_quality"] = quality
        if notes:
            payload["notes"] = notes
        record = self.repository.update_visit(visit_id, payload)
        default_bus.publish(DomainEvent(name="VirtualVisitCompleted", payload={"visit_id": visit_id}))
        return record

    def cancel_visit(self, visit_id: int, reason: str | None = None) -> dict:
        payload = {"status": "cancelled"}
        if reason:
            payload["notes"] = reason
        record = self.repository.update_visit(visit_id, payload)
        default_bus.publish(DomainEvent(name="VirtualVisitCancelled", payload={"visit_id": visit_id}))
        return record

    def mark_no_show(self, visit_id: int) -> dict:
        return self.repository.update_visit(visit_id, {"status": "no_show"})

    def delete_visit(self, visit_id: int) -> bool:
        if not self.repository.delete_visit(visit_id):
            raise NotFoundError("VirtualVisit", visit_id)
        return True

    def list_visits(self, params: PageParams, patient_id: int | None = None, doctor_id: int | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_visits(params, patient_id=patient_id, doctor_id=doctor_id, status=status)

    def enter_waiting_room(self, data: WaitingRoomEntry | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.add_to_waiting_room(payload)
        default_bus.publish(DomainEvent(name="WaitingRoomEntered", payload={"visit_id": payload["visit_id"]}))
        return record

    def list_waiting_room(self, admitted: bool | None = None) -> list[dict]:
        return self.repository.list_waiting_room(admitted=admitted)

    def admit_patient(self, waiting_id: int) -> dict:
        return self.repository.admit(waiting_id)

    def record_metric(self, data: SessionMetricCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        return self.repository.record_metric(payload)

    def list_metrics(self, visit_id: int) -> list[dict]:
        return self.repository.list_metrics(visit_id)

    def summary(self) -> dict:
        result = self.repository.list_visits(PageParams(page=1, per_page=100))
        items = list(result.items)
        completed = [v for v in items if v.get("status") == "completed"]
        cancelled = [v for v in items if v.get("status") == "cancelled"]
        no_show = [v for v in items if v.get("status") == "no_show"]
        durations = []
        for v in completed:
            if v.get("actual_start") and v.get("actual_end"):
                from datetime import datetime
                try:
                    s = datetime.fromisoformat(v["actual_start"])
                    e = datetime.fromisoformat(v["actual_end"])
                    durations.append((e - s).total_seconds() / 60.0)
                except ValueError:
                    pass
        avg = sum(durations) / len(durations) if durations else 0.0
        return {
            "total_visits": len(items),
            "completed": len(completed),
            "cancelled": len(cancelled),
            "no_show": len(no_show),
            "avg_duration_minutes": round(avg, 2),
        }

    def count(self) -> int:
        return self.repository.count_visits()
