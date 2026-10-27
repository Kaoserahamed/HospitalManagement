"""Check-in repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


PRIORITY_ORDER = {"emergency": 0, "urgent": 1, "normal": 2}


class CheckInRepository:
    def __init__(self) -> None:
        self._checkins: dict[int, dict] = {}
        self._queue: dict[int, dict] = {}
        self._kiosks: dict[int, dict] = {}
        self._counters = {"checkin": 0, "queue": 0, "kiosk": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_checkin(self, data: dict) -> dict:
        cid = self._next("checkin")
        record = {"id": cid, **data, "status": data.get("status", "checked_in")}
        self._checkins[cid] = record
        return dict(record)

    def get_checkin(self, checkin_id: int) -> Optional[dict]:
        record = self._checkins.get(checkin_id)
        return dict(record) if record else None

    def update_checkin(self, checkin_id: int, data: dict) -> dict:
        record = self._checkins.get(checkin_id)
        if record is None:
            raise KeyError(f"CheckIn {checkin_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._checkins[checkin_id] = record
        return dict(record)

    def list_checkins(self, params: PageParams, status: str | None = None, department_id: int | None = None) -> PageResult:
        items = list(self._checkins.values())
        if status is not None:
            items = [c for c in items if c.get("status") == status]
        if department_id is not None:
            items = [c for c in items if c.get("department_id") == department_id]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def enqueue(self, data: dict) -> dict:
        qid = self._next("queue")
        record = {"id": qid, **data}
        self._queue[qid] = record
        return dict(record)

    def get_queue_entry(self, entry_id: int) -> Optional[dict]:
        record = self._queue.get(entry_id)
        return dict(record) if record else None

    def list_queue(self, department_id: int | None = None) -> list[dict]:
        items = list(self._queue.values())
        if department_id is not None:
            items = [q for q in items if q.get("department_id") == department_id]
        items.sort(key=lambda q: (PRIORITY_ORDER.get(q.get("priority", "normal"), 2), q.get("position", 0)))
        return [dict(q) for q in items]

    def remove_from_queue(self, entry_id: int) -> bool:
        return self._queue.pop(entry_id, None) is not None

    def next_in_queue(self, department_id: int | None = None) -> Optional[dict]:
        queue = self.list_queue(department_id=department_id)
        return queue[0] if queue else None

    def create_kiosk_session(self, data: dict) -> dict:
        kid = self._next("kiosk")
        record = {"id": kid, **data}
        self._kiosks[kid] = record
        return dict(record)

    def end_kiosk_session(self, session_id: int) -> dict:
        record = self._kiosks.get(session_id)
        if record is None:
            raise KeyError(f"Kiosk session {session_id} not found")
        record["ended_at"] = datetime.utcnow()
        self._kiosks[session_id] = record
        return dict(record)

    def waiting_count(self, department_id: int | None = None) -> int:
        items = [c for c in self._checkins.values() if c.get("status") in ("checked_in", "waiting")]
        if department_id is not None:
            items = [c for c in items if c.get("department_id") == department_id]
        return len(items)

    def clear(self) -> None:
        self._checkins.clear()
        self._queue.clear()
        self._kiosks.clear()
        for k in self._counters:
            self._counters[k] = 0
