"""CDS service."""

from __future__ import annotations

from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import CDSRepository
from .schemas import CDSEvaluationRequest, CDSRuleCreate, DrugDoseRangeCreate


class CDSService:
    def __init__(self, repository: CDSRepository | None = None) -> None:
        self.repository = repository or CDSRepository()

    def create_rule(self, data: CDSRuleCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_rule(payload)
        default_bus.publish(DomainEvent(name="CDSRuleCreated", payload={"rule_id": record["id"]}))
        return record

    def list_rules(self, rule_type: str | None = None, active_only: bool = False) -> list[dict]:
        return self.repository.list_rules(rule_type=rule_type, active_only=active_only)

    def create_alert(self, data: dict) -> dict:
        payload = dict(data)
        record = self.repository.create_alert(payload)
        default_bus.publish(DomainEvent(name="CDSAlertCreated", payload={"alert_id": record["id"]}))
        return record

    def list_alerts(self, patient_id: int | None = None, acknowledged: bool | None = None) -> list[dict]:
        return self.repository.list_alerts(patient_id=patient_id, acknowledged=acknowledged)

    def acknowledge_alert(self, alert_id: int, acknowledged_by: int | None = None) -> dict:
        record = self.repository.acknowledge_alert(alert_id, acknowledged_by=acknowledged_by)
        default_bus.publish(DomainEvent(name="CDSAlertAcknowledged", payload={"alert_id": alert_id}))
        return record

    def create_dose_range(self, data: DrugDoseRangeCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_dose_range(payload)
        return record

    def check_dose(self, medication: str, dose: float, age: int | None = None) -> dict:
        ranges = self.repository.get_dose_range(medication)
        if not ranges:
            return {"medication": medication, "dose": dose, "status": "unknown", "message": "No dose range defined"}
        r = ranges[0]
        if dose < r["min_dose"]:
            return {"medication": medication, "dose": dose, "status": "below_range", "message": f"Dose below minimum {r['min_dose']}"}
        if dose > r["max_dose"]:
            return {"medication": medication, "dose": dose, "status": "above_range", "message": f"Dose above maximum {r['max_dose']}"}
        return {"medication": medication, "dose": dose, "status": "in_range", "message": "Dose within range"}

    def evaluate(self, request: CDSEvaluationRequest | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        patient_id = payload["patient_id"]
        alerts = []
        # drug interaction check
        meds = payload.get("medications", [])
        for i in range(len(meds)):
            for j in range(i + 1, len(meds)):
                if meds[i].lower() == meds[j].lower():
                    continue
                # simple heuristic: alert if both present
                alerts.append({"level": "warning", "message": f"Potential interaction between {meds[i]} and {meds[j]}"})
        # allergy check
        for med in meds:
            for allergy in payload.get("allergies", []):
                if allergy.lower() in med.lower():
                    alerts.append({"level": "critical", "message": f"Allergy conflict: {med} vs {allergy}"})
        # dose checks
        for med in meds:
            dose_check = self.check_dose(med, 0)  # placeholder
        # create alerts
        for a in alerts:
            self.create_alert({"patient_id": patient_id, "encounter_id": payload.get("encounter_id"), "alert_level": a["level"], "message": a["message"]})
        has_critical = any(a["level"] == "critical" for a in alerts)
        return {"patient_id": patient_id, "alerts": alerts, "alert_count": len(alerts), "has_critical": has_critical}

    def care_gaps(self, patient_id: int, measures: list[str]) -> list[dict]:
        gaps = []
        for m in measures:
            gaps.append({"patient_id": patient_id, "measure": m, "status": "due"})
        return gaps

    def diagnosis_suggestions(self, symptoms: list[str]) -> list[dict]:
        suggestions = []
        symptom_set = set(s.lower() for s in symptoms)
        if "fever" in symptom_set and "cough" in symptom_set:
            suggestions.append({"diagnosis": "Upper respiratory infection", "confidence": 0.7})
        if "chest pain" in symptom_set:
            suggestions.append({"diagnosis": "Angina", "confidence": 0.6})
        if "headache" in symptom_set:
            suggestions.append({"diagnosis": "Tension headache", "confidence": 0.5})
        return suggestions

    def clear(self) -> None:
        self.repository.clear()
