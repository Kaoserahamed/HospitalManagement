"""Staff API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import (
    ShiftCreate,
    StaffProfileCreate,
    StaffProfileUpdate,
    TimeOffCreate,
    TimeOffUpdate,
)
from .service import StaffService

router = APIRouter(prefix="/staff", tags=["staff"])


def get_service() -> StaffService:
    return StaffService()


@router.post("/profiles", status_code=201)
def create_profile(payload: StaffProfileCreate, service: StaffService = Depends(get_service)) -> Any:
    try:
        return service.create_profile(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/profiles")
def list_profiles(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    department_id: int | None = None,
    active_only: bool = False,
    service: StaffService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_profiles(params, department_id=department_id, active_only=active_only).to_dict()


@router.get("/profiles/{profile_id}")
def get_profile(profile_id: int, service: StaffService = Depends(get_service)) -> Any:
    try:
        return service.get_profile(profile_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/profiles/by-user/{user_id}")
def get_profile_by_user(user_id: int, service: StaffService = Depends(get_service)) -> Any:
    try:
        return service.get_profile_by_user(user_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/profiles/{profile_id}")
def update_profile(profile_id: int, payload: StaffProfileUpdate, service: StaffService = Depends(get_service)) -> Any:
    try:
        return service.update_profile(profile_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/shifts", status_code=201)
def create_shift(payload: ShiftCreate, service: StaffService = Depends(get_service)) -> Any:
    try:
        return service.create_shift(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/shifts")
def list_shifts(staff_id: int | None = None, department_id: int | None = None, service: StaffService = Depends(get_service)) -> Any:
    return service.list_shifts(staff_id=staff_id, department_id=department_id)


@router.post("/time-off", status_code=201)
def request_time_off(payload: TimeOffCreate, service: StaffService = Depends(get_service)) -> Any:
    try:
        return service.request_time_off(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.put("/time-off/{request_id}")
def update_time_off(request_id: int, payload: TimeOffUpdate, service: StaffService = Depends(get_service)) -> Any:
    try:
        if payload.status == "approved":
            return service.approve_time_off(request_id, payload.reviewed_by or 0)
        if payload.status == "rejected":
            return service.reject_time_off(request_id, payload.reviewed_by or 0)
        return service.repository.update_time_off(request_id, payload.model_dump(exclude_unset=True))
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/time-off")
def list_time_off(staff_id: int | None = None, status: str | None = None, service: StaffService = Depends(get_service)) -> Any:
    return service.list_time_off(staff_id=staff_id, status=status)


@router.post("/roster")
def create_roster_entry(department_id: int, date: str, staff_id: int, shift_type: str = "morning", service: StaffService = Depends(get_service)) -> Any:
    from datetime import date as _date

    return service.create_roster_entry(department_id, _date.fromisoformat(date), staff_id, shift_type)


@router.get("/roster")
def list_roster(department_id: int | None = None, date: str | None = None, service: StaffService = Depends(get_service)) -> Any:
    from datetime import date as _date

    date_value = _date.fromisoformat(date) if date else None
    return service.list_roster(department_id=department_id, date_value=date_value)


@router.get("/coverage-gaps")
def coverage_gaps(department_id: int, date: str, service: StaffService = Depends(get_service)) -> Any:
    from datetime import date as _date

    return service.coverage_gaps(department_id, _date.fromisoformat(date))
