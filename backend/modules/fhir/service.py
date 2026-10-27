"""FHIR service."""

from __future__ import annotations

import json
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import FHIRRepository
from .schemas import FHIRBundleCreate, FHIRResourceCreate, FHIRSearchRequest, FHIRSubscriptionCreate


class FHIRService:
    def __init__(self, repository: FHIRRepository | None = None) -> None:
        self.repository = repository or FHIRRepository()

    def create_resource(self, data: FHIRResourceCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("resource_type") or not payload.get("resource_id"):
            raise ValidationError("resource_type and resource_id are required")
        record = self.repository.create_resource(payload)
        default_bus.publish(DomainEvent(name="FHIRResourceCreated", payload={"resource_id": record["id"]}))
        return record

    def get_resource(self, resource_type: str, resource_id: str) -> dict:
        record = self.repository.get_resource(resource_type, resource_id)
        if record is None:
            raise NotFoundError("FHIRResource", f"{resource_type}/{resource_id}")
        return record

    def update_resource(self, resource_type: str, resource_id: str, payload: dict) -> dict:
        record = self.repository.update_resource(resource_type, resource_id, payload)
        default_bus.publish(DomainEvent(name="FHIRResourceUpdated", payload={"resource_type": resource_type, "resource_id": resource_id}))
        return record

    def delete_resource(self, resource_type: str, resource_id: str) -> bool:
        if not self.repository.delete_resource(resource_type, resource_id):
            raise NotFoundError("FHIRResource", f"{resource_type}/{resource_id}")
        return True

    def search(self, request: FHIRSearchRequest | dict) -> PageResult:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        params = PageParams(page=payload.get("page", 1), per_page=payload.get("per_page", 20))
        return self.repository.search_resources(params, resource_type=payload.get("resource_type"))

    def create_bundle(self, data: FHIRBundleCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_bundle(payload)
        default_bus.publish(DomainEvent(name="FHIRBundleCreated", payload={"bundle_id": record["id"]}))
        return record

    def get_bundle(self, bundle_id: int) -> dict:
        record = self.repository.get_bundle(bundle_id)
        if record is None:
            raise NotFoundError("FHIRBundle", bundle_id)
        return record

    def create_subscription(self, data: FHIRSubscriptionCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_subscription(payload)
        default_bus.publish(DomainEvent(name="FHIRSubscriptionCreated", payload={"subscription_id": record["id"]}))
        return record

    def list_subscriptions(self, resource_type: str | None = None) -> list[dict]:
        return self.repository.list_subscriptions(resource_type=resource_type)

    def patient_to_fhir(self, patient: dict) -> dict:
        return {
            "resourceType": "Patient",
            "id": str(patient.get("id")),
            "name": [{"given": [patient.get("first_name")], "family": patient.get("last_name")}],
            "gender": patient.get("gender", "unknown"),
            "birthDate": patient.get("dob"),
            "telecom": [{"system": "phone", "value": patient.get("phone")}] if patient.get("phone") else [],
        }

    def observation_to_fhir(self, vital: dict, patient_id: int) -> dict:
        return {
            "resourceType": "Observation",
            "id": str(vital.get("id")),
            "status": "final",
            "code": {"text": "Vital signs"},
            "subject": {"reference": f"Patient/{patient_id}"},
            "valueQuantity": {"value": vital.get("value"), "unit": vital.get("unit", "")},
            "effectiveDateTime": vital.get("recorded_at"),
        }

    def encounter_to_fhir(self, encounter: dict) -> dict:
        return {
            "resourceType": "Encounter",
            "id": str(encounter.get("id")),
            "status": encounter.get("status", "in-progress"),
            "class": {"code": encounter.get("encounter_type", "outpatient")},
            "subject": {"reference": f"Patient/{encounter.get('patient_id')}"},
            "participant": [{"individual": {"reference": f"Practitioner/{encounter.get('doctor_id')}"}}],
        }

    def medication_request_to_fhir(self, prescription: dict) -> dict:
        return {
            "resourceType": "MedicationRequest",
            "id": str(prescription.get("id")),
            "status": "active",
            "intent": "order",
            "subject": {"reference": f"Patient/{prescription.get('patient_id')}"},
            "requester": {"reference": f"Practitioner/{prescription.get('doctor_id')}"},
            "medicationCodeableConcept": {"text": prescription.get("medication")},
            "dosageInstruction": [{"text": f"{prescription.get('dosage')} {prescription.get('frequency')}"}],
        }

    def diagnostic_report_to_fhir(self, lab: dict, patient_id: int) -> dict:
        return {
            "resourceType": "DiagnosticReport",
            "id": str(lab.get("id")),
            "status": "final",
            "code": {"text": lab.get("test_name")},
            "subject": {"reference": f"Patient/{patient_id}"},
            "result": [{"display": f"{lab.get('value')} {lab.get('unit', '')}"}],
            "effectiveDateTime": lab.get("resulted_at"),
        }

    def validate_resource(self, resource_type: str, payload: dict) -> dict:
        required = {"Patient": ["resourceType"], "Observation": ["resourceType", "status", "code", "subject"]}
        missing = [f for f in required.get(resource_type, []) if f not in payload]
        return {"valid": not missing, "missing": missing}

    def count(self) -> int:
        return self.repository.count_resources()

    def clear(self) -> None:
        self.repository.clear()
