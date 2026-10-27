"""Telemedicine repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class TelemedicineRepository:
    def __init__(self) -> None:
        self._visits: dict[int, dict] = {}
        self._waiting: dict[int, dict] = {}
        self._metrics: dict[int, list[dict]] = {}
        self._counters = {"visit": 0, "waiting": 0, "metric": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_visit(self, data: dict) -> dict:
        vid = self._next("visit")
        record = {"id": vid, **data, "status": data.get("status", "scheduled")}
        self._visits[vid] = record
        self._metrics[vid] = []
        return dict(record)

    def get_visit(self, visit_id: int) -> Optional[dict]:
        record = self._visits.get(visit_id)
        return dict(record) if record else None

    def update_visit(self, visit_id: int, data: dict) -> dict:
        record = self._visits.get(visit_id)
        if record is None:
            raise KeyError(f"Visit {visit_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._visits[visit_id] = record
        return dict(record)

    def delete_visit(self, visit_id: int) -> bool:
        return self._visits.pop(visit_id, None) is not None

    def list_visits(self, params: PageParams, patient_id: int | None = None, doctor_id: int | None = None, status: str | None = None) -> PageResult:
        items = list(self._visits.values())
        if patient_id is not None:
            items = [v for v in items if v.get("patient_id") == patient_id]
        if doctor_id is not None:
            items = [v for v in items if v.get("doctor_id") == doctor_id]
        if status is not None:
            items = [v for v in items if v.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def add_to_waiting_room(self, data: dict) -> dict:
        wid = self._next("waiting")
        record = {"id": wid, **data, "is_admitted": False}
        self._waiting[wid] = record
        return dict(record)

    def list_waiting_room(self, admitted: bool | None = None) -> list[dict]:
        items = list(self._waiting.values())
        if admitted is not None:
            items = [w for w in items if w.get("is_admitted") == admitted]
        return [dict(w) for w in items]

    def admit(self, waiting_id: int) -> dict:
        record = self._waiting.get(waiting_id)
        if record is None:
            raise KeyError(f"Waiting room entry {waiting_id} not found")
        record["is_admitted"] = True
        self._waiting[waiting_id] = record
        return dict(record)

    def record_metric(self, data: dict) -> dict:
        mid = self._next("metric")
        record = {"id": mid, **data}
        vid = data["visit_id"]
        self._metrics.setdefault(vid, []).append(record)
        return dict(record)

    def list_metrics(self, visit_id: int) -> list[dict]:
        return [dict(m) for m in self._metrics.get(visit_id, [])]

    def count_visits(self) -> int:
        return len(self._visits)

    def clear(self) -> None:
        self._visits.clear()
        self._waiting.clear()
        self._metrics.clear()
        for k in self._counters:
            self._counters[k] = 0
