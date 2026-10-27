"""Telemedicine API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import (
    SessionMetricCreate,
    VirtualVisitCreate,
    VirtualVisitUpdate,
    WaitingRoomEntry,
)
from .service import TelemedicineService

router = APIRouter(prefix="/telemedicine", tags=["telemedicine"])


def get_service() -> TelemedicineService:
    return TelemedicineService()


@router.post("/visits", status_code=201)
def schedule_visit(payload: VirtualVisitCreate, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.schedule_visit(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/visits")
def list_visits(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    patient_id: int | None = None,
    doctor_id: int | None = None,
    status: str | None = None,
    service: TelemedicineService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_visits(params, patient_id=patient_id, doctor_id=doctor_id, status=status).to_dict()


@router.get("/visits/{visit_id}")
def get_visit(visit_id: int, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.get_visit(visit_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/visits/{visit_id}")
def update_visit(visit_id: int, payload: VirtualVisitUpdate, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.update_visit(visit_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/visits/{visit_id}/start")
def start_visit(visit_id: int, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.start_visit(visit_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/visits/{visit_id}/end")
def end_visit(visit_id: int, quality: str | None = None, notes: str | None = None, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.end_visit(visit_id, quality=quality, notes=notes)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/visits/{visit_id}/cancel")
def cancel_visit(visit_id: int, reason: str | None = None, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.cancel_visit(visit_id, reason=reason)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/visits/{visit_id}/no-show")
def mark_no_show(visit_id: int, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.mark_no_show(visit_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/visits/{visit_id}", status_code=204)
def delete_visit(visit_id: int, service: TelemedicineService = Depends(get_service)) -> None:
    try:
        service.delete_visit(visit_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/waiting-room", status_code=201)
def enter_waiting_room(payload: WaitingRoomEntry, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.enter_waiting_room(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/waiting-room")
def list_waiting_room(admitted: bool | None = None, service: TelemedicineService = Depends(get_service)) -> Any:
    return service.list_waiting_room(admitted=admitted)


@router.post("/waiting-room/{waiting_id}/admit")
def admit_patient(waiting_id: int, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.admit_patient(waiting_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/metrics", status_code=201)
def record_metric(payload: SessionMetricCreate, service: TelemedicineService = Depends(get_service)) -> Any:
    try:
        return service.record_metric(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/visits/{visit_id}/metrics")
def list_metrics(visit_id: int, service: TelemedicineService = Depends(get_service)) -> Any:
    return service.list_metrics(visit_id)


@router.get("/summary")
def visit_summary(service: TelemedicineService = Depends(get_service)) -> Any:
    return service.summary()
