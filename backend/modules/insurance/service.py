"""Insurance service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import InsuranceRepository
from .schemas import AppealCreate, ClaimCreate, ClaimUpdate, InsurancePlanCreate, PatientInsuranceCreate


class InsuranceService:
    def __init__(self, repository: InsuranceRepository | None = None) -> None:
        self.repository = repository or InsuranceRepository()

    def create_plan(self, data: InsurancePlanCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_plan(payload)
        default_bus.publish(DomainEvent(name="InsurancePlanCreated", payload={"plan_id": record["id"]}))
        return record

    def list_plans(self) -> list[dict]:
        return self.repository.list_plans()

    def enroll_patient(self, data: PatientInsuranceCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_plan(payload["plan_id"]) is None:
            raise NotFoundError("InsurancePlan", payload["plan_id"])
        record = self.repository.create_patient_insurance(payload)
        default_bus.publish(DomainEvent(name="PatientEnrolled", payload={"patient_id": payload["patient_id"]}))
        return record

    def get_patient_insurance(self, patient_id: int) -> dict:
        record = self.repository.get_patient_insurance(patient_id)
        if record is None:
            raise NotFoundError("PatientInsurance", patient_id)
        return record

    def submit_claim(self, data: ClaimCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload.get("amount_claimed", 0) < 0:
            raise ValidationError("amount_claimed cannot be negative")
        record = self.repository.create_claim(payload)
        default_bus.publish(DomainEvent(name="ClaimSubmitted", payload={"claim_id": record["id"]}))
        return record

    def get_claim(self, claim_id: int) -> dict:
        record = self.repository.get_claim(claim_id)
        if record is None:
            raise NotFoundError("Claim", claim_id)
        return record

    def update_claim(self, claim_id: int, data: ClaimUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        if "status" in payload and payload["status"] in ("approved", "denied", "paid"):
            payload["resolved_at"] = datetime.utcnow()
        record = self.repository.update_claim(claim_id, payload)
        default_bus.publish(DomainEvent(name="ClaimUpdated", payload={"claim_id": claim_id}))
        return record

    def approve_claim(self, claim_id: int, amount_approved: float) -> dict:
        return self.update_claim(claim_id, {"status": "approved", "amount_approved": amount_approved})

    def deny_claim(self, claim_id: int, reason: str) -> dict:
        return self.update_claim(claim_id, {"status": "denied", "denial_reason": reason})

    def list_claims(self, params: PageParams, plan_id: int | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_claims(params, plan_id=plan_id, status=status)

    def file_appeal(self, data: AppealCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_claim(payload["claim_id"]) is None:
            raise NotFoundError("Claim", payload["claim_id"])
        record = self.repository.create_appeal(payload)
        default_bus.publish(DomainEvent(name="AppealFiled", payload={"appeal_id": record["id"]}))
        return record

    def list_appeals(self, claim_id: int | None = None) -> list[dict]:
        return self.repository.list_appeals(claim_id=claim_id)

    def resolve_appeal(self, appeal_id: int, status: str) -> dict:
        appeals = self.repository.list_appeals()
        for a in appeals:
            if a["id"] == appeal_id:
                a["status"] = status
                a["resolved_at"] = datetime.utcnow()
                return a
        raise NotFoundError("Appeal", appeal_id)

    def count_claims(self) -> int:
        return self.repository.count_claims()
