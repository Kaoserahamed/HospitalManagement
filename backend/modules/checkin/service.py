"""Check-in service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import CheckInRepository
from .schemas import CheckInCreate, CheckInUpdate, KioskSessionCreate, QueueEntryCreate


class CheckInService:
    def __init__(self, repository: CheckInRepository | None = None) -> None:
        self.repository = repository or CheckInRepository()

    def check_in(self, data: CheckInCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_checkin(payload)
        default_bus.publish(DomainEvent(name="PatientCheckedIn", payload={"checkin_id": record["id"]}))
        # auto-enqueue
        entry = self.repository.enqueue({"checkin_id": record["id"], "department_id": payload.get("department_id"), "position": self.repository.waiting_count(payload.get("department_id")), "priority": payload.get("priority", "normal")})
        return record

    def get_checkin(self, checkin_id: int) -> dict:
        record = self.repository.get_checkin(checkin_id)
        if record is None:
            raise NotFoundError("CheckIn", checkin_id)
        return record

    def update_checkin(self, checkin_id: int, data: CheckInUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        record = self.repository.update_checkin(checkin_id, payload)
        default_bus.publish(DomainEvent(name="CheckInUpdated", payload={"checkin_id": checkin_id}))
        return record

    def call_patient(self, checkin_id: int) -> dict:
        record = self.repository.update_checkin(checkin_id, {"status": "called", "called_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="PatientCalled", payload={"checkin_id": checkin_id}))
        return record

    def start_service(self, checkin_id: int) -> dict:
        return self.repository.update_checkin(checkin_id, {"status": "in_service"})

    def complete(self, checkin_id: int) -> dict:
        record = self.repository.update_checkin(checkin_id, {"status": "completed", "completed_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="CheckInCompleted", payload={"checkin_id": checkin_id}))
        # remove from queue
        entries = self.repository.list_queue()
        for e in entries:
            if e.get("checkin_id") == checkin_id:
                self.repository.remove_from_queue(e["id"])
        return record

    def mark_no_show(self, checkin_id: int) -> dict:
        return self.repository.update_checkin(checkin_id, {"status": "no_show"})

    def list_checkins(self, params: PageParams, status: str | None = None, department_id: int | None = None) -> PageResult:
        return self.repository.list_checkins(params, status=status, department_id=department_id)

    def queue_position(self, checkin_id: int) -> dict:
        entries = self.repository.list_queue()
        for e in entries:
            if e.get("checkin_id") == checkin_id:
                return {"checkin_id": checkin_id, "position": e["position"], "estimated_wait": e.get("estimated_wait")}
        return {"checkin_id": checkin_id, "position": None, "estimated_wait": None}

    def next_patient(self, department_id: int | None = None) -> dict | None:
        entry = self.repository.next_in_queue(department_id=department_id)
        if entry is None:
            return None
        checkin = self.repository.get_checkin(entry["checkin_id"])
        return {"queue_entry": entry, "checkin": checkin}

    def waiting_count(self, department_id: int | None = None) -> int:
        return self.repository.waiting_count(department_id=department_id)

    def queue_stats(self, department_id: int | None = None) -> dict:
        entries = self.repository.list_queue(department_id=department_id)
        waits = [e.get("estimated_wait", 0) or 0 for e in entries]
        return {
            "total_waiting": len(entries),
            "avg_wait_minutes": (sum(waits) / len(waits)) if waits else 0.0,
            "longest_wait_minutes": max(waits) if waits else 0,
        }

    def create_kiosk_session(self, data: KioskSessionCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_kiosk_session(payload)
        default_bus.publish(DomainEvent(name="KioskSessionStarted", payload={"session_id": record["id"]}))
        return record

    def end_kiosk_session(self, session_id: int) -> dict:
        record = self.repository.end_kiosk_session(session_id)
        default_bus.publish(DomainEvent(name="KioskSessionEnded", payload={"session_id": session_id}))
        return record

    def clear(self) -> None:
        self.repository.clear()
