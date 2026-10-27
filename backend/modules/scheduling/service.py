"""Scheduling service."""

from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import SchedulingRepository
from .schemas import (
    AvailabilityCreate,
    CoverageAlertCreate,
    OnCallCreate,
    ShiftSwapCreate,
    ShiftSwapUpdate,
    ShiftTemplateCreate,
)


class SchedulingService:
    def __init__(self, repository: SchedulingRepository | None = None) -> None:
        self.repository = repository or SchedulingRepository()

    def request_swap(self, data: ShiftSwapCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload["requester_id"] == payload["target_id"]:
            raise ValidationError("Cannot swap with self")
        record = self.repository.create_swap(payload)
        default_bus.publish(DomainEvent(name="ShiftSwapRequested", payload={"swap_id": record["id"]}))
        return record

    def get_swap(self, swap_id: int) -> dict:
        record = self.repository.get_swap(swap_id)
        if record is None:
            raise NotFoundError("ShiftSwap", swap_id)
        return record

    def approve_swap(self, swap_id: int, reviewer_id: int) -> dict:
        record = self.repository.update_swap(swap_id, {"status": "approved", "reviewed_by": reviewer_id, "resolved_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="ShiftSwapApproved", payload={"swap_id": swap_id}))
        return record

    def reject_swap(self, swap_id: int, reviewer_id: int) -> dict:
        record = self.repository.update_swap(swap_id, {"status": "rejected", "reviewed_by": reviewer_id, "resolved_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="ShiftSwapRejected", payload={"swap_id": swap_id}))
        return record

    def cancel_swap(self, swap_id: int) -> dict:
        return self.repository.update_swap(swap_id, {"status": "cancelled"})

    def list_swaps(self, status: str | None = None) -> list[dict]:
        return self.repository.list_swaps(status=status)

    def pending_swaps(self) -> list[dict]:
        return self.repository.list_swaps(status="pending")

    def create_oncall(self, data: OnCallCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload["start_time"] >= payload["end_time"]:
            raise ValidationError("start_time must be before end_time")
        record = self.repository.create_oncall(payload)
        default_bus.publish(DomainEvent(name="OnCallScheduled", payload={"oncall_id": record["id"]}))
        return record

    def list_oncall(self, department_id: int | None = None, active_only: bool = False) -> list[dict]:
        return self.repository.list_oncall(department_id=department_id, active_only=active_only)

    def oncall_for_department(self, department_id: int, at_time: datetime | None = None) -> list[dict]:
        at_time = at_time or datetime.utcnow()
        schedules = self.repository.list_oncall(department_id=department_id, active_only=True)
        return [s for s in schedules if s["start_time"] <= at_time <= s["end_time"]]

    def create_coverage_alert(self, data: CoverageAlertCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_alert(payload)
        default_bus.publish(DomainEvent(name="CoverageAlertCreated", payload={"alert_id": record["id"]}))
        return record

    def list_coverage_alerts(self, department_id: int | None = None, acknowledged: bool | None = None) -> list[dict]:
        return self.repository.list_alerts(department_id=department_id, acknowledged=acknowledged)

    def acknowledge_coverage_alert(self, alert_id: int) -> dict:
        return self.repository.acknowledge_alert(alert_id)

    def unacknowledged_alerts(self) -> list[dict]:
        return self.repository.list_alerts(acknowledged=False)

    def create_shift_template(self, data: ShiftTemplateCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_template(payload)
        default_bus.publish(DomainEvent(name="ShiftTemplateCreated", payload={"template_id": record["id"]}))
        return record

    def list_shift_templates(self, department_id: int | None = None) -> list[dict]:
        return self.repository.list_templates(department_id=department_id)

    def apply_template(self, template_id: int, start_date: date, weeks: int = 1) -> list[dict]:
        templates = self.repository.list_templates()
        template = next((t for t in templates if t["id"] == template_id), None)
        if template is None:
            raise NotFoundError("ShiftTemplate", template_id)
        days = [int(d) for d in template["days_of_week"].split(",")]
        created = []
        for w in range(weeks):
            for d in days:
                day_date = start_date + timedelta(days=(w * 7 + d))
                created.append({"template_id": template_id, "date": day_date.isoformat(), "shift_type": template["shift_type"]})
        return created

    def set_availability(self, data: AvailabilityCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_availability(payload)
        return record

    def get_availability(self, staff_id: int) -> list[dict]:
        return self.repository.list_availability(staff_id=staff_id)

    def find_available_staff(self, department_id: int, day_of_week: int, start_time: time, end_time: time) -> list[int]:
        # placeholder: return all staff with availability
        avail = self.repository.list_availability()
        result = []
        for a in avail:
            if a.get("day_of_week") == day_of_week and a.get("is_available") and a.get("start_time") <= start_time and a.get("end_time") >= end_time:
                result.append(a["staff_id"])
        return result

    def detect_coverage_gaps(self, department_id: int, date_value: date, shift_type: str, required: int = 1) -> dict:
        # placeholder gap detection
        return {"department_id": department_id, "date": date_value.isoformat(), "shift_type": shift_type, "required": required, "assigned": 0, "gap": required}

    def generate_schedule(self, department_id: int, start_date: date, days: int = 7) -> list[dict]:
        schedule = []
        for i in range(days):
            d = start_date + timedelta(days=i)
            schedule.append({"date": d.isoformat(), "department_id": department_id, "shifts": []})
        return schedule

    def staff_workload(self, staff_id: int) -> dict:
        return {"staff_id": staff_id, "shifts_this_week": 0, "hours_this_week": 0, "overtime_hours": 0}

    def overtime_alerts(self, threshold_hours: int = 40) -> list[dict]:
        return []

    def clear(self) -> None:
        self.repository.clear()
