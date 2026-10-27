"""Scheduling API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from .schemas import (
    AvailabilityCreate,
    CoverageAlertCreate,
    OnCallCreate,
    ShiftSwapCreate,
    ShiftSwapUpdate,
    ShiftTemplateCreate,
)
from .service import SchedulingService

router = APIRouter(prefix="/scheduling", tags=["scheduling"])


def get_service() -> SchedulingService:
    return SchedulingService()


@router.post("/swaps", status_code=201)
def request_swap(payload: ShiftSwapCreate, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.request_swap(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/swaps")
def list_swaps(status: str | None = None, service: SchedulingService = Depends(get_service)) -> Any:
    return service.list_swaps(status=status)


@router.get("/swaps/pending")
def pending_swaps(service: SchedulingService = Depends(get_service)) -> Any:
    return service.pending_swaps()


@router.get("/swaps/{swap_id}")
def get_swap(swap_id: int, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.get_swap(swap_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/swaps/{swap_id}/approve")
def approve_swap(swap_id: int, reviewer_id: int, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.approve_swap(swap_id, reviewer_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/swaps/{swap_id}/reject")
def reject_swap(swap_id: int, reviewer_id: int, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.reject_swap(swap_id, reviewer_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/swaps/{swap_id}/cancel")
def cancel_swap(swap_id: int, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.cancel_swap(swap_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/oncall", status_code=201)
def create_oncall(payload: OnCallCreate, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.create_oncall(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/oncall")
def list_oncall(department_id: int | None = None, active_only: bool = False, service: SchedulingService = Depends(get_service)) -> Any:
    return service.list_oncall(department_id=department_id, active_only=active_only)


@router.get("/oncall/department/{department_id}")
def oncall_for_department(department_id: int, service: SchedulingService = Depends(get_service)) -> Any:
    return service.oncall_for_department(department_id)


@router.post("/coverage-alerts", status_code=201)
def create_coverage_alert(payload: CoverageAlertCreate, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.create_coverage_alert(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/coverage-alerts")
def list_coverage_alerts(department_id: int | None = None, acknowledged: bool | None = None, service: SchedulingService = Depends(get_service)) -> Any:
    return service.list_coverage_alerts(department_id=department_id, acknowledged=acknowledged)


@router.get("/coverage-alerts/unacknowledged")
def unacknowledged_alerts(service: SchedulingService = Depends(get_service)) -> Any:
    return service.unacknowledged_alerts()


@router.post("/coverage-alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.acknowledge_coverage_alert(alert_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/shift-templates", status_code=201)
def create_template(payload: ShiftTemplateCreate, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.create_shift_template(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/shift-templates")
def list_templates(department_id: int | None = None, service: SchedulingService = Depends(get_service)) -> Any:
    return service.list_shift_templates(department_id=department_id)


@router.post("/shift-templates/{template_id}/apply")
def apply_template(template_id: int, start_date: str, weeks: int = 1, service: SchedulingService = Depends(get_service)) -> Any:
    from datetime import date
    try:
        return service.apply_template(template_id, date.fromisoformat(start_date), weeks=weeks)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/availability", status_code=201)
def set_availability(payload: AvailabilityCreate, service: SchedulingService = Depends(get_service)) -> Any:
    try:
        return service.set_availability(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/availability/{staff_id}")
def get_availability(staff_id: int, service: SchedulingService = Depends(get_service)) -> Any:
    return service.get_availability(staff_id)


@router.get("/available-staff")
def find_available_staff(department_id: int, day_of_week: int, start_time: str, end_time: str, service: SchedulingService = Depends(get_service)) -> Any:
    from datetime import time
    s = time.fromisoformat(start_time)
    e = time.fromisoformat(end_time)
    return service.find_available_staff(department_id, day_of_week, s, e)


@router.get("/coverage-gaps")
def detect_gaps(department_id: int, date: str, shift_type: str, required: int = 1, service: SchedulingService = Depends(get_service)) -> Any:
    from datetime import date as d
    return service.detect_coverage_gaps(department_id, d.fromisoformat(date), shift_type, required=required)


@router.get("/generate-schedule")
def generate_schedule(department_id: int, start_date: str, days: int = 7, service: SchedulingService = Depends(get_service)) -> Any:
    from datetime import date as d
    return service.generate_schedule(department_id, d.fromisoformat(start_date), days=days)


@router.get("/workload/{staff_id}")
def staff_workload(staff_id: int, service: SchedulingService = Depends(get_service)) -> Any:
    return service.staff_workload(staff_id)


@router.get("/overtime-alerts")
def overtime_alerts(threshold_hours: int = 40, service: SchedulingService = Depends(get_service)) -> Any:
    return service.overtime_alerts(threshold_hours=threshold_hours)
