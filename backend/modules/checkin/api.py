"""Check-in API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import CheckInCreate, CheckInUpdate, KioskSessionCreate
from .service import CheckInService

router = APIRouter(prefix="/checkin", tags=["checkin"])


def get_service() -> CheckInService:
    return CheckInService()


@router.post("/", status_code=201)
def check_in(payload: CheckInCreate, service: CheckInService = Depends(get_service)) -> None:
    try:
        return service.check_in(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/")
def list_checkins(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: str | None = None,
    department_id: int | None = None,
    service: CheckInService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_checkins(params, status=status, department_id=department_id).to_dict()


@router.get("/{checkin_id}")
def get_checkin(checkin_id: int, service: CheckInService = Depends(get_service)) -> None:
    try:
        return service.get_checkin(checkin_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{checkin_id}")
def update_checkin(checkin_id: int, payload: CheckInUpdate, service: CheckInService = Depends(get_service)) -> None:
    try:
        return service.update_checkin(checkin_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{checkin_id}/call")
def call_patient(checkin_id: int, service: CheckInService = Depends(get_service)) -> None:
    try:
        return service.call_patient(checkin_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{checkin_id}/start-service")
def start_service(checkin_id: int, service: CheckInService = Depends(get_service)) -> None:
    try:
        return service.start_service(checkin_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{checkin_id}/complete")
def complete(checkin_id: int, service: CheckInService = Depends(get_service)) -> None:
    try:
        return service.complete(checkin_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{checkin_id}/no-show")
def mark_no_show(checkin_id: int, service: CheckInService = Depends(get_service)) -> None:
    try:
        return service.mark_no_show(checkin_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{checkin_id}/position")
def queue_position(checkin_id: int, service: CheckInService = Depends(get_service)) -> None:
    return service.queue_position(checkin_id)


@router.get("/queue/next")
def next_patient(department_id: int | None = None, service: CheckInService = Depends(get_service)) -> None:
    return service.next_patient(department_id=department_id)


@router.get("/queue/count")
def waiting_count(department_id: int | None = None, service: CheckInService = Depends(get_service)) -> None:
    return {"count": service.waiting_count(department_id=department_id)}


@router.get("/queue/stats")
def queue_stats(department_id: int | None = None, service: CheckInService = Depends(get_service)) -> None:
    return service.queue_stats(department_id=department_id)


@router.post("/kiosk/sessions", status_code=201)
def start_kiosk(payload: KioskSessionCreate, service: CheckInService = Depends(get_service)) -> None:
    try:
        return service.create_kiosk_session(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/kiosk/sessions/{session_id}/end")
def end_kiosk(session_id: int, service: CheckInService = Depends(get_service)) -> None:
    try:
        return service.end_kiosk_session(session_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc
