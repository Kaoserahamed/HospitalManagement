"""MDT repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class MDTRepository:
    def __init__(self) -> None:
        self._meetings: dict[int, dict] = {}
        self._attendees: dict[int, dict] = {}
        self._decisions: dict[int, dict] = {}
        self._counters = {"meeting": 0, "attendee": 0, "decision": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_meeting(self, data: dict) -> dict:
        mid = self._next("meeting")
        record = {"id": mid, **data, "status": data.get("status", "scheduled")}
        self._meetings[mid] = record
        return dict(record)

    def get_meeting(self, meeting_id: int) -> Optional[dict]:
        record = self._meetings.get(meeting_id)
        return dict(record) if record else None

    def update_meeting(self, meeting_id: int, data: dict) -> dict:
        record = self._meetings.get(meeting_id)
        if record is None:
            raise KeyError(f"Meeting {meeting_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._meetings[meeting_id] = record
        return dict(record)

    def list_meetings(self, params: PageParams, patient_id: int | None = None, status: str | None = None) -> PageResult:
        items = list(self._meetings.values())
        if patient_id is not None:
            items = [m for m in items if m.get("patient_id") == patient_id]
        if status is not None:
            items = [m for m in items if m.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def add_attendee(self, data: dict) -> dict:
        aid = self._next("attendee")
        record = {"id": aid, **data, "attended": False}
        self._attendees[aid] = record
        return dict(record)

    def list_attendees(self, meeting_id: int) -> list[dict]:
        return [dict(a) for a in self._attendees.values() if a.get("meeting_id") == meeting_id]

    def mark_attended(self, attendee_id: int) -> dict:
        record = self._attendees.get(attendee_id)
        if record is None:
            raise KeyError(f"Attendee {attendee_id} not found")
        record["attended"] = True
        self._attendees[attendee_id] = record
        return dict(record)

    def add_decision(self, data: dict) -> dict:
        did = self._next("decision")
        record = {"id": did, **data, "status": data.get("status", "open")}
        self._decisions[did] = record
        return dict(record)

    def list_decisions(self, meeting_id: int) -> list[dict]:
        return [dict(d) for d in self._decisions.values() if d.get("meeting_id") == meeting_id]

    def update_decision(self, decision_id: int, data: dict) -> dict:
        record = self._decisions.get(decision_id)
        if record is None:
            raise KeyError(f"Decision {decision_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._decisions[decision_id] = record
        return dict(record)

    def clear(self) -> None:
        self._meetings.clear()
        self._attendees.clear()
        self._decisions.clear()
        for k in self._counters:
            self._counters[k] = 0
