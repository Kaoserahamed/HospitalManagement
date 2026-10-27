"""Analytics API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import (
    OutcomeCreate,
    QualityMeasureCreate,
    ReadmissionRiskCreate,
    RegistryCreate,
    ReportCreate,
)
from .service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])


def get_service() -> AnalyticsService:
    return AnalyticsService()


@router.post("/registries", status_code=201)
def create_registry(payload: RegistryCreate, service: AnalyticsService = Depends(get_service)) -> Any:
    try:
        return service.create_registry(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/registries")
def list_registries(service: AnalyticsService = Depends(get_service)) -> Any:
    return service.list_registries()


@router.post("/outcomes", status_code=201)
def record_outcome(payload: OutcomeCreate, service: AnalyticsService = Depends(get_service)) -> Any:
    try:
        return service.record_outcome(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/outcomes")
def list_outcomes(patient_id: int | None = None, measure: str | None = None, service: AnalyticsService = Depends(get_service)) -> Any:
    return service.list_outcomes(patient_id=patient_id, measure=measure)


@router.post("/quality-measures", status_code=201)
def create_measure(payload: QualityMeasureCreate, service: AnalyticsService = Depends(get_service)) -> Any:
    try:
        return service.create_measure(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/quality-measures")
def list_measures(service: AnalyticsService = Depends(get_service)) -> Any:
    return service.list_measures()


@router.put("/quality-measures/{measure_id}")
def update_measure(measure_id: int, numerator: int | None = None, denominator: int | None = None, service: AnalyticsService = Depends(get_service)) -> Any:
    try:
        return service.update_measure(measure_id, numerator=numerator, denominator=denominator)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/reports", status_code=201)
def create_report(payload: ReportCreate, service: AnalyticsService = Depends(get_service)) -> Any:
    try:
        return service.create_report(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/reports")
def list_reports(service: AnalyticsService = Depends(get_service)) -> Any:
    return service.list_reports()


@router.get("/reports/{report_id}")
def get_report(report_id: int, service: AnalyticsService = Depends(get_service)) -> Any:
    try:
        return service.get_report(report_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/readmission-risk", status_code=201)
def compute_risk(payload: ReadmissionRiskCreate, service: AnalyticsService = Depends(get_service)) -> Any:
    try:
        return service.compute_readmission_risk(payload.patient_id, payload.encounter_id, None)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/readmission-risk")
def list_risks(patient_id: int | None = None, risk_level: str | None = None, service: AnalyticsService = Depends(get_service)) -> Any:
    return service.list_risks(patient_id=patient_id, risk_level=risk_level)


@router.get("/dashboard")
def dashboard(service: AnalyticsService = Depends(get_service)) -> Any:
    return service.dashboard_summary()


@router.get("/standard-reports")
def standard_reports(service: AnalyticsService = Depends(get_service)) -> Any:
    return service.standard_reports()
