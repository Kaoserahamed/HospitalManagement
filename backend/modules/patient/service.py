"""Patient service (business logic)."""

from __future__ import annotations

from typing import Any, Optional

from backend.shared.errors import ConflictError, NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import PatientRepository
from .schemas import PatientCreate, PatientUpdate


class PatientService:
    def __init__(self, repository: PatientRepository | None = None) -> None:
        self.repository = repository or PatientRepository()

    def create(self, data: PatientCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("first_name") or not payload.get("last_name"):
            raise ValidationError("first_name and last_name are required")
        if payload.get("dob") is None:
            raise ValidationError("dob is required")
        record = self.repository.create(payload)
        default_bus.publish(DomainEvent(name="PatientRegistered", payload={"patient_id": record["id"]}))
        return record

    def get(self, patient_id: int) -> dict:
        return self.repository.get_or_raise(patient_id)

    def update(self, patient_id: int, data: PatientUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        if "first_name" in payload and not payload["first_name"]:
            raise ValidationError("first_name cannot be empty")
        record = self.repository.update(patient_id, payload)
        default_bus.publish(DomainEvent(name="PatientUpdated", payload={"patient_id": patient_id}))
        return record

    def delete(self, patient_id: int) -> bool:
        if not self.repository.delete(patient_id):
            raise NotFoundError("Patient", patient_id)
        default_bus.publish(DomainEvent(name="PatientDeleted", payload={"patient_id": patient_id}))
        return True

    def list(self, params: PageParams, search: str | None = None, status: str | None = None) -> PageResult:
        return self.repository.list(params, search=search, status=status)

    def find_by_user(self, user_id: int) -> Optional[dict]:
        return self.repository.find_by_user(user_id)

    def count(self) -> int:
        return self.repository.count()

    def add_allergy(self, patient_id: int, substance: str, reaction: str | None = None, severity: str | None = None) -> dict:
        patient = self.repository.get_or_raise(patient_id)
        allergies = patient.setdefault("allergies", [])
        entry = {"substance": substance, "reaction": reaction, "severity": severity}
        allergies.append(entry)
        self.repository.update(patient_id, {"allergies": allergies})
        default_bus.publish(DomainEvent(name="AllergyRecorded", payload={"patient_id": patient_id, "substance": substance}))
        return entry

    def update_insurance(self, patient_id: int, data: dict) -> dict:
        patient = self.repository.get_or_raise(patient_id)
        insurance = dict(data)
        self.repository.update(patient_id, {"insurance": insurance})
        default_bus.publish(DomainEvent(name="InsuranceUpdated", payload={"patient_id": patient_id}))
        return insurance

    def search(self, query: str, limit: int = 20) -> list[dict]:
        params = PageParams(page=1, per_page=limit)
        result = self.repository.list(params, search=query)
        return list(result.items)

    def bulk_import(self, items: list[dict]) -> list[dict]:
        created = []
        for item in items:
            created.append(self.create(item))
        return created

    def deactivate(self, patient_id: int) -> dict:
        return self.update(patient_id, {"status": "inactive", "is_active": False})

    def reactivate(self, patient_id: int) -> dict:
        return self.update(patient_id, {"status": "active", "is_active": True})
