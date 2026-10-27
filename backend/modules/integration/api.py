"""Integration API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import AdapterCreate, SyncLogCreate, WebhookCreate, WebhookDeliveryCreate
from .service import IntegrationService

router = APIRouter(prefix="/integration", tags=["integration"])


def get_service() -> IntegrationService:
    return IntegrationService()


@router.post("/adapters", status_code=201)
def create_adapter(payload: AdapterCreate, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.create_adapter(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/adapters")
def list_adapters(adapter_type: str | None = None, status: str | None = None, service: IntegrationService = Depends(get_service)) -> Any:
    return service.list_adapters(adapter_type=adapter_type, status=status)


@router.get("/adapters/{adapter_id}")
def get_adapter(adapter_id: int, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.get_adapter(adapter_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/adapters/{adapter_id}")
def update_adapter(adapter_id: int, payload: dict, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.update_adapter(adapter_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/adapters/{adapter_id}/activate")
def activate_adapter(adapter_id: int, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.activate_adapter(adapter_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/adapters/{adapter_id}/deactivate")
def deactivate_adapter(adapter_id: int, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.deactivate_adapter(adapter_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/adapters/{adapter_id}/sync")
def sync(adapter_id: int, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.sync(adapter_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/adapters/{adapter_id}/sync-logs")
def sync_logs(adapter_id: int, service: IntegrationService = Depends(get_service)) -> Any:
    return service.sync_logs(adapter_id=adapter_id)


@router.get("/adapters/{adapter_id}/health")
def adapter_health(adapter_id: int, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.adapter_health(adapter_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/webhooks", status_code=201)
def create_webhook(payload: WebhookCreate, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.create_webhook(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/webhooks")
def list_webhooks(is_active: bool | None = None, service: IntegrationService = Depends(get_service)) -> Any:
    return service.list_webhooks(is_active=is_active)


@router.get("/webhooks/{webhook_id}")
def get_webhook(webhook_id: int, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.get_webhook(webhook_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/webhooks/{webhook_id}", status_code=204)
def delete_webhook(webhook_id: int, service: IntegrationService = Depends(get_service)) -> None:
    try:
        service.delete_webhook(webhook_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/webhooks/{webhook_id}/trigger")
def trigger_webhook(webhook_id: int, event: str, payload: dict, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.trigger_webhook(webhook_id, event, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/webhooks/{webhook_id}/deliveries")
def list_deliveries(webhook_id: int, service: IntegrationService = Depends(get_service)) -> Any:
    return service.list_deliveries(webhook_id=webhook_id)


@router.post("/deliveries/{delivery_id}/retry")
def retry_delivery(delivery_id: int, service: IntegrationService = Depends(get_service)) -> Any:
    try:
        return service.retry_delivery(delivery_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc
