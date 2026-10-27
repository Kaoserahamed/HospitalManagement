"""Coding service."""

from __future__ import annotations

from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import CodingRepository
from .schemas import CodeMappingCreate, CodeSearchRequest, EncounterCodeCreate, MedicalCodeCreate


class CodingService:
    def __init__(self, repository: CodingRepository | None = None) -> None:
        self.repository = repository or CodingRepository()

    def add_code(self, data: MedicalCodeCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_code(payload)
        default_bus.publish(DomainEvent(name="MedicalCodeAdded", payload={"code_id": record["id"]}))
        return record

    def lookup(self, system: str, code: str) -> dict:
        record = self.repository.get_code(system, code)
        if record is None:
            raise NotFoundError("MedicalCode", f"{system}:{code}")
        return record

    def validate_code(self, system: str, code: str) -> dict:
        record = self.repository.get_code(system, code)
        return {"code": code, "system": system, "valid": record is not None, "description": record.get("description") if record else None}

    def search(self, request: CodeSearchRequest | dict) -> list[dict]:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        return self.repository.search_codes(payload.get("system"), payload["query"], limit=payload.get("limit", 20))

    def add_mapping(self, data: CodeMappingCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_mapping(payload)
        default_bus.publish(DomainEvent(name="CodeMappingAdded", payload={"mapping_id": record["id"]}))
        return record

    def map_code(self, source_system: str, source_code: str, target_system: str | None = None) -> list[dict]:
        return self.repository.find_mappings(source_system, source_code, target_system=target_system)

    def add_encounter_code(self, data: EncounterCodeCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.add_encounter_code(payload)
        default_bus.publish(DomainEvent(name="EncounterCoded", payload={"encounter_code_id": record["id"]}))
        return record

    def list_encounter_codes(self, encounter_id: int) -> list[dict]:
        return self.repository.list_encounter_codes(encounter_id)

    def remove_encounter_code(self, code_id: int) -> bool:
        if not self.repository.remove_encounter_code(code_id):
            raise NotFoundError("EncounterCode", code_id)
        return True

    def common_icd10(self) -> list[dict]:
        return [
            {"code": "I10", "description": "Essential hypertension"},
            {"code": "E11.9", "description": "Type 2 diabetes mellitus without complications"},
            {"code": "J06.9", "description": "Acute upper respiratory infection, unspecified"},
            {"code": "M54.5", "description": "Low back pain"},
            {"code": "F41.9", "description": "Anxiety disorder, unspecified"},
        ]

    def common_cpt(self) -> list[dict]:
        return [
            {"code": "99213", "description": "Office visit, established patient, low complexity"},
            {"code": "99214", "description": "Office visit, established patient, moderate complexity"},
            {"code": "99203", "description": "Office visit, new patient, low complexity"},
            {"code": "36415", "description": "Collection of venous blood by venipuncture"},
            {"code": "85025", "description": "Complete blood count with differential"},
        ]

    def count_codes(self) -> int:
        return self.repository.count_codes()

    def clear(self) -> None:
        self.repository.clear()
