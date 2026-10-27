"""Notification API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import BulkNotificationCreate, NotificationCreate, NotificationTemplateCreate
from .service import NotificationService

router = APIRouter(prefix="/notifications", tags=["notifications"])


def get_service() -> NotificationService:
    return NotificationService()


@router.post("/", status_code=201)
def send_notification(payload: NotificationCreate, service: NotificationService = Depends(get_service)) -> None:
    try:
        return service.send(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/bulk", status_code=201)
def send_bulk(payload: BulkNotificationCreate, service: NotificationService = Depends(get_service)) -> None:
    try:
        return service.send_bulk(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/")
def list_notifications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    recipient_id: int | None = None,
    status: str | None = None,
    unread_only: bool = False,
    service: NotificationService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list(params, recipient_id=recipient_id, status=status, unread_only=unread_only).to_dict()


@router.get("/unread-count")
def unread_count(recipient_id: int, service: NotificationService = Depends(get_service)) -> None:
    return {"count": service.unread_count(recipient_id)}


@router.post("/{notification_id}/read")
def mark_read(notification_id: int, service: NotificationService = Depends(get_service)) -> None:
    try:
        return service.mark_read(notification_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/read-all")
def mark_all_read(recipient_id: int, service: NotificationService = Depends(get_service)) -> None:
    count = service.mark_all_read(recipient_id)
    return {"marked": count}


@router.post("/templates", status_code=201)
def create_template(payload: NotificationTemplateCreate, service: NotificationService = Depends(get_service)) -> None:
    try:
        return service.create_template(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/templates")
def list_templates(service: NotificationService = Depends(get_service)) -> None:
    return service.list_templates()


@router.get("/templates/{name}")
def get_template(name: str, service: NotificationService = Depends(get_service)) -> None:
    try:
        return service.get_template(name)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/templates/{name}/render")
def render_template(name: str, context: dict, service: NotificationService = Depends(get_service)) -> None:
    try:
        return service.render_template(name, context)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc
