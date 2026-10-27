"""Appointment repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional, Sequence

from backend.shared.pagination import PageParams, PageResult, paginate

from .models import overlaps


class AppointmentRepository:
    def __init__(self) -> None:
        self._store: dict[int, dict] = {}
        self._slots: dict[int, dict] = {}
        self._counter: int = 0
        self._slot_counter: int = 0

    def _next_id(self) -> int:
        self._counter += 1
        return self._counter

    def _next_slot_id(self) -> int:
        self._slot_counter += 1
        return self._slot_counter

    def create(self, data: dict) -> dict:
        aid = self._next_id()
        record = {"id": aid, **data, "status": data.get("status", "scheduled")}
        self._store[aid] = record
        return dict(record)

    def get(self, appointment_id: int) -> Optional[dict]:
        record = self._store.get(appointment_id)
        return dict(record) if record else None

    def get_or_raise(self, appointment_id: int) -> dict:
        record = self.get(appointment_id)
        if record is None:
            raise KeyError(f"Appointment {appointment_id} not found")
        return record

    def update(self, appointment_id: int, data: dict) -> dict:
        record = self.get_or_raise(appointment_id)
        record.update({k: v for k, v in data.items() if v is not None})
        self._store[appointment_id] = record
        return dict(record)

    def delete(self, appointment_id: int) -> bool:
        return self._store.pop(appointment_id, None) is not None

    def list(self, params: PageParams, doctor_id: int | None = None, patient_id: int | None = None,
             status: str | None = None, start_from: datetime | None = None,
             start_to: datetime | None = None) -> PageResult:
        items = list(self._store.values())
        if doctor_id is not None:
            items = [a for a in items if a.get("doctor_id") == doctor_id]
        if patient_id is not None:
            items = [a for a in items if a.get("patient_id") == patient_id]
        if status is not None:
            items = [a for a in items if a.get("status") == status]
        if start_from is not None:
            items = [a for a in items if a.get("start_time") and a["start_time"] >= start_from]
        if start_to is not None:
            items = [a for a in items if a.get("start_time") and a["start_time"] <= start_to]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def find_conflicts(self, doctor_id: int, start: datetime, end: datetime, exclude_id: int | None = None) -> list[dict]:
        conflicts = []
        for record in self._store.values():
            if record.get("doctor_id") != doctor_id:
                continue
            if exclude_id is not None and record.get("id") == exclude_id:
                continue
            if record.get("status") in ("cancelled", "no_show"):
                continue
            if overlaps(start, end, record["start_time"], record["end_time"]):
                conflicts.append(dict(record))
        return conflicts

    def create_slot(self, data: dict) -> dict:
        sid = self._next_slot_id()
        record = {"id": sid, **data, "is_booked": False}
        self._slots[sid] = record
        return dict(record)

    def get_slot(self, slot_id: int) -> Optional[dict]:
        record = self._slots.get(slot_id)
        return dict(record) if record else None

    def book_slot(self, slot_id: int, appointment_id: int) -> dict:
        slot = self._slots.get(slot_id)
        if slot is None:
            raise KeyError(f"Slot {slot_id} not found")
        if slot.get("is_booked"):
            raise ValueError(f"Slot {slot_id} already booked")
        slot["is_booked"] = True
        slot["appointment_id"] = appointment_id
        self._slots[slot_id] = slot
        return dict(slot)

    def free_slot(self, slot_id: int) -> dict:
        slot = self._slots.get(slot_id)
        if slot is None:
            raise KeyError(f"Slot {slot_id} not found")
        slot["is_booked"] = False
        slot["appointment_id"] = None
        self._slots[slot_id] = slot
        return dict(slot)

    def list_slots(self, doctor_id: int | None = None, available_only: bool = False) -> list[dict]:
        items = list(self._slots.values())
        if doctor_id is not None:
            items = [s for s in items if s.get("doctor_id") == doctor_id]
        if available_only:
            items = [s for s in items if not s.get("is_booked")]
        return [dict(s) for s in items]

    def count(self) -> int:
        return len(self._store)

    def clear(self) -> None:
        self._store.clear()
        self._slots.clear()
        self._counter = 0
        self._slot_counter = 0
