"""Import/Export service."""

from __future__ import annotations

import csv
import json
from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import ImportExportRepository
from .schemas import ExportJobCreate, ExportRequest, ImportJobCreate, ImportRequest


class ImportExportService:
    def __init__(self, repository: ImportExportRepository | None = None) -> None:
        self.repository = repository or ImportExportRepository()

    def create_import_job(self, data: ImportJobCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_import(payload)
        default_bus.publish(DomainEvent(name="ImportJobCreated", payload={"import_id": record["id"]}))
        return record

    def get_import_job(self, import_id: int) -> dict:
        record = self.repository.get_import(import_id)
        if record is None:
            raise NotFoundError("ImportJob", import_id)
        return record

    def list_import_jobs(self, params: PageParams, entity_type: str | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_imports(params, entity_type=entity_type, status=status)

    def process_import(self, import_id: int) -> dict:
        record = self.get_import_job(import_id)
        record = self.repository.update_import(import_id, {"status": "processing"})
        # simulate processing
        total = record.get("total_rows", 100)
        processed = total
        errors = 0
        record = self.repository.update_import(import_id, {"status": "completed", "processed_rows": processed, "error_rows": errors, "completed_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="ImportCompleted", payload={"import_id": import_id}))
        return record

    def cancel_import(self, import_id: int) -> dict:
        return self.repository.update_import(import_id, {"status": "failed", "errors": "Cancelled by user"})

    def create_export_job(self, data: ExportJobCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_export(payload)
        default_bus.publish(DomainEvent(name="ExportJobCreated", payload={"export_id": record["id"]}))
        return record

    def get_export_job(self, export_id: int) -> dict:
        record = self.repository.get_export(export_id)
        if record is None:
            raise NotFoundError("ExportJob", export_id)
        return record

    def list_export_jobs(self, params: PageParams, entity_type: str | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_exports(params, entity_type=entity_type, status=status)

    def process_export(self, export_id: int) -> dict:
        record = self.get_export_job(export_id)
        record = self.repository.update_export(export_id, {"status": "processing", "started_at": datetime.utcnow()})
        # simulate
        row_count = 100
        file_path = f"/exports/{export_id}.{record.get('format', 'csv')}"
        record = self.repository.update_export(export_id, {"status": "completed", "row_count": row_count, "file_path": file_path, "completed_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="ExportCompleted", payload={"export_id": export_id}))
        return record

    def import_data(self, request: ImportRequest | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        job = self.create_import_job({"entity_type": payload["entity_type"], "file_name": payload["file_name"], "file_path": payload["file_path"], "status": "pending"})
        return self.process_import(job["id"])

    def export_data(self, request: ExportRequest | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        job = self.create_export_job({"entity_type": payload["entity_type"], "format": payload.get("format", "csv"), "filters": str(payload.get("filters")), "status": "pending"})
        return self.process_export(job["id"])

    def validate_import(self, entity_type: str, rows: list[dict]) -> dict:
        errors = []
        for idx, row in enumerate(rows):
            if not row:
                errors.append({"row": idx, "error": "empty row"})
        return {"valid": len(errors) == 0, "errors": errors, "row_count": len(rows)}

    def transform_row(self, entity_type: str, row: dict, mapping: dict | None = None) -> dict:
        if mapping:
            return {mapping.get(k, k): v for k, v in row.items()}
        return row

    def supported_entities(self) -> list[str]:
        return ["patients", "appointments", "prescriptions", "departments", "doctors", "staff", "medications", "charges", "invoices"]

    def supported_formats(self) -> list[str]:
        return ["csv", "json", "xlsx", "xml"]

    def generate_template(self, entity_type: str) -> str:
        templates = {
            "patients": "first_name,last_name,dob,gender,phone,address",
            "appointments": "patient_id,doctor_id,start_time,end_time,status",
            "medications": "name,generic_name,form,strength",
        }
        return templates.get(entity_type, "id,name")

    def clear(self) -> None:
        self.repository.clear()
