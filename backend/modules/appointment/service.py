"""Appointment service (business logic)."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Optional

from backend.shared.errors import ConflictError, NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import AppointmentRepository
from .schemas import AppointmentCreate, AppointmentUpdate, ConflictCheck


class AppointmentService:
    def __init__(self, repository: AppointmentRepository | None = None) -> None:
        self.repository = repository or AppointmentRepository()

    def create(self, data: AppointmentCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        self._validate_times(payload)
        conflicts = self.repository.find_conflicts(
            payload["doctor_id"], payload["start_time"], payload["end_time"]
        )
        if conflicts:
            raise ConflictError("Appointment conflicts with existing booking", details=conflicts)
        record = self.repository.create(payload)
        default_bus.publish(DomainEvent(name="AppointmentBooked", payload={"appointment_id": record["id"]}))
        return record

    def get(self, appointment_id: int) -> dict:
        record = self.repository.get(appointment_id)
        if record is None:
            raise NotFoundError("Appointment", appointment_id)
        return record

    def update(self, appointment_id: int, data: AppointmentUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        existing = self.repository.get_or_raise(appointment_id)
        merged = {**existing, **payload}
        if "start_time" in payload or "end_time" in payload:
            self._validate_times(merged)
            conflicts = self.repository.find_conflicts(
                merged["doctor_id"], merged["start_time"], merged["end_time"], exclude_id=appointment_id
            )
            if conflicts:
                raise ConflictError("Updated time conflicts with existing booking", details=conflicts)
        record = self.repository.update(appointment_id, payload)
        default_bus.publish(DomainEvent(name="AppointmentUpdated", payload={"appointment_id": appointment_id}))
        return record

    def cancel(self, appointment_id: int, reason: str | None = None) -> dict:
        record = self.repository.update(appointment_id, {"status": "cancelled", "notes": reason})
        default_bus.publish(DomainEvent(name="AppointmentCancelled", payload={"appointment_id": appointment_id, "reason": reason}))
        return record

    def complete(self, appointment_id: int, notes: str | None = None) -> dict:
        payload = {"status": "completed"}
        if notes:
            payload["notes"] = notes
        record = self.repository.update(appointment_id, payload)
        default_bus.publish(DomainEvent(name="AppointmentCompleted", payload={"appointment_id": appointment_id}))
        return record

    def mark_no_show(self, appointment_id: int) -> dict:
        record = self.repository.update(appointment_id, {"status": "no_show"})
        default_bus.publish(DomainEvent(name="AppointmentNoShow", payload={"appointment_id": appointment_id}))
        return record

    def delete(self, appointment_id: int) -> bool:
        if not self.repository.delete(appointment_id):
            raise NotFoundError("Appointment", appointment_id)
        return True

    def list(self, params: PageParams, **filters) -> PageResult:
        return self.repository.list(params, **filters)

    def check_conflict(self, check: ConflictCheck) -> dict:
        conflicts = self.repository.find_conflicts(
            check.doctor_id, check.start_time, check.end_time, exclude_id=check.exclude_appointment_id
        )
        return {"has_conflict": bool(conflicts), "conflicts": conflicts}

    def available_slots(self, doctor_id: int) -> list[dict]:
        return self.repository.list_slots(doctor_id=doctor_id, available_only=True)

    def create_slot(self, doctor_id: int, start_time: datetime, end_time: datetime) -> dict:
        if start_time >= end_time:
            raise ValidationError("start_time must be before end_time")
        return self.repository.create_slot({"doctor_id": doctor_id, "start_time": start_time, "end_time": end_time})

    def book_slot(self, slot_id: int, appointment_id: int) -> dict:
        return self.repository.book_slot(slot_id, appointment_id)

    def free_slot(self, slot_id: int) -> dict:
        return self.repository.free_slot(slot_id)

    def reschedule(self, appointment_id: int, new_start: datetime, new_end: datetime) -> dict:
        return self.update(appointment_id, {"start_time": new_start, "end_time": new_end, "status": "scheduled"})

    def for_doctor(self, doctor_id: int, params: PageParams) -> PageResult:
        return self.repository.list(params, doctor_id=doctor_id)

    def for_patient(self, patient_id: int, params: PageParams) -> PageResult:
        return self.repository.list(params, patient_id=patient_id)

    def upcoming(self, doctor_id: int, params: PageParams) -> PageResult:
        now = datetime.utcnow()
        return self.repository.list(params, doctor_id=doctor_id, start_from=now)

    def _validate_times(self, payload: dict) -> None:
        start = payload.get("start_time")
        end = payload.get("end_time")
        if start is None or end is None:
            raise ValidationError("start_time and end_time are required")
        if start >= end:
            raise ValidationError("start_time must be before end_time")
        if (end - start).total_seconds() < 60:
            raise ValidationError("appointment must be at least 1 minute")
