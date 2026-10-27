"""StaffSatisfactionSurvey service."""

from __future__ import annotations

from datetime import datetime

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import DomainEvent, default_bus
from backend.shared.pagination import PageParams, PageResult

from .repository import StaffSatisfactionSurveyRepository
from .schemas import StaffSatisfactionSurveyCreate, StaffSatisfactionSurveyUpdate


class StaffSatisfactionSurveyService:
    def __init__(self, repository: StaffSatisfactionSurveyRepository | None = None) -> None:
        self.repository = repository or StaffSatisfactionSurveyRepository()

    def create(self, data: StaffSatisfactionSurveyCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("title"):
            raise ValidationError("title is required")
        record = self.repository.create(payload)
        default_bus.publish(
            DomainEvent(name="StaffSatisfactionSurveyCreated", payload={"id": record["id"]})
        )
        return record

    def get(self, record_id: int) -> dict:
        record = self.repository.get(record_id)
        if record is None:
            raise NotFoundError("StaffSatisfactionSurvey", record_id)
        return record

    def update(self, record_id: int, data: StaffSatisfactionSurveyUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        record = self.repository.update(record_id, payload)
        default_bus.publish(
            DomainEvent(name="StaffSatisfactionSurveyUpdated", payload={"id": record_id})
        )
        return record

    def delete(self, record_id: int) -> bool:
        if not self.repository.delete(record_id):
            raise NotFoundError("StaffSatisfactionSurvey", record_id)
        default_bus.publish(
            DomainEvent(name="StaffSatisfactionSurveyDeleted", payload={"id": record_id})
        )
        return True

    def list(
        self,
        params: PageParams,
        patient_id: int | None = None,
        status: str | None = None,
        priority: str | None = None,
        category: str | None = None,
        is_active: bool | None = None,
    ) -> PageResult:
        return self.repository.list(
            params,
            patient_id=patient_id,
            status=status,
            priority=priority,
            category=category,
            is_active=is_active,
        )

    def list_all(self, patient_id: int | None = None, status: str | None = None) -> list[dict]:
        return self.repository.list_all(patient_id=patient_id, status=status)

    def count(self) -> int:
        return self.repository.count()

    def count_by_status(self, status: str) -> int:
        return self.repository.count_by_status(status)

    def count_by_patient(self, patient_id: int) -> int:
        return self.repository.count_by_patient(patient_id)

    def search(self, query: str) -> list[dict]:
        if not query.strip():
            return []
        return self.repository.search(query)

    def activate(self, record_id: int) -> dict:
        record = self.repository.activate(record_id)
        default_bus.publish(
            DomainEvent(name="StaffSatisfactionSurveyActivated", payload={"id": record_id})
        )
        return record

    def deactivate(self, record_id: int) -> dict:
        record = self.repository.deactivate(record_id)
        default_bus.publish(
            DomainEvent(name="StaffSatisfactionSurveyDeactivated", payload={"id": record_id})
        )
        return record

    def complete(self, record_id: int, notes: str | None = None) -> dict:
        record = self.repository.complete(record_id, notes=notes)
        default_bus.publish(
            DomainEvent(name="StaffSatisfactionSurveyCompleted", payload={"id": record_id})
        )
        return record

    def cancel(self, record_id: int, reason: str | None = None) -> dict:
        record = self.repository.cancel(record_id, reason=reason)
        default_bus.publish(
            DomainEvent(name="StaffSatisfactionSurveyCancelled", payload={"id": record_id})
        )
        return record

    def by_patient(self, patient_id: int) -> list[dict]:
        return self.repository.list_all(patient_id=patient_id)

    def active_records(self, patient_id: int | None = None) -> list[dict]:
        return self.repository.list_all(patient_id=patient_id, status="active")

    def overdue(self, days: int = 7) -> list[dict]:
        cutoff = datetime.utcnow()
        result = []
        for r in self.repository.list_all():
            if r.get("status") not in ("completed", "cancelled") and r.get("due_date"):
                try:
                    due = datetime.fromisoformat(r["due_date"])
                    if due < cutoff:
                        result.append(r)
                except (ValueError, TypeError):
                    pass
        return result

    def summary(self, patient_id: int | None = None) -> dict:
        items = self.repository.list_all(patient_id=patient_id)
        statuses: dict[str, int] = {}
        for r in items:
            st = r.get("status", "unknown")
            statuses[st] = statuses.get(st, 0) + 1
        return {
            "total": len(items),
            "by_status": statuses,
            "active": sum(1 for r in items if r.get("status") == "active"),
            "completed": sum(1 for r in items if r.get("status") == "completed"),
        }

    def clear(self) -> None:
        self.repository.clear()
