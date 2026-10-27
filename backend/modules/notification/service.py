"""Notification service."""

from __future__ import annotations

from backend.shared.errors import NotFoundError
from backend.shared.events import DomainEvent, default_bus
from backend.shared.pagination import PageParams, PageResult

from .repository import NotificationRepository
from .schemas import BulkNotificationCreate, NotificationCreate, NotificationTemplateCreate


class NotificationService:
    def __init__(self, repository: NotificationRepository | None = None) -> None:
        self.repository = repository or NotificationRepository()

    def send(self, data: NotificationCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create(payload)
        default_bus.publish(
            DomainEvent(name="NotificationSent", payload={"notification_id": record["id"]})
        )
        return record

    def send_bulk(self, data: BulkNotificationCreate | dict) -> list[dict]:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        results = []
        for rid in payload["recipient_ids"]:
            notif = self.repository.create(
                {
                    "recipient_id": rid,
                    "channel": payload.get("channel", "in_app"),
                    "subject": payload.get("subject"),
                    "body": payload["body"],
                }
            )
            results.append(notif)
        default_bus.publish(
            DomainEvent(name="BulkNotificationSent", payload={"count": len(results)})
        )
        return results

    def get(self, notification_id: int) -> dict:
        record = self.repository.get(notification_id)
        if record is None:
            raise NotFoundError("Notification", notification_id)
        return record

    def list(
        self,
        params: PageParams,
        recipient_id: int | None = None,
        status: str | None = None,
        unread_only: bool = False,
    ) -> PageResult:
        return self.repository.list(
            params, recipient_id=recipient_id, status=status, unread_only=unread_only
        )

    def mark_read(self, notification_id: int) -> dict:
        return self.repository.mark_read(notification_id)

    def mark_all_read(self, recipient_id: int) -> int:
        return self.repository.mark_all_read(recipient_id)

    def unread_count(self, recipient_id: int) -> int:
        return self.repository.count_unread(recipient_id)

    def create_template(self, data: NotificationTemplateCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_template(payload)
        default_bus.publish(
            DomainEvent(name="TemplateCreated", payload={"template_id": record["id"]})
        )
        return record

    def get_template(self, name: str) -> dict:
        record = self.repository.get_template(name)
        if record is None:
            raise NotFoundError("NotificationTemplate", name)
        return record

    def list_templates(self) -> list[dict]:
        return self.repository.list_templates()

    def render_template(self, name: str, context: dict) -> dict:
        template = self.get_template(name)
        body = template["body_template"]
        for key, value in context.items():
            body = body.replace(f"{{{{{key}}}}}", str(value))
        return {
            "subject": template.get("subject"),
            "body": body,
            "channel": template.get("channel", "in_app"),
        }

    def notify_appointment_booked(self, patient_id: int, appointment_id: int) -> dict:
        return self.send(
            {
                "recipient_id": patient_id,
                "channel": "in_app",
                "subject": "Appointment Booked",
                "body": f"Your appointment #{appointment_id} has been booked.",
            }
        )

    def notify_prescription_issued(self, patient_id: int, prescription_id: int) -> dict:
        return self.send(
            {
                "recipient_id": patient_id,
                "channel": "in_app",
                "subject": "New Prescription",
                "body": f"A new prescription #{prescription_id} has been issued.",
            }
        )
