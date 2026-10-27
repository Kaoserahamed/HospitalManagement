"""DICOM service."""

from __future__ import annotations

from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import DicomRepository
from .schemas import DicomInstanceCreate, DicomSeriesCreate, DicomStudyCreate


class DicomService:
    def __init__(self, repository: DicomRepository | None = None) -> None:
        self.repository = repository or DicomRepository()

    def create_study(self, data: DicomStudyCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_study_by_uid(payload["study_instance_uid"]):
            raise ValidationError("Study with this UID already exists")
        record = self.repository.create_study(payload)
        default_bus.publish(DomainEvent(name="DicomStudyCreated", payload={"study_id": record["id"]}))
        return record

    def get_study(self, study_id: int) -> dict:
        record = self.repository.get_study(study_id)
        if record is None:
            raise NotFoundError("DicomStudy", study_id)
        return record

    def get_study_by_uid(self, uid: str) -> dict:
        record = self.repository.get_study_by_uid(uid)
        if record is None:
            raise NotFoundError("DicomStudy", uid)
        return record

    def list_studies(self, patient_id: int | None = None) -> list[dict]:
        return self.repository.list_studies(patient_id=patient_id)

    def create_series(self, data: DicomSeriesCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_study(payload["study_id"]) is None:
            raise NotFoundError("DicomStudy", payload["study_id"])
        record = self.repository.create_series(payload)
        default_bus.publish(DomainEvent(name="DicomSeriesCreated", payload={"series_id": record["id"]}))
        return record

    def list_series(self, study_id: int) -> list[dict]:
        return self.repository.list_series(study_id)

    def create_instance(self, data: DicomInstanceCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_instance(payload)
        default_bus.publish(DomainEvent(name="DicomInstanceCreated", payload={"instance_id": record["id"]}))
        return record

    def list_instances(self, series_id: int) -> list[dict]:
        return self.repository.list_instances(series_id)

    def study_summary(self, study_id: int) -> dict:
        study = self.get_study(study_id)
        series = self.repository.list_series(study_id)
        total_instances = 0
        for s in series:
            total_instances += len(self.repository.list_instances(s["id"]))
        return {
            "study_id": study_id,
            "modality": study.get("modality"),
            "series_count": len(series),
            "instance_count": total_instances,
        }

    def count_studies(self) -> int:
        return self.repository.count_studies()

    def clear(self) -> None:
        self.repository.clear()
