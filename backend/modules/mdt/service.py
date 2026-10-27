"""MDT service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import MDTRepository
from .schemas import MDTAttendeeCreate, MDTDecisionCreate, MDTMeetingCreate, MDTMeetingUpdate


class MDTService:
    def __init__(self, repository: MDTRepository | None = None) -> None:
        self.repository = repository or MDTRepository()

    def schedule_meeting(self, data: MDTMeetingCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_meeting(payload)
        default_bus.publish(DomainEvent(name="MDTMeetingScheduled", payload={"meeting_id": record["id"]}))
        return record

    def get_meeting(self, meeting_id: int) -> dict:
        record = self.repository.get_meeting(meeting_id)
        if record is None:
            raise NotFoundError("MDTMeeting", meeting_id)
        record["attendees"] = self.repository.list_attendees(meeting_id)
        record["decisions"] = self.repository.list_decisions(meeting_id)
        return record

    def update_meeting(self, meeting_id: int, data: MDTMeetingUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        record = self.repository.update_meeting(meeting_id, payload)
        default_bus.publish(DomainEvent(name="MDTMeetingUpdated", payload={"meeting_id": meeting_id}))
        return record

    def start_meeting(self, meeting_id: int) -> dict:
        return self.repository.update_meeting(meeting_id, {"status": "in_progress"})

    def complete_meeting(self, meeting_id: int, notes: str | None = None) -> dict:
        payload = {"status": "completed"}
        if notes:
            payload["notes"] = notes
        record = self.repository.update_meeting(meeting_id, payload)
        default_bus.publish(DomainEvent(name="MDTMeetingCompleted", payload={"meeting_id": meeting_id}))
        return record

    def cancel_meeting(self, meeting_id: int) -> dict:
        return self.repository.update_meeting(meeting_id, {"status": "cancelled"})

    def list_meetings(self, params: PageParams, patient_id: int | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_meetings(params, patient_id=patient_id, status=status)

    def add_attendee(self, data: MDTAttendeeCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.add_attendee(payload)
        default_bus.publish(DomainEvent(name="MDTAttendeeAdded", payload={"attendee_id": record["id"]}))
        return record

    def list_attendees(self, meeting_id: int) -> list[dict]:
        return self.repository.list_attendees(meeting_id)

    def mark_attended(self, attendee_id: int) -> dict:
        return self.repository.mark_attended(attendee_id)

    def add_decision(self, data: MDTDecisionCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.add_decision(payload)
        default_bus.publish(DomainEvent(name="MDTDecisionAdded", payload={"decision_id": record["id"]}))
        return record

    def list_decisions(self, meeting_id: int) -> list[dict]:
        return self.repository.list_decisions(meeting_id)

    def update_decision(self, decision_id: int, status: str) -> dict:
        return self.repository.update_decision(decision_id, {"status": status})

    def close_decision(self, decision_id: int) -> dict:
        return self.update_decision(decision_id, "closed")

    def meetings_for_patient(self, patient_id: int) -> list[dict]:
        result = self.repository.list_meetings(PageParams(page=1, per_page=100), patient_id=patient_id)
        return list(result.items)

    def attendance_rate(self, meeting_id: int) -> float:
        attendees = self.repository.list_attendees(meeting_id)
        if not attendees:
            return 0.0
        attended = sum(1 for a in attendees if a.get("attended"))
        return attended / len(attendees)

    def clear(self) -> None:
        self.repository.clear()
