"""Scheduling repository."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class SchedulingRepository:
    def __init__(self) -> None:
        self._swaps: dict[int, dict] = {}
        self._oncall: dict[int, dict] = {}
        self._alerts: dict[int, dict] = {}
        self._templates: dict[int, dict] = {}
        self._availability: dict[int, dict] = {}
        self._counters = {"swap": 0, "oncall": 0, "alert": 0, "template": 0, "avail": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_swap(self, data: dict) -> dict:
        sid = self._next("swap")
        record = {"id": sid, **data, "status": data.get("status", "pending")}
        self._swaps[sid] = record
        return dict(record)

    def get_swap(self, swap_id: int) -> Optional[dict]:
        record = self._swaps.get(swap_id)
        return dict(record) if record else None

    def update_swap(self, swap_id: int, data: dict) -> dict:
        record = self._swaps.get(swap_id)
        if record is None:
            raise KeyError(f"Swap {swap_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._swaps[swap_id] = record
        return dict(record)

    def list_swaps(self, status: str | None = None) -> list[dict]:
        items = list(self._swaps.values())
        if status is not None:
            items = [s for s in items if s.get("status") == status]
        return [dict(s) for s in items]

    def create_oncall(self, data: dict) -> dict:
        oid = self._next("oncall")
        record = {"id": oid, **data, "is_active": data.get("is_active", True)}
        self._oncall[oid] = record
        return dict(record)

    def list_oncall(self, department_id: int | None = None, active_only: bool = False) -> list[dict]:
        items = list(self._oncall.values())
        if department_id is not None:
            items = [o for o in items if o.get("department_id") == department_id]
        if active_only:
            items = [o for o in items if o.get("is_active")]
        return [dict(o) for o in items]

    def create_alert(self, data: dict) -> dict:
        aid = self._next("alert")
        record = {"id": aid, **data, "acknowledged": False}
        self._alerts[aid] = record
        return dict(record)

    def list_alerts(self, department_id: int | None = None, acknowledged: bool | None = None) -> list[dict]:
        items = list(self._alerts.values())
        if department_id is not None:
            items = [a for a in items if a.get("department_id") == department_id]
        if acknowledged is not None:
            items = [a for a in items if a.get("acknowledged") == acknowledged]
        return [dict(a) for a in items]

    def acknowledge_alert(self, alert_id: int) -> dict:
        record = self._alerts.get(alert_id)
        if record is None:
            raise KeyError(f"Alert {alert_id} not found")
        record["acknowledged"] = True
        self._alerts[alert_id] = record
        return dict(record)

    def create_template(self, data: dict) -> dict:
        tid = self._next("template")
        record = {"id": tid, **data, "is_active": data.get("is_active", True)}
        self._templates[tid] = record
        return dict(record)

    def list_templates(self, department_id: int | None = None) -> list[dict]:
        items = list(self._templates.values())
        if department_id is not None:
            items = [t for t in items if t.get("department_id") == department_id]
        return [dict(t) for t in items]

    def create_availability(self, data: dict) -> dict:
        aid = self._next("avail")
        record = {"id": aid, **data}
        self._availability[aid] = record
        return dict(record)

    def list_availability(self, staff_id: int | None = None) -> list[dict]:
        items = list(self._availability.values())
        if staff_id is not None:
            items = [a for a in items if a.get("staff_id") == staff_id]
        return [dict(a) for a in items]

    def clear(self) -> None:
        self._swaps.clear()
        self._oncall.clear()
        self._alerts.clear()
        self._templates.clear()
        self._availability.clear()
        for k in self._counters:
            self._counters[k] = 0
