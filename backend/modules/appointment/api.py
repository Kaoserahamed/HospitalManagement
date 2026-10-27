"""Appointment API routes."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import AppointmentCreate, AppointmentListParams, AppointmentUpdate, ConflictCheck, SlotCreate
from .service import AppointmentService

router = APIRouter(prefix="/appointments", tags=["appointments"])


def get_service() -> AppointmentService:
    return AppointmentService()


@router.get("/")
def list_appointments(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    doctor_id: int | None = None,
    patient_id: int | None = None,
    status: str | None = None,
    service: AppointmentService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list(params, doctor_id=doctor_id, patient_id=patient_id, status=status).to_dict()


@router.post("/", status_code=201)
def create_appointment(payload: AppointmentCreate, service: AppointmentService = Depends(get_service)) -> Any:
    try:
        return service.create(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{appointment_id}")
def get_appointment(appointment_id: int, service: AppointmentService = Depends(get_service)) -> Any:
    try:
        return service.get(appointment_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{appointment_id}")
def update_appointment(appointment_id: int, payload: AppointmentUpdate, service: AppointmentService = Depends(get_service)) -> Any:
    try:
        return service.update(appointment_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/{appointment_id}", status_code=204)
def delete_appointment(appointment_id: int, service: AppointmentService = Depends(get_service)) -> None:
    try:
        service.delete(appointment_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{appointment_id}/cancel")
def cancel_appointment(appointment_id: int, reason: str | None = None, service: AppointmentService = Depends(get_service)) -> Any:
    try:
        return service.cancel(appointment_id, reason)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{appointment_id}/complete")
def complete_appointment(appointment_id: int, notes: str | None = None, service: AppointmentService = Depends(get_service)) -> Any:
    try:
        return service.complete(appointment_id, notes)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{appointment_id}/no-show")
def no_show(appointment_id: int, service: AppointmentService = Depends(get_service)) -> Any:
    try:
        return service.mark_no_show(appointment_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/conflicts/check")
def check_conflict(check: ConflictCheck, service: AppointmentService = Depends(get_service)) -> Any:
    return service.check_conflict(check)


@router.post("/slots", status_code=201)
def create_slot(payload: SlotCreate, service: AppointmentService = Depends(get_service)) -> Any:
    try:
        return service.create_slot(payload.doctor_id, payload.start_time, payload.end_time)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/slots/available")
def available_slots(doctor_id: int, service: AppointmentService = Depends(get_service)) -> Any:
    return service.available_slots(doctor_id)


@router.post("/slots/{slot_id}/book")
def book_slot(slot_id: int, appointment_id: int, service: AppointmentService = Depends(get_service)) -> Any:
    try:
        return service.book_slot(slot_id, appointment_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc
