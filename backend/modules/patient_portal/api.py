"""Patient portal API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import (
    MessageCreate,
    MessageUpdate,
    PrescriptionDownloadCreate,
    ReminderCreate,
    ReminderUpdate,
)
from .service import PatientPortalService

router = APIRouter(prefix="/portal", tags=["portal"])


def get_service() -> PatientPortalService:
    return PatientPortalService()


@router.post("/messages", status_code=201)
def send_message(payload: MessageCreate, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.send_message(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/messages")
def list_messages(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    recipient_id: int | None = None,
    sender_id: int | None = None,
    unread_only: bool = False,
    service: PatientPortalService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_messages(params, recipient_id=recipient_id, sender_id=sender_id, unread_only=unread_only).to_dict()


@router.get("/messages/{message_id}")
def get_message(message_id: int, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.get_message(message_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/messages/{message_id}")
def update_message(message_id: int, payload: MessageUpdate, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.repository.update_message(message_id, payload.model_dump(exclude_unset=True))
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/messages/{message_id}/read")
def mark_read(message_id: int, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.mark_read(message_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/conversations/{user_id}")
def conversations(user_id: int, service: PatientPortalService = Depends(get_service)) -> Any:
    return service.conversations(user_id)


@router.get("/unread-count")
def unread_count(recipient_id: int, service: PatientPortalService = Depends(get_service)) -> Any:
    return {"count": service.unread_count(recipient_id)}


@router.post("/downloads", status_code=201)
def record_download(payload: PrescriptionDownloadCreate, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.record_download(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/downloads")
def list_downloads(patient_id: int | None = None, service: PatientPortalService = Depends(get_service)) -> Any:
    return service.list_downloads(patient_id=patient_id)


@router.post("/reminders", status_code=201)
def create_reminder(payload: ReminderCreate, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.create_reminder(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/reminders")
def list_reminders(patient_id: int | None = None, status: str | None = None, service: PatientPortalService = Depends(get_service)) -> Any:
    return service.list_reminders(patient_id=patient_id, status=status)


@router.get("/reminders/pending")
def pending_reminders(patient_id: int | None = None, service: PatientPortalService = Depends(get_service)) -> Any:
    return service.pending_reminders(patient_id=patient_id)


@router.get("/reminders/{reminder_id}")
def get_reminder(reminder_id: int, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.get_reminder(reminder_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/reminders/{reminder_id}")
def update_reminder(reminder_id: int, payload: ReminderUpdate, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.update_reminder(reminder_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/reminders/{reminder_id}/acknowledge")
def acknowledge_reminder(reminder_id: int, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.acknowledge_reminder(reminder_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/reminders/{reminder_id}/cancel")
def cancel_reminder(reminder_id: int, service: PatientPortalService = Depends(get_service)) -> Any:
    try:
        return service.cancel_reminder(reminder_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/reminders/appointment")
def send_appointment_reminder(patient_id: int, appointment_id: int, scheduled_at: str, service: PatientPortalService = Depends(get_service)) -> Any:
    from datetime import datetime
    return service.send_appointment_reminder(patient_id, appointment_id, datetime.fromisoformat(scheduled_at))


@router.post("/reminders/medication")
def send_medication_reminder(patient_id: int, medication: str, service: PatientPortalService = Depends(get_service)) -> Any:
    return service.send_medication_reminder(patient_id, medication)


@router.post("/reminders/lab-result")
def send_lab_result_notification(patient_id: int, result_id: int, service: PatientPortalService = Depends(get_service)) -> Any:
    return service.send_lab_result_notification(patient_id, result_id)


@router.get("/summary")
def portal_summary(patient_id: int, service: PatientPortalService = Depends(get_service)) -> Any:
    return service.portal_summary(patient_id)
