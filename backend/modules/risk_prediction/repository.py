"""Risk prediction repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class RiskPredictionRepository:
    def __init__(self) -> None:
        self._models: dict[int, dict] = {}
        self._predictions: dict[int, dict] = {}
        self._factors: dict[int, dict] = {}
        self._counters = {"model": 0, "prediction": 0, "factor": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_model(self, data: dict) -> dict:
        mid = self._next("model")
        record = {"id": mid, **data, "is_active": data.get("is_active", True)}
        self._models[mid] = record
        return dict(record)

    def get_model(self, model_id: int) -> Optional[dict]:
        record = self._models.get(model_id)
        return dict(record) if record else None

    def get_active_model(self) -> Optional[dict]:
        for record in self._models.values():
            if record.get("is_active"):
                return dict(record)
        return None

    def list_models(self) -> list[dict]:
        return [dict(m) for m in self._models.values()]

    def create_prediction(self, data: dict) -> dict:
        pid = self._next("prediction")
        record = {"id": pid, **data}
        self._predictions[pid] = record
        return dict(record)

    def get_prediction(self, prediction_id: int) -> Optional[dict]:
        record = self._predictions.get(prediction_id)
        return dict(record) if record else None

    def list_predictions(self, patient_id: int | None = None) -> list[dict]:
        items = list(self._predictions.values())
        if patient_id is not None:
            items = [p for p in items if p.get("patient_id") == patient_id]
        return [dict(p) for p in items]

    def create_factor(self, data: dict) -> dict:
        fid = self._next("factor")
        record = {"id": fid, **data}
        self._factors[fid] = record
        return dict(record)

    def list_factors(self) -> list[dict]:
        return [dict(f) for f in self._factors.values()]

    def clear(self) -> None:
        self._models.clear()
        self._predictions.clear()
        self._factors.clear()
        for k in self._counters:
            self._counters[k] = 0
