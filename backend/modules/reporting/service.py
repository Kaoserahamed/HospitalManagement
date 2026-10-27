"""Reporting service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import ReportingRepository
from .schemas import ReportDefinitionCreate, ReportExecutionCreate, ReportRunRequest, ReportSubscriptionCreate


class ReportingService:
    def __init__(self, repository: ReportingRepository | None = None) -> None:
        self.repository = repository or ReportingRepository()

    def create_definition(self, data: ReportDefinitionCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("query"):
            raise ValidationError("query is required")
        record = self.repository.create_definition(payload)
        default_bus.publish(DomainEvent(name="ReportDefinitionCreated", payload={"definition_id": record["id"]}))
        return record

    def get_definition(self, definition_id: int) -> dict:
        record = self.repository.get_definition(definition_id)
        if record is None:
            raise NotFoundError("ReportDefinition", definition_id)
        return record

    def list_definitions(self, active_only: bool = False) -> list[dict]:
        return self.repository.list_definitions(active_only=active_only)

    def update_definition(self, definition_id: int, data: dict) -> dict:
        return self.repository.update_definition(definition_id, data)

    def delete_definition(self, definition_id: int) -> bool:
        if self.repository.get_definition(definition_id) is None:
            raise NotFoundError("ReportDefinition", definition_id)
        self.repository._definitions.pop(definition_id, None)
        return True

    def run(self, request: ReportRunRequest | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        definition = self.get_definition(payload["definition_id"])
        execution = self.repository.create_execution({"definition_id": definition["id"], "status": "running", "started_at": datetime.utcnow()})
        # simulate execution
        row_count = 0
        try:
            row_count = self._simulate_query(definition["query"])
            execution = self.repository.update_execution(execution["id"], {"status": "completed", "row_count": row_count, "completed_at": datetime.utcnow(), "file_path": f"/reports/{execution['id']}.csv"})
            default_bus.publish(DomainEvent(name="ReportExecuted", payload={"execution_id": execution["id"]}))
        except Exception as exc:  # noqa: BLE001
            execution = self.repository.update_execution(execution["id"], {"status": "failed", "error": str(exc), "completed_at": datetime.utcnow()})
        return execution

    def _simulate_query(self, query: str) -> int:
        # placeholder for actual query execution
        return 100

    def get_execution(self, execution_id: int) -> dict:
        record = self.repository.get_execution(execution_id)
        if record is None:
            raise NotFoundError("ReportExecution", execution_id)
        return record

    def list_executions(self, definition_id: int | None = None) -> list[dict]:
        return self.repository.list_executions(definition_id=definition_id)

    def subscribe(self, data: ReportSubscriptionCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_definition(payload["definition_id"]) is None:
            raise NotFoundError("ReportDefinition", payload["definition_id"])
        record = self.repository.create_subscription(payload)
        default_bus.publish(DomainEvent(name="ReportSubscriptionCreated", payload={"subscription_id": record["id"]}))
        return record

    def list_subscriptions(self, definition_id: int | None = None) -> list[dict]:
        return self.repository.list_subscriptions(definition_id=definition_id)

    def scheduled_reports(self) -> list[dict]:
        return [d for d in self.repository.list_definitions() if d.get("schedule") != "once" and d.get("is_active")]

    def standard_definitions(self) -> list[dict]:
        return [
            {"name": "Patient Volume", "query": "SELECT count(*) FROM patients", "format": "csv", "schedule": "monthly"},
            {"name": "Appointment Utilization", "query": "SELECT count(*) FROM appointments", "format": "csv", "schedule": "weekly"},
            {"name": "Revenue Summary", "query": "SELECT sum(total) FROM billing_invoices", "format": "xlsx", "schedule": "monthly"},
            {"name": "Quality Measures", "query": "SELECT * FROM quality_measures", "format": "csv", "schedule": "quarterly"},
        ]

    def clear(self) -> None:
        self.repository.clear()
