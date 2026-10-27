"""MDT API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import MDTAttendeeCreate, MDTDecisionCreate, MDTMeetingCreate, MDTMeetingUpdate
from .service import MDTService

router = APIRouter(prefix="/mdt", tags=["mdt"])


def get_service() -> MDTService:
    return MDTService()


@router.post("/meetings", status_code=201)
def schedule_meeting(payload: MDTMeetingCreate, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.schedule_meeting(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/meetings")
def list_meetings(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    patient_id: int | None = None,
    status: str | None = None,
    service: MDTService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_meetings(params, patient_id=patient_id, status=status).to_dict()


@router.get("/meetings/{meeting_id}")
def get_meeting(meeting_id: int, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.get_meeting(meeting_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/meetings/{meeting_id}")
def update_meeting(meeting_id: int, payload: MDTMeetingUpdate, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.update_meeting(meeting_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/meetings/{meeting_id}/start")
def start_meeting(meeting_id: int, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.start_meeting(meeting_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/meetings/{meeting_id}/complete")
def complete_meeting(meeting_id: int, notes: str | None = None, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.complete_meeting(meeting_id, notes=notes)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/meetings/{meeting_id}/cancel")
def cancel_meeting(meeting_id: int, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.cancel_meeting(meeting_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/attendees", status_code=201)
def add_attendee(payload: MDTAttendeeCreate, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.add_attendee(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/meetings/{meeting_id}/attendees")
def list_attendees(meeting_id: int, service: MDTService = Depends(get_service)) -> Any:
    return service.list_attendees(meeting_id)


@router.post("/attendees/{attendee_id}/attend")
def mark_attended(attendee_id: int, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.mark_attended(attendee_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/decisions", status_code=201)
def add_decision(payload: MDTDecisionCreate, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.add_decision(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/meetings/{meeting_id}/decisions")
def list_decisions(meeting_id: int, service: MDTService = Depends(get_service)) -> Any:
    return service.list_decisions(meeting_id)


@router.put("/decisions/{decision_id}")
def update_decision(decision_id: int, status: str, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.update_decision(decision_id, status)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/decisions/{decision_id}/close")
def close_decision(decision_id: int, service: MDTService = Depends(get_service)) -> Any:
    try:
        return service.close_decision(decision_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/patients/{patient_id}/meetings")
def meetings_for_patient(patient_id: int, service: MDTService = Depends(get_service)) -> Any:
    return service.meetings_for_patient(patient_id)


@router.get("/meetings/{meeting_id}/attendance-rate")
def attendance_rate(meeting_id: int, service: MDTService = Depends(get_service)) -> Any:
    return {"rate": service.attendance_rate(meeting_id)}
