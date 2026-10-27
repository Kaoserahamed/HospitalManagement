"""EHR service."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import EHRRepository
from .schemas import (
    EncounterCreate,
    EncounterUpdate,
    VitalCreate,
    DiagnosisCreate,
    LabResultCreate,
    PrescriptionCreate,
)


class EHRService:
    def __init__(self, repository: EHRRepository | None = None) -> None:
        self.repository = repository or EHRRepository()

    def create_encounter(self, data: EncounterCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("patient_id") or not payload.get("doctor_id"):
            raise ValidationError("patient_id and doctor_id are required")
        record = self.repository.create_encounter(payload)
        default_bus.publish(DomainEvent(name="EncounterCreated", payload={"encounter_id": record["id"]}))
        return record

    def get_encounter(self, encounter_id: int) -> dict:
        record = self.repository.get_encounter(encounter_id)
        if record is None:
            raise NotFoundError("Encounter", encounter_id)
        return record

    def update_encounter(self, encounter_id: int, data: EncounterUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        record = self.repository.update_encounter(encounter_id, payload)
        default_bus.publish(DomainEvent(name="EncounterUpdated", payload={"encounter_id": encounter_id}))
        return record

    def finalize_encounter(self, encounter_id: int, finalized_by: int | None = None) -> dict:
        payload = {"status": "finalized", "finalized_at": datetime.utcnow()}
        if finalized_by is not None:
            payload["finalized_by"] = finalized_by
        record = self.repository.update_encounter(encounter_id, payload)
        default_bus.publish(DomainEvent(name="EncounterFinalized", payload={"encounter_id": encounter_id}))
        return record

    def delete_encounter(self, encounter_id: int) -> bool:
        if not self.repository.delete_encounter(encounter_id):
            raise NotFoundError("Encounter", encounter_id)
        return True

    def list_encounters(self, params: PageParams, patient_id: int | None = None, doctor_id: int | None = None) -> PageResult:
        return self.repository.list_encounters(params, patient_id=patient_id, doctor_id=doctor_id)

    def add_vital(self, data: VitalCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        return self.repository.add_vital(payload["encounter_id"], payload)

    def list_vitals(self, encounter_id: int) -> list[dict]:
        return self.repository.list_vitals(encounter_id)

    def add_diagnosis(self, data: DiagnosisCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        return self.repository.add_diagnosis(payload["encounter_id"], payload)

    def list_diagnoses(self, encounter_id: int) -> list[dict]:
        return self.repository.list_diagnoses(encounter_id)

    def add_lab_result(self, data: LabResultCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        return self.repository.add_lab(payload["encounter_id"], payload)

    def list_lab_results(self, encounter_id: int) -> list[dict]:
        return self.repository.list_labs(encounter_id)

    def add_prescription(self, data: PrescriptionCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.add_prescription(payload["encounter_id"], payload)
        default_bus.publish(DomainEvent(name="PrescriptionIssued", payload={"prescription_id": record["id"]}))
        return record

    def list_prescriptions(self, encounter_id: int) -> list[dict]:
        return self.repository.list_prescriptions(encounter_id)

    def soap_note(self, encounter_id: int, subjective: str, objective: str, assessment: str, plan: str) -> dict:
        return self.update_encounter(encounter_id, {
            "subjective": subjective,
            "objective": objective,
            "assessment": assessment,
            "plan": plan,
        })

    def patient_history(self, patient_id: int, params: PageParams) -> PageResult:
        return self.list_encounters(params, patient_id=patient_id)

    def count(self) -> int:
        return self.repository.count()
