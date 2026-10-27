"""Risk prediction API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import RiskEvaluationRequest, RiskFactorCreate, RiskModelCreate
from .service import RiskPredictionService

router = APIRouter(prefix="/risk", tags=["risk"])


def get_service() -> RiskPredictionService:
    return RiskPredictionService()


@router.post("/models", status_code=201)
def create_model(payload: RiskModelCreate, service: RiskPredictionService = Depends(get_service)) -> Any:
    try:
        return service.create_model(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/models")
def list_models(service: RiskPredictionService = Depends(get_service)) -> Any:
    return service.list_models()


@router.get("/models/active")
def active_model(service: RiskPredictionService = Depends(get_service)) -> Any:
    try:
        return service.active_model()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/factors", status_code=201)
def create_factor(payload: RiskFactorCreate, service: RiskPredictionService = Depends(get_service)) -> Any:
    try:
        return service.create_factor(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/factors")
def list_factors(service: RiskPredictionService = Depends(get_service)) -> Any:
    return service.list_factors()


@router.get("/factors/importance")
def feature_importance(service: RiskPredictionService = Depends(get_service)) -> Any:
    return service.feature_importance()


@router.post("/evaluate")
def evaluate(payload: RiskEvaluationRequest, service: RiskPredictionService = Depends(get_service)) -> Any:
    try:
        return service.evaluate(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/predict/readmission")
def predict_readmission(patient_id: int, encounter_id: int | None = None, service: RiskPredictionService = Depends(get_service)) -> Any:
    try:
        return service.predict_readmission(patient_id, encounter_id=encounter_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/predictions")
def list_predictions(patient_id: int | None = None, service: RiskPredictionService = Depends(get_service)) -> Any:
    return service.list_predictions(patient_id=patient_id)


@router.get("/predictions/{prediction_id}")
def get_prediction(prediction_id: int, service: RiskPredictionService = Depends(get_service)) -> Any:
    try:
        return service.get_prediction(prediction_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/high-risk")
def high_risk_patients(threshold: float = 0.7, service: RiskPredictionService = Depends(get_service)) -> Any:
    return service.high_risk_patients(threshold=threshold)


@router.get("/patients/{patient_id}/trend")
def risk_trend(patient_id: int, service: RiskPredictionService = Depends(get_service)) -> Any:
    return service.risk_trend(patient_id)
