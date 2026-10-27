"""Patient API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import PatientCreate, PatientListParams, PatientRead, PatientUpdate
from .service import PatientService

router = APIRouter(prefix="/patients", tags=["patients"])


def get_service() -> PatientService:
    return PatientService()


@router.get("/", response_model=dict)
def list_patients(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    service: PatientService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    result = service.list(params, search=search, status=status)
    return result.to_dict()


@router.post("/", status_code=201)
def create_patient(payload: PatientCreate, service: PatientService = Depends(get_service)) -> None:
    return service.create(payload)


@router.get("/{patient_id}")
def get_patient(patient_id: int, service: PatientService = Depends(get_service)) -> None:
    try:
        return service.get(patient_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{patient_id}")
def update_patient(patient_id: int, payload: PatientUpdate, service: PatientService = Depends(get_service)) -> None:
    try:
        return service.update(patient_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/{patient_id}", status_code=200)
def delete_patient(patient_id: int, service: PatientService = Depends(get_service)) -> None:
    try:
        service.delete(patient_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{patient_id}/search")
def search_patients(q: str, service: PatientService = Depends(get_service)) -> None:
    return service.search(q)


@router.post("/{patient_id}/deactivate")
def deactivate_patient(patient_id: int, service: PatientService = Depends(get_service)) -> None:
    return service.deactivate(patient_id)


@router.post("/{patient_id}/reactivate")
def reactivate_patient(patient_id: int, service: PatientService = Depends(get_service)) -> None:
    return service.reactivate(patient_id)
