"""Insurance API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import (
    AppealCreate,
    ClaimCreate,
    ClaimUpdate,
    InsurancePlanCreate,
    PatientInsuranceCreate,
)
from .service import InsuranceService

router = APIRouter(prefix="/insurance", tags=["insurance"])


def get_service() -> InsuranceService:
    return InsuranceService()


@router.post("/plans", status_code=201)
def create_plan(payload: InsurancePlanCreate, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.create_plan(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/plans")
def list_plans(service: InsuranceService = Depends(get_service)) -> None:
    return service.list_plans()


@router.post("/enroll", status_code=201)
def enroll_patient(payload: PatientInsuranceCreate, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.enroll_patient(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/patients/{patient_id}")
def get_patient_insurance(patient_id: int, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.get_patient_insurance(patient_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/claims", status_code=201)
def submit_claim(payload: ClaimCreate, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.submit_claim(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/claims")
def list_claims(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    plan_id: int | None = None,
    status: str | None = None,
    service: InsuranceService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_claims(params, plan_id=plan_id, status=status).to_dict()


@router.get("/claims/{claim_id}")
def get_claim(claim_id: int, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.get_claim(claim_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/claims/{claim_id}")
def update_claim(claim_id: int, payload: ClaimUpdate, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.update_claim(claim_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/claims/{claim_id}/approve")
def approve_claim(claim_id: int, amount_approved: float, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.approve_claim(claim_id, amount_approved)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/claims/{claim_id}/deny")
def deny_claim(claim_id: int, reason: str, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.deny_claim(claim_id, reason)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/appeals", status_code=201)
def file_appeal(payload: AppealCreate, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.file_appeal(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/appeals")
def list_appeals(claim_id: int | None = None, service: InsuranceService = Depends(get_service)) -> None:
    return service.list_appeals(claim_id=claim_id)


@router.put("/appeals/{appeal_id}")
def resolve_appeal(appeal_id: int, status: str, service: InsuranceService = Depends(get_service)) -> None:
    try:
        return service.resolve_appeal(appeal_id, status)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc
