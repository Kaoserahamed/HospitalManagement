"""Patient portal service."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import PatientPortalRepository
from .schemas import (
    MessageCreate,
    MessageUpdate,
    PrescriptionDownloadCreate,
    ReminderCreate,
    ReminderUpdate,
)


class PatientPortalService:
    def __init__(self, repository: PatientPortalRepository | None = None) -> None:
        self.repository = repository or PatientPortalRepository()

    def send_message(self, data: MessageCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload["sender_id"] == payload["recipient_id"]:
            raise ValidationError("Cannot send message to self")
        record = self.repository.create_message(payload)
        default_bus.publish(DomainEvent(name="MessageSent", payload={"message_id": record["id"]}))
        return record

    def get_message(self, message_id: int) -> dict:
        record = self.repository.get_message(message_id)
        if record is None:
            raise NotFoundError("Message", message_id)
        return record

    def list_messages(self, params: PageParams, recipient_id: int | None = None, sender_id: int | None = None, unread_only: bool = False) -> PageResult:
        return self.repository.list_messages(params, recipient_id=recipient_id, sender_id=sender_id, unread_only=unread_only)

    def mark_read(self, message_id: int) -> dict:
        record = self.repository.mark_read(message_id)
        default_bus.publish(DomainEvent(name="MessageRead", payload={"message_id": message_id}))
        return record

    def unread_count(self, recipient_id: int) -> int:
        return self.repository.unread_count(recipient_id)

    def conversations(self, user_id: int) -> list[dict]:
        return self.repository.conversations(user_id)

    def record_download(self, data: PrescriptionDownloadCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_download(payload)
        default_bus.publish(DomainEvent(name="PrescriptionDownloaded", payload={"download_id": record["id"]}))
        return record

    def list_downloads(self, patient_id: int | None = None) -> list[dict]:
        return self.repository.list_downloads(patient_id=patient_id)

    def create_reminder(self, data: ReminderCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_reminder(payload)
        default_bus.publish(DomainEvent(name="ReminderCreated", payload={"reminder_id": record["id"]}))
        return record

    def get_reminder(self, reminder_id: int) -> dict:
        record = self.repository.get_reminder(reminder_id)
        if record is None:
            raise NotFoundError("Reminder", reminder_id)
        return record

    def update_reminder(self, reminder_id: int, data: ReminderUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        return self.repository.update_reminder(reminder_id, payload)

    def list_reminders(self, patient_id: int | None = None, status: str | None = None) -> list[dict]:
        return self.repository.list_reminders(patient_id=patient_id, status=status)

    def pending_reminders(self, patient_id: int | None = None) -> list[dict]:
        return self.repository.pending_reminders(patient_id=patient_id)

    def acknowledge_reminder(self, reminder_id: int) -> dict:
        record = self.repository.acknowledge_reminder(reminder_id)
        default_bus.publish(DomainEvent(name="ReminderAcknowledged", payload={"reminder_id": reminder_id}))
        return record

    def cancel_reminder(self, reminder_id: int) -> dict:
        return self.repository.update_reminder(reminder_id, {"status": "cancelled"})

    def send_appointment_reminder(self, patient_id: int, appointment_id: int, scheduled_at: datetime) -> dict:
        reminder_time = scheduled_at - timedelta(days=1)
        return self.create_reminder({
            "patient_id": patient_id,
            "reminder_type": "appointment",
            "title": "Upcoming Appointment",
            "body": f"You have an appointment (#{appointment_id}) scheduled.",
            "scheduled_at": reminder_time,
            "reference_id": appointment_id,
        })

    def send_medication_reminder(self, patient_id: int, medication: str) -> dict:
        return self.create_reminder({
            "patient_id": patient_id,
            "reminder_type": "medication",
            "title": "Medication Reminder",
            "body": f"Time to take {medication}.",
            "scheduled_at": datetime.utcnow(),
        })

    def send_lab_result_notification(self, patient_id: int, result_id: int) -> dict:
        return self.create_reminder({
            "patient_id": patient_id,
            "reminder_type": "lab_result",
            "title": "Lab Result Available",
            "body": f"Your lab result #{result_id} is now available.",
            "scheduled_at": datetime.utcnow(),
            "reference_id": result_id,
        })

    def portal_summary(self, patient_id: int) -> dict:
        unread = self.repository.unread_count(patient_id)
        pending = len(self.repository.pending_reminders(patient_id=patient_id))
        downloads = len(self.repository.list_downloads(patient_id=patient_id))
        return {"unread_messages": unread, "pending_reminders": pending, "recent_downloads": downloads}

    def clear(self) -> None:
        self.repository.clear()
