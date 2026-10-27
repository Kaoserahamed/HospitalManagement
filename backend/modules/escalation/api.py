"""Escalation API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import EscalationCreate, EscalationPolicyCreate, EscalationUpdate
from .service import EscalationService

router = APIRouter(prefix="/escalation", tags=["escalation"])


def get_service() -> EscalationService:
    return EscalationService()


@router.post("/policies", status_code=201)
def create_policy(payload: EscalationPolicyCreate, service: EscalationService = Depends(get_service)) -> Any:
    try:
        return service.create_policy(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/policies")
def list_policies(service: EscalationService = Depends(get_service)) -> Any:
    return service.list_policies()


@router.post("/", status_code=201)
def create_escalation(payload: EscalationCreate, service: EscalationService = Depends(get_service)) -> Any:
    try:
        return service.create_escalation(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/")
def list_escalations(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    patient_id: int | None = None,
    status: str | None = None,
    level: str | None = None,
    service: EscalationService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_escalations(params, patient_id=patient_id, status=status, level=level).to_dict()


@router.get("/{escalation_id}")
def get_escalation(escalation_id: int, service: EscalationService = Depends(get_service)) -> Any:
    try:
        return service.get_escalation(escalation_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{escalation_id}")
def update_escalation(escalation_id: int, payload: EscalationUpdate, service: EscalationService = Depends(get_service)) -> Any:
    try:
        return service.update_escalation(escalation_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{escalation_id}/resolve")
def resolve(escalation_id: int, notes: str | None = None, service: EscalationService = Depends(get_service)) -> Any:
    try:
        return service.resolve(escalation_id, notes=notes)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{escalation_id}/escalate")
def escalate(escalation_id: int, service: EscalationService = Depends(get_service)) -> Any:
    try:
        return service.escalate(escalation_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{escalation_id}/acknowledge")
def acknowledge(escalation_id: int, acknowledged_by: int | None = None, service: EscalationService = Depends(get_service)) -> Any:
    try:
        return service.acknowledge(escalation_id, acknowledged_by=acknowledged_by)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/open")
def open_escalations(patient_id: int | None = None, service: EscalationService = Depends(get_service)) -> Any:
    return service.open_escalations(patient_id=patient_id)


@router.get("/critical")
def critical_escalations(service: EscalationService = Depends(get_service)) -> Any:
    return service.critical_escalations()


@router.post("/from-monitoring")
def escalate_from_monitoring(patient_id: int, vital_type: str, value: float, severity: str, service: EscalationService = Depends(get_service)) -> Any:
    return service.escalate_from_monitoring(patient_id, vital_type, value, severity)


@router.post("/from-cds")
def escalate_from_cds(patient_id: int, alert_message: str, service: EscalationService = Depends(get_service)) -> Any:
    return service.escalate_from_cds(patient_id, alert_message)


@router.get("/count")
def count(service: EscalationService = Depends(get_service)) -> Any:
    return {"count": service.count_open()}
