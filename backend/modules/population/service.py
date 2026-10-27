"""Population health service."""

from __future__ import annotations

from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import PopulationRepository
from .schemas import OutcomeCreate, PopulationMeasureCreate, RegistryCreate, RegistryMemberCreate


class PopulationService:
    def __init__(self, repository: PopulationRepository | None = None) -> None:
        self.repository = repository or PopulationRepository()

    def create_registry(self, data: RegistryCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_registry(payload)
        default_bus.publish(DomainEvent(name="RegistryCreated", payload={"registry_id": record["id"]}))
        return record

    def get_registry(self, registry_id: int) -> dict:
        record = self.repository.get_registry(registry_id)
        if record is None:
            raise NotFoundError("Registry", registry_id)
        return record

    def list_registries(self) -> list[dict]:
        return self.repository.list_registries()

    def enroll_member(self, data: RegistryMemberCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_registry(payload["registry_id"]) is None:
            raise NotFoundError("Registry", payload["registry_id"])
        record = self.repository.enroll_member(payload)
        default_bus.publish(DomainEvent(name="RegistryMemberEnrolled", payload={"member_id": record["id"]}))
        return record

    def list_members(self, registry_id: int | None = None) -> list[dict]:
        return self.repository.list_members(registry_id=registry_id)

    def create_measure(self, data: PopulationMeasureCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload.get("denominator", 0) > 0:
            payload["rate"] = payload.get("numerator", 0) / payload["denominator"]
        record = self.repository.create_measure(payload)
        default_bus.publish(DomainEvent(name="PopulationMeasureCreated", payload={"measure_id": record["id"]}))
        return record

    def list_measures(self, registry_id: int | None = None) -> list[dict]:
        return self.repository.list_measures(registry_id=registry_id)

    def record_outcome(self, data: OutcomeCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.record_outcome(payload)
        default_bus.publish(DomainEvent(name="OutcomeRecorded", payload={"outcome_id": record["id"]}))
        return record

    def list_outcomes(self, patient_id: int | None = None, registry_id: int | None = None) -> list[dict]:
        return self.repository.list_outcomes(patient_id=patient_id, registry_id=registry_id)

    def patient_registries(self, patient_id: int) -> list[dict]:
        memberships = [m for m in self.repository.list_members() if m.get("patient_id") == patient_id and m.get("status") == "active"]
        registries = []
        for m in memberships:
            reg = self.repository.get_registry(m["registry_id"])
            if reg:
                registries.append(reg)
        return registries

    def registry_summary(self, registry_id: int) -> dict:
        members = self.repository.list_members(registry_id=registry_id)
        measures = self.repository.list_measures(registry_id=registry_id)
        avg_rate = 0.0
        if measures:
            rates = [m.get("rate", 0) for m in measures if m.get("denominator", 0) > 0]
            avg_rate = sum(rates) / len(rates) if rates else 0.0
        return {
            "registry_id": registry_id,
            "member_count": len(members),
            "measure_count": len(measures),
            "average_rate": round(avg_rate, 3),
        }

    def high_risk_patients(self, registry_id: int | None = None) -> list[dict]:
        outcomes = self.repository.list_outcomes(registry_id=registry_id)
        return [o for o in outcomes if o.get("value", 0) > 0.7]

    def count_members(self, registry_id: int | None = None) -> int:
        return self.repository.count_members(registry_id=registry_id)

    def clear(self) -> None:
        self.repository.clear()
