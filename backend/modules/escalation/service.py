"""Escalation service."""

from __future__ import annotations

from backend.shared.errors import NotFoundError
from backend.shared.events import DomainEvent, default_bus
from backend.shared.pagination import PageParams, PageResult

from .repository import EscalationRepository
from .schemas import EscalationCreate, EscalationPolicyCreate, EscalationUpdate


class EscalationService:
    def __init__(self, repository: EscalationRepository | None = None) -> None:
        self.repository = repository or EscalationRepository()

    def create_policy(self, data: EscalationPolicyCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_policy(payload)
        default_bus.publish(
            DomainEvent(name="EscalationPolicyCreated", payload={"policy_id": record["id"]})
        )
        return record

    def list_policies(self) -> list[dict]:
        return self.repository.list_policies()

    def create_escalation(self, data: EscalationCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_escalation(payload)
        default_bus.publish(
            DomainEvent(name="EscalationCreated", payload={"escalation_id": record["id"]})
        )
        return record

    def get_escalation(self, escalation_id: int) -> dict:
        record = self.repository.get_escalation(escalation_id)
        if record is None:
            raise NotFoundError("Escalation", escalation_id)
        return record

    def update_escalation(self, escalation_id: int, data: EscalationUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        record = self.repository.update_escalation(escalation_id, payload)
        default_bus.publish(
            DomainEvent(name="EscalationUpdated", payload={"escalation_id": escalation_id})
        )
        return record

    def resolve(self, escalation_id: int, notes: str | None = None) -> dict:
        record = self.repository.resolve(escalation_id, notes=notes)
        default_bus.publish(
            DomainEvent(name="EscalationResolved", payload={"escalation_id": escalation_id})
        )
        return record

    def escalate(self, escalation_id: int) -> dict:
        record = self.repository.escalate(escalation_id)
        default_bus.publish(
            DomainEvent(
                name="EscalationEscalated",
                payload={"escalation_id": escalation_id, "level": record["level"]},
            )
        )
        return record

    def list_escalations(
        self,
        params,
        patient_id: int | None = None,
        status: str | None = None,
        level: str | None = None,
    ) -> PageResult:
        return self.repository.list_escalations(
            params, patient_id=patient_id, status=status, level=level
        )

    def acknowledge(self, escalation_id: int, acknowledged_by: int | None = None) -> dict:
        return self.update_escalation(
            escalation_id, {"status": "acknowledged", "assigned_to": acknowledged_by}
        )

    def open_escalations(self, patient_id: int | None = None) -> list[dict]:
        result = self.repository.list_escalations(
            PageParams(page=1, per_page=100), patient_id=patient_id, status="open"
        )
        return list(result.items)

    def critical_escalations(self) -> list[dict]:
        result = self.repository.list_escalations(PageParams(page=1, per_page=100), level="level3")
        return [e for e in result.items if e.get("status") != "resolved"]

    def escalate_from_monitoring(
        self, patient_id: int, vital_type: str, value: float, severity: str
    ) -> dict:
        level = (
            "level3" if severity == "critical" else "level2" if severity == "warning" else "level1"
        )
        return self.create_escalation(
            {
                "source_type": "monitoring",
                "source_id": 0,
                "patient_id": patient_id,
                "level": level,
                "notes": f"{vital_type} reading {value} triggered escalation",
            }
        )

    def escalate_from_cds(self, patient_id: int, alert_message: str) -> dict:
        return self.create_escalation(
            {
                "source_type": "cds",
                "source_id": 0,
                "patient_id": patient_id,
                "level": "level2",
                "notes": alert_message,
            }
        )

    def count_open(self) -> int:
        result = self.repository.list_escalations(PageParams(page=1, per_page=100), status="open")
        return result.total

    def clear(self) -> None:
        self.repository.clear()
