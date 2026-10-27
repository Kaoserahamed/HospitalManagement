"""Staff repository."""

from __future__ import annotations

from datetime import date
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class StaffRepository:
    def __init__(self) -> None:
        self._profiles: dict[int, dict] = {}
        self._shifts: dict[int, dict] = {}
        self._time_off: dict[int, dict] = {}
        self._rosters: dict[int, dict] = {}
        self._counters = {"profile": 0, "shift": 0, "timeoff": 0, "roster": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_profile(self, data: dict) -> dict:
        pid = self._next("profile")
        record = {"id": pid, **data, "is_active": data.get("is_active", True)}
        self._profiles[pid] = record
        return dict(record)

    def get_profile(self, profile_id: int) -> Optional[dict]:
        record = self._profiles.get(profile_id)
        return dict(record) if record else None

    def get_profile_by_user(self, user_id: int) -> Optional[dict]:
        for record in self._profiles.values():
            if record.get("user_id") == user_id:
                return dict(record)
        return None

    def update_profile(self, profile_id: int, data: dict) -> dict:
        record = self._profiles.get(profile_id)
        if record is None:
            raise KeyError(f"Staff profile {profile_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._profiles[profile_id] = record
        return dict(record)

    def list_profiles(self, params: PageParams, department_id: int | None = None, active_only: bool = False) -> PageResult:
        items = list(self._profiles.values())
        if department_id is not None:
            items = [p for p in items if p.get("department_id") == department_id]
        if active_only:
            items = [p for p in items if p.get("is_active")]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_shift(self, data: dict) -> dict:
        sid = self._next("shift")
        record = {"id": sid, **data}
        self._shifts[sid] = record
        return dict(record)

    def get_shift(self, shift_id: int) -> Optional[dict]:
        record = self._shifts.get(shift_id)
        return dict(record) if record else None

    def list_shifts(self, staff_id: int | None = None, department_id: int | None = None) -> list[dict]:
        items = list(self._shifts.values())
        if staff_id is not None:
            items = [s for s in items if s.get("staff_id") == staff_id]
        if department_id is not None:
            items = [s for s in items if s.get("department_id") == department_id]
        return [dict(s) for s in items]

    def find_shift_conflicts(self, staff_id: int, start, end) -> list[dict]:
        conflicts = []
        for record in self._shifts.values():
            if record.get("staff_id") != staff_id:
                continue
            if record["start_time"] < end and start < record["end_time"]:
                conflicts.append(dict(record))
        return conflicts

    def create_time_off(self, data: dict) -> dict:
        tid = self._next("timeoff")
        record = {"id": tid, **data, "status": data.get("status", "pending")}
        self._time_off[tid] = record
        return dict(record)

    def get_time_off(self, request_id: int) -> Optional[dict]:
        record = self._time_off.get(request_id)
        return dict(record) if record else None

    def update_time_off(self, request_id: int, data: dict) -> dict:
        record = self._time_off.get(request_id)
        if record is None:
            raise KeyError(f"Time-off request {request_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._time_off[request_id] = record
        return dict(record)

    def list_time_off(self, staff_id: int | None = None, status: str | None = None) -> list[dict]:
        items = list(self._time_off.values())
        if staff_id is not None:
            items = [t for t in items if t.get("staff_id") == staff_id]
        if status is not None:
            items = [t for t in items if t.get("status") == status]
        return [dict(t) for t in items]

    def create_roster_entry(self, data: dict) -> dict:
        rid = self._next("roster")
        record = {"id": rid, **data}
        self._rosters[rid] = record
        return dict(record)

    def list_roster(self, department_id: int | None = None, date_value: date | None = None) -> list[dict]:
        items = list(self._rosters.values())
        if department_id is not None:
            items = [r for r in items if r.get("department_id") == department_id]
        if date_value is not None:
            items = [r for r in items if r.get("date") == date_value]
        return [dict(r) for r in items]

    def count_profiles(self) -> int:
        return len(self._profiles)

    def clear(self) -> None:
        self._profiles.clear()
        self._shifts.clear()
        self._time_off.clear()
        self._rosters.clear()
        for k in self._counters:
            self._counters[k] = 0
