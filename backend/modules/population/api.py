"""Population health API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import OutcomeCreate, PopulationMeasureCreate, RegistryCreate, RegistryMemberCreate
from .service import PopulationService

router = APIRouter(prefix="/population", tags=["population"])


def get_service() -> PopulationService:
    return PopulationService()


@router.post("/registries", status_code=201)
def create_registry(payload: RegistryCreate, service: PopulationService = Depends(get_service)) -> None:
    try:
        return service.create_registry(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/registries")
def list_registries(service: PopulationService = Depends(get_service)) -> None:
    return service.list_registries()


@router.get("/registries/{registry_id}")
def get_registry(registry_id: int, service: PopulationService = Depends(get_service)) -> None:
    try:
        return service.get_registry(registry_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/registries/{registry_id}/members", status_code=201)
def enroll_member(registry_id: int, patient_id: int, service: PopulationService = Depends(get_service)) -> None:
    try:
        return service.enroll_member({"registry_id": registry_id, "patient_id": patient_id})
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/registries/{registry_id}/members")
def list_members(registry_id: int, service: PopulationService = Depends(get_service)) -> None:
    return service.list_members(registry_id=registry_id)


@router.post("/measures", status_code=201)
def create_measure(payload: PopulationMeasureCreate, service: PopulationService = Depends(get_service)) -> None:
    try:
        return service.create_measure(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/measures")
def list_measures(registry_id: int | None = None, service: PopulationService = Depends(get_service)) -> None:
    return service.list_measures(registry_id=registry_id)


@router.post("/outcomes", status_code=201)
def record_outcome(payload: OutcomeCreate, service: PopulationService = Depends(get_service)) -> None:
    try:
        return service.record_outcome(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/outcomes")
def list_outcomes(patient_id: int | None = None, registry_id: int | None = None, service: PopulationService = Depends(get_service)) -> None:
    return service.list_outcomes(patient_id=patient_id, registry_id=registry_id)


@router.get("/patients/{patient_id}/registries")
def patient_registries(patient_id: int, service: PopulationService = Depends(get_service)) -> None:
    return service.patient_registries(patient_id)


@router.get("/registries/{registry_id}/summary")
def registry_summary(registry_id: int, service: PopulationService = Depends(get_service)) -> None:
    try:
        return service.registry_summary(registry_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/high-risk")
def high_risk(registry_id: int | None = None, service: PopulationService = Depends(get_service)) -> None:
    return service.high_risk_patients(registry_id=registry_id)
