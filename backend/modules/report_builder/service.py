"""Report builder service."""

from __future__ import annotations

import csv
import io
import json
from datetime import datetime, timedelta
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import ReportBuilderRepository
from .schemas import ReportExportCreate, ReportRunRequest, ReportScheduleCreate, ReportTemplateCreate


class ReportBuilderService:
    def __init__(self, repository: ReportBuilderRepository | None = None) -> None:
        self.repository = repository or ReportBuilderRepository()

    def create_template(self, data: ReportTemplateCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("query"):
            raise ValidationError("query is required")
        record = self.repository.create_template(payload)
        default_bus.publish(DomainEvent(name="ReportTemplateCreated", payload={"template_id": record["id"]}))
        return record

    def get_template(self, template_id: int) -> dict:
        record = self.repository.get_template(template_id)
        if record is None:
            raise NotFoundError("ReportTemplate", template_id)
        return record

    def list_templates(self, active_only: bool = False) -> list[dict]:
        return self.repository.list_templates(active_only=active_only)

    def update_template(self, template_id: int, data: dict) -> dict:
        return self.repository.update_template(template_id, data)

    def delete_template(self, template_id: int) -> bool:
        if not self.repository.delete_template(template_id):
            raise NotFoundError("ReportTemplate", template_id)
        return True

    def create_schedule(self, data: ReportScheduleCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_template(payload["template_id"]) is None:
            raise NotFoundError("ReportTemplate", payload["template_id"])
        # compute next run (simplified: now + 1 day)
        payload["next_run"] = datetime.utcnow() + timedelta(days=1)
        record = self.repository.create_schedule(payload)
        default_bus.publish(DomainEvent(name="ReportScheduleCreated", payload={"schedule_id": record["id"]}))
        return record

    def list_schedules(self, template_id: int | None = None, active_only: bool = False) -> list[dict]:
        return self.repository.list_schedules(template_id=template_id, active_only=active_only)

    def due_schedules(self) -> list[dict]:
        now = datetime.utcnow()
        schedules = self.repository.list_schedules(active_only=True)
        return [s for s in schedules if s.get("next_run") and s["next_run"] <= now]

    def run(self, request: ReportRunRequest | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        template = self.get_template(payload["template_id"])
        export = self.repository.create_export({"template_id": template["id"], "format": payload.get("format", "csv"), "status": "running", "started_at": datetime.utcnow()})
        try:
            rows = self._execute_query(template["query"], payload.get("parameters"))
            content = self._format(rows, payload.get("format", "csv"), template.get("columns"))
            file_path = f"/exports/{export['id']}.{payload.get('format', 'csv')}"
            export = self.repository.update_export(export["id"], {"status": "completed", "row_count": len(rows), "file_path": file_path, "completed_at": datetime.utcnow()})
            default_bus.publish(DomainEvent(name="ReportRunCompleted", payload={"export_id": export["id"]}))
        except Exception as exc:  # noqa: BLE001
            export = self.repository.update_export(export["id"], {"status": "failed", "error": str(exc), "completed_at": datetime.utcnow()})
        return export

    def _execute_query(self, query: str, params: dict | None = None) -> list[dict]:
        # placeholder: return synthetic rows
        return [{"id": i, "value": i * 10} for i in range(1, 11)]

    def _format(self, rows: list[dict], fmt: str, columns: str | None) -> str:
        if fmt == "csv":
            if not rows:
                return ""
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)
            return output.getvalue()
        if fmt == "json":
            return json.dumps(rows)
        return str(rows)

    def export(self, request: ReportExportCreate | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        template = self.get_template(payload["template_id"])
        export = self.repository.create_export({"template_id": template["id"], "schedule_id": payload.get("schedule_id"), "format": payload.get("format", "csv"), "status": "running", "started_at": datetime.utcnow()})
        try:
            rows = self._execute_query(template["query"])
            file_path = f"/exports/{export['id']}.{payload.get('format', 'csv')}"
            export = self.repository.update_export(export["id"], {"status": "completed", "row_count": len(rows), "file_path": file_path, "completed_at": datetime.utcnow()})
        except Exception as exc:  # noqa: BLE001
            export = self.repository.update_export(export["id"], {"status": "failed", "error": str(exc), "completed_at": datetime.utcnow()})
        return export

    def get_export(self, export_id: int) -> dict:
        record = self.repository.get_export(export_id)
        if record is None:
            raise NotFoundError("ReportExport", export_id)
        return record

    def list_exports(self, template_id: int | None = None) -> list[dict]:
        return self.repository.list_exports(template_id=template_id)

    def create_dashboard(self, data: dict) -> dict:
        payload = dict(data)
        record = self.repository.create_dashboard(payload)
        default_bus.publish(DomainEvent(name="ReportDashboardCreated", payload={"dashboard_id": record["id"]}))
        return record

    def list_dashboards(self) -> list[dict]:
        return self.repository.list_dashboards()

    def get_dashboard(self, dashboard_id: int) -> dict:
        record = self.repository.get_dashboard(dashboard_id)
        if record is None:
            raise NotFoundError("ReportDashboard", dashboard_id)
        return record

    def default_dashboard(self) -> dict | None:
        return self.repository.default_dashboard()

    def standard_templates(self) -> list[dict]:
        return [
            {"name": "Patient Volume", "report_type": "tabular", "query": "SELECT count(*) FROM patients", "format": "csv"},
            {"name": "Appointment Utilization", "report_type": "chart", "query": "SELECT count(*) FROM appointments", "format": "pdf"},
            {"name": "Revenue Summary", "report_type": "summary", "query": "SELECT sum(total) FROM billing_invoices", "format": "xlsx"},
            {"name": "Quality Measures", "report_type": "tabular", "query": "SELECT * FROM quality_measures", "format": "csv"},
        ]

    def clear(self) -> None:
        self.repository.clear()
