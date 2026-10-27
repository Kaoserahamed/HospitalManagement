"""BloodUnit API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query

from backend.shared.pagination import PageParams

from .schemas import BloodUnitCreate, BloodUnitUpdate
from .service import BloodUnitService

router = APIRouter(prefix="/blood_bank", tags=["blood_bank"])


def get_service() -> BloodUnitService:
    return BloodUnitService()


@router.post("/", status_code=201)
def create(payload: BloodUnitCreate, service: BloodUnitService = Depends(get_service)) -> Any:
    return service.create(payload)


@router.get("/")
def list_records(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    patient_id: int | None = None,
    status: str | None = None,
    priority: str | None = None,
    category: str | None = None,
    service: BloodUnitService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list(
        params, patient_id=patient_id, status=status, priority=priority, category=category
    ).to_dict()


@router.get("/all")
def list_all(
    patient_id: int | None = None,
    status: str | None = None,
    service: BloodUnitService = Depends(get_service),
) -> Any:
    return service.list_all(patient_id=patient_id, status=status)


@router.get("/count")
def count(service: BloodUnitService = Depends(get_service)) -> Any:
    return {"count": service.count()}


@router.get("/search")
def search(
    q: str = Query(..., min_length=1), service: BloodUnitService = Depends(get_service)
) -> Any:
    return service.search(q)


@router.get("/summary")
def summary(patient_id: int | None = None, service: BloodUnitService = Depends(get_service)) -> Any:
    return service.summary(patient_id=patient_id)


@router.get("/{record_id}")
def get(record_id: int, service: BloodUnitService = Depends(get_service)) -> Any:
    return service.get(record_id)


@router.put("/{record_id}")
def update(
    record_id: int, payload: BloodUnitUpdate, service: BloodUnitService = Depends(get_service)
) -> Any:
    return service.update(record_id, payload)


@router.delete("/{record_id}", status_code=204)
def delete(record_id: int, service: BloodUnitService = Depends(get_service)) -> Any:
    service.delete(record_id)
    return None


@router.post("/{record_id}/activate")
def activate(record_id: int, service: BloodUnitService = Depends(get_service)) -> Any:
    return service.activate(record_id)


@router.post("/{record_id}/deactivate")
def deactivate(record_id: int, service: BloodUnitService = Depends(get_service)) -> Any:
    return service.deactivate(record_id)


@router.post("/{record_id}/complete")
def complete(
    record_id: int, notes: str | None = None, service: BloodUnitService = Depends(get_service)
) -> Any:
    return service.complete(record_id, notes=notes)


@router.post("/{record_id}/cancel")
def cancel(
    record_id: int, reason: str | None = None, service: BloodUnitService = Depends(get_service)
) -> Any:
    return service.cancel(record_id, reason=reason)
