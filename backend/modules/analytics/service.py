"""Analytics service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import AnalyticsRepository
from .schemas import (
    OutcomeCreate,
    QualityMeasureCreate,
    ReadmissionRiskCreate,
    RegistryCreate,
    ReportCreate,
)


class AnalyticsService:
    def __init__(self, repository: AnalyticsRepository | None = None) -> None:
        self.repository = repository or AnalyticsRepository()

    def create_registry(self, data: RegistryCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_registry(payload)
        default_bus.publish(DomainEvent(name="RegistryCreated", payload={"registry_id": record["id"]}))
        return record

    def list_registries(self) -> list[dict]:
        return self.repository.list_registries()

    def record_outcome(self, data: OutcomeCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_outcome(payload)
        default_bus.publish(DomainEvent(name="OutcomeRecorded", payload={"outcome_id": record["id"]}))
        return record

    def list_outcomes(self, patient_id: int | None = None, measure: str | None = None) -> list[dict]:
        return self.repository.list_outcomes(patient_id=patient_id, measure=measure)

    def create_measure(self, data: QualityMeasureCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload.get("denominator", 0) > 0:
            payload["rate"] = payload.get("numerator", 0) / payload["denominator"]
        record = self.repository.create_measure(payload)
        default_bus.publish(DomainEvent(name="QualityMeasureCreated", payload={"measure_id": record["id"]}))
        return record

    def list_measures(self) -> list[dict]:
        return self.repository.list_measures()

    def update_measure(self, measure_id: int, numerator: int | None = None, denominator: int | None = None) -> dict:
        data = {}
        if numerator is not None:
            data["numerator"] = numerator
        if denominator is not None:
            data["denominator"] = denominator
        if "numerator" in data or "denominator" in data:
            existing = self.repository.get_measure(measure_id)
            if existing is None:
                raise NotFoundError("QualityMeasure", measure_id)
            n = data.get("numerator", existing.get("numerator", 0))
            d = data.get("denominator", existing.get("denominator", 0))
            if d > 0:
                data["rate"] = n / d
        return self.repository.update_measure(measure_id, data)

    def create_report(self, data: ReportCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        payload["generated_at"] = datetime.utcnow()
        record = self.repository.create_report(payload)
        default_bus.publish(DomainEvent(name="ReportGenerated", payload={"report_id": record["id"]}))
        return record

    def list_reports(self) -> list[dict]:
        return self.repository.list_reports()

    def get_report(self, report_id: int) -> dict:
        record = self.repository.get_report(report_id)
        if record is None:
            raise NotFoundError("Report", report_id)
        return record

    def compute_readmission_risk(self, patient_id: int, encounter_id: int | None = None, factors: dict | None = None) -> dict:
        score = 0.0
        if factors:
            score += 0.3 if factors.get("prior_admissions", 0) > 1 else 0.0
            score += 0.2 if factors.get("age", 0) > 65 else 0.0
            score += 0.2 if factors.get("chronic_conditions", 0) > 2 else 0.0
            score += 0.15 if factors.get("medication_count", 0) > 5 else 0.0
            score += 0.15 if factors.get("social_risk", False) else 0.0
        score = min(1.0, score)
        if score >= 0.7:
            level = "high"
        elif score >= 0.4:
            level = "medium"
        else:
            level = "low"
        import json
        record = self.repository.create_risk({
            "patient_id": patient_id,
            "encounter_id": encounter_id,
            "score": round(score, 3),
            "risk_level": level,
            "factors": json.dumps(factors or {}),
        })
        default_bus.publish(DomainEvent(name="ReadmissionRiskComputed", payload={"risk_id": record["id"]}))
        return record

    def list_risks(self, patient_id: int | None = None, risk_level: str | None = None) -> list[dict]:
        return self.repository.list_risks(patient_id=patient_id, risk_level=risk_level)

    def dashboard_summary(self, counts: dict | None = None) -> dict:
        counts = counts or {}
        return {
            "total_patients": counts.get("patients", 0),
            "total_appointments": counts.get("appointments", 0),
            "total_encounters": counts.get("encounters", 0),
            "occupancy_rate": counts.get("occupancy_rate", 0.0),
            "revenue": counts.get("revenue", 0.0),
            "quality_score": counts.get("quality_score", 0.0),
        }

    def standard_reports(self) -> list[str]:
        return [
            "patient_volume",
            "appointment_utilization",
            "department_occupancy",
            "revenue_summary",
            "quality_measures",
            "readmission_risk",
            "pharmacy_dispensing",
            "staff_coverage",
            "patient_satisfaction",
            "clinical_outcomes",
        ]
