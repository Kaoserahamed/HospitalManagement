"""Risk prediction service."""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import RiskPredictionRepository
from .schemas import RiskEvaluationRequest, RiskFactorCreate, RiskModelCreate, RiskPredictionCreate


class RiskPredictionService:
    def __init__(self, repository: RiskPredictionRepository | None = None) -> None:
        self.repository = repository or RiskPredictionRepository()

    def create_model(self, data: RiskModelCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_model(payload)
        default_bus.publish(DomainEvent(name="RiskModelCreated", payload={"model_id": record["id"]}))
        return record

    def get_model(self, model_id: int) -> dict:
        record = self.repository.get_model(model_id)
        if record is None:
            raise NotFoundError("RiskModel", model_id)
        return record

    def list_models(self) -> list[dict]:
        return self.repository.list_models()

    def active_model(self) -> dict:
        record = self.repository.get_active_model()
        if record is None:
            raise NotFoundError("RiskModel", "active")
        return record

    def create_factor(self, data: RiskFactorCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_factor(payload)
        return record

    def list_factors(self) -> list[dict]:
        return self.repository.list_factors()

    def evaluate(self, request: RiskEvaluationRequest | dict) -> dict:
        payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
        model = self.active_model()
        features = payload.get("features", {})
        score = 0.0
        factors = {}
        # weighted scoring
        for factor in self.repository.list_factors():
            name = factor["name"]
            weight = factor.get("weight", 0.0)
            value = features.get(name, 0)
            contribution = value * weight
            score += contribution
            factors[name] = {"value": value, "weight": weight, "contribution": round(contribution, 3)}
        # additional heuristics
        if features.get("age", 0) > 65:
            score += 0.1
            factors["age_over_65"] = {"value": features.get("age"), "weight": 0.1, "contribution": 0.1}
        if features.get("prior_admissions", 0) > 1:
            score += 0.15
            factors["prior_admissions"] = {"value": features.get("prior_admissions"), "weight": 0.15, "contribution": 0.15}
        score = min(1.0, max(0.0, score))
        if score >= 0.7:
            level = "high"
        elif score >= 0.4:
            level = "medium"
        elif score >= 0.2:
            level = "low"
        else:
            level = "low"
        # store prediction
        prediction = self.repository.create_prediction({
            "model_id": model["id"],
            "patient_id": payload["patient_id"],
            "encounter_id": payload.get("encounter_id"),
            "score": round(score, 3),
            "risk_level": level,
            "factors": json.dumps(factors),
        })
        default_bus.publish(DomainEvent(name="RiskPredicted", payload={"prediction_id": prediction["id"]}))
        return {
            "patient_id": payload["patient_id"],
            "score": round(score, 3),
            "risk_level": level,
            "factors": factors,
            "model_version": model.get("version", "1.0"),
        }

    def predict_readmission(self, patient_id: int, encounter_id: int | None = None, features: dict | None = None) -> dict:
        return self.evaluate({"patient_id": patient_id, "encounter_id": encounter_id, "features": features or {}})

    def list_predictions(self, patient_id: int | None = None) -> list[dict]:
        return self.repository.list_predictions(patient_id=patient_id)

    def get_prediction(self, prediction_id: int) -> dict:
        record = self.repository.get_prediction(prediction_id)
        if record is None:
            raise NotFoundError("RiskPrediction", prediction_id)
        return record

    def high_risk_patients(self, threshold: float = 0.7) -> list[dict]:
        preds = self.repository.list_predictions()
        return [p for p in preds if p.get("score", 0) >= threshold]

    def risk_trend(self, patient_id: int) -> list[dict]:
        preds = self.repository.list_predictions(patient_id=patient_id)
        return sorted(preds, key=lambda x: x.get("predicted_at", ""))

    def feature_importance(self) -> list[dict]:
        factors = self.repository.list_factors()
        return sorted(factors, key=lambda x: x.get("weight", 0), reverse=True)

    def clear(self) -> None:
        self.repository.clear()
