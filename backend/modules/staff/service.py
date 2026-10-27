"""Staff service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import ConflictError, NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import StaffRepository
from .schemas import (
    ShiftCreate,
    StaffProfileCreate,
    StaffProfileUpdate,
    TimeOffCreate,
    TimeOffUpdate,
)


class StaffService:
    def __init__(self, repository: StaffRepository | None = None) -> None:
        self.repository = repository or StaffRepository()

    def create_profile(self, data: StaffProfileCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_profile_by_user(payload["user_id"]):
            raise ConflictError("Staff profile already exists for this user")
        record = self.repository.create_profile(payload)
        default_bus.publish(DomainEvent(name="StaffProfileCreated", payload={"staff_id": record["id"]}))
        return record

    def get_profile(self, profile_id: int) -> dict:
        record = self.repository.get_profile(profile_id)
        if record is None:
            raise NotFoundError("StaffProfile", profile_id)
        return record

    def get_profile_by_user(self, user_id: int) -> dict:
        record = self.repository.get_profile_by_user(user_id)
        if record is None:
            raise NotFoundError("StaffProfile", user_id)
        return record

    def update_profile(self, profile_id: int, data: StaffProfileUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        record = self.repository.update_profile(profile_id, payload)
        default_bus.publish(DomainEvent(name="StaffProfileUpdated", payload={"staff_id": profile_id}))
        return record

    def list_profiles(self, params: PageParams, department_id: int | None = None, active_only: bool = False) -> PageResult:
        return self.repository.list_profiles(params, department_id=department_id, active_only=active_only)

    def create_shift(self, data: ShiftCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload["start_time"] >= payload["end_time"]:
            raise ValidationError("start_time must be before end_time")
        conflicts = self.repository.find_shift_conflicts(payload["staff_id"], payload["start_time"], payload["end_time"])
        if conflicts:
            raise ConflictError("Shift conflicts with existing shift", details=conflicts)
        record = self.repository.create_shift(payload)
        default_bus.publish(DomainEvent(name="ShiftCreated", payload={"shift_id": record["id"]}))
        return record

    def get_shift(self, shift_id: int) -> dict:
        record = self.repository.get_shift(shift_id)
        if record is None:
            raise NotFoundError("Shift", shift_id)
        return record

    def list_shifts(self, staff_id: int | None = None, department_id: int | None = None) -> list[dict]:
        return self.repository.list_shifts(staff_id=staff_id, department_id=department_id)

    def request_time_off(self, data: TimeOffCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload["start_date"] > payload["end_date"]:
            raise ValidationError("start_date must be before end_date")
        record = self.repository.create_time_off(payload)
        default_bus.publish(DomainEvent(name="TimeOffRequested", payload={"request_id": record["id"]}))
        return record

    def approve_time_off(self, request_id: int, reviewer_id: int) -> dict:
        return self.repository.update_time_off(request_id, {"status": "approved", "reviewed_by": reviewer_id})

    def reject_time_off(self, request_id: int, reviewer_id: int) -> dict:
        return self.repository.update_time_off(request_id, {"status": "rejected", "reviewed_by": reviewer_id})

    def list_time_off(self, staff_id: int | None = None, status: str | None = None) -> list[dict]:
        return self.repository.list_time_off(staff_id=staff_id, status=status)

    def create_roster_entry(self, department_id: int, date_value, staff_id: int, shift_type: str = "morning") -> dict:
        return self.repository.create_roster_entry({
            "department_id": department_id,
            "date": date_value,
            "staff_id": staff_id,
            "shift_type": shift_type,
        })

    def list_roster(self, department_id: int | None = None, date_value=None) -> list[dict]:
        return self.repository.list_roster(department_id=department_id, date_value=date_value)

    def coverage_gaps(self, department_id: int, date_value) -> list[dict]:
        roster = self.repository.list_roster(department_id=department_id, date_value=date_value)
        return [] if roster else [{"department_id": department_id, "date": date_value, "gap": "no_coverage"}]

    def deactivate(self, profile_id: int) -> dict:
        return self.update_profile(profile_id, {"is_active": False})

    def count(self) -> int:
        return self.repository.count_profiles()
