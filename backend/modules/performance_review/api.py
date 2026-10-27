"""PerformanceReview API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query

from backend.shared.pagination import PageParams

from .schemas import PerformanceReviewCreate, PerformanceReviewUpdate
from .service import PerformanceReviewService

router = APIRouter(prefix="/performance_review", tags=["performance_review"])


def get_service() -> PerformanceReviewService:
    return PerformanceReviewService()


@router.post("/", status_code=201)
def create(
    payload: PerformanceReviewCreate, service: PerformanceReviewService = Depends(get_service)
) -> Any:
    return service.create(payload)


@router.get("/")
def list_records(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    patient_id: int | None = None,
    status: str | None = None,
    priority: str | None = None,
    category: str | None = None,
    service: PerformanceReviewService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list(
        params, patient_id=patient_id, status=status, priority=priority, category=category
    ).to_dict()


@router.get("/all")
def list_all(
    patient_id: int | None = None,
    status: str | None = None,
    service: PerformanceReviewService = Depends(get_service),
) -> Any:
    return service.list_all(patient_id=patient_id, status=status)


@router.get("/count")
def count(service: PerformanceReviewService = Depends(get_service)) -> None:
    return {"count": service.count()}


@router.get("/search")
def search(
    q: str = Query(..., min_length=1), service: PerformanceReviewService = Depends(get_service)
) -> Any:
    return service.search(q)


@router.get("/summary")
def summary(
    patient_id: int | None = None, service: PerformanceReviewService = Depends(get_service)
) -> Any:
    return service.summary(patient_id=patient_id)


@router.get("/{record_id}")
def get(record_id: int, service: PerformanceReviewService = Depends(get_service)) -> None:
    return service.get(record_id)


@router.put("/{record_id}")
def update(
    record_id: int,
    payload: PerformanceReviewUpdate,
    service: PerformanceReviewService = Depends(get_service),
) -> Any:
    return service.update(record_id, payload)


@router.delete("/{record_id}", status_code=200)
def delete(record_id: int, service: PerformanceReviewService = Depends(get_service)) -> None:
    service.delete(record_id)


@router.post("/{record_id}/activate")
def activate(record_id: int, service: PerformanceReviewService = Depends(get_service)) -> None:
    return service.activate(record_id)


@router.post("/{record_id}/deactivate")
def deactivate(record_id: int, service: PerformanceReviewService = Depends(get_service)) -> None:
    return service.deactivate(record_id)


@router.post("/{record_id}/complete")
def complete(
    record_id: int,
    notes: str | None = None,
    service: PerformanceReviewService = Depends(get_service),
) -> Any:
    return service.complete(record_id, notes=notes)


@router.post("/{record_id}/cancel")
def cancel(
    record_id: int,
    reason: str | None = None,
    service: PerformanceReviewService = Depends(get_service),
) -> Any:
    return service.cancel(record_id, reason=reason)
