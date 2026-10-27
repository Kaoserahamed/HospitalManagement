"""CDS API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import CDSEvaluationRequest, CDSRuleCreate, DrugDoseRangeCreate
from .service import CDSService

router = APIRouter(prefix="/cds", tags=["cds"])


def get_service() -> CDSService:
    return CDSService()


@router.post("/rules", status_code=201)
def create_rule(payload: CDSRuleCreate, service: CDSService = Depends(get_service)) -> Any:
    try:
        return service.create_rule(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/rules")
def list_rules(rule_type: str | None = None, active_only: bool = False, service: CDSService = Depends(get_service)) -> Any:
    return service.list_rules(rule_type=rule_type, active_only=active_only)


@router.post("/alerts")
def create_alert(payload: dict, service: CDSService = Depends(get_service)) -> Any:
    try:
        return service.create_alert(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/alerts")
def list_alerts(patient_id: int | None = None, acknowledged: bool | None = None, service: CDSService = Depends(get_service)) -> Any:
    return service.list_alerts(patient_id=patient_id, acknowledged=acknowledged)


@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, acknowledged_by: int | None = None, service: CDSService = Depends(get_service)) -> Any:
    try:
        return service.acknowledge_alert(alert_id, acknowledged_by=acknowledged_by)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/dose-ranges", status_code=201)
def create_dose_range(payload: DrugDoseRangeCreate, service: CDSService = Depends(get_service)) -> Any:
    try:
        return service.create_dose_range(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/dose-check")
def dose_check(medication: str, dose: float, age: int | None = None, service: CDSService = Depends(get_service)) -> Any:
    return service.check_dose(medication, dose, age=age)


@router.post("/evaluate")
def evaluate(payload: CDSEvaluationRequest, service: CDSService = Depends(get_service)) -> Any:
    try:
        return service.evaluate(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/care-gaps")
def care_gaps(patient_id: int, measures: str = "", service: CDSService = Depends(get_service)) -> Any:
    measure_list = [m.strip() for m in measures.split(",") if m.strip()]
    return service.care_gaps(patient_id, measure_list)


@router.get("/diagnosis-suggestions")
def diagnosis_suggestions(symptoms: str = "", service: CDSService = Depends(get_service)) -> Any:
    symptom_list = [s.strip() for s in symptoms.split(",") if s.strip()]
    return service.diagnosis_suggestions(symptom_list)
