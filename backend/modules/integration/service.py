"""Integration service."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import IntegrationRepository
from .schemas import AdapterCreate, SyncLogCreate, WebhookCreate, WebhookDeliveryCreate


class IntegrationService:
    def __init__(self, repository: IntegrationRepository | None = None) -> None:
        self.repository = repository or IntegrationRepository()

    def create_adapter(self, data: AdapterCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_adapter(payload)
        default_bus.publish(DomainEvent(name="AdapterCreated", payload={"adapter_id": record["id"]}))
        return record

    def get_adapter(self, adapter_id: int) -> dict:
        record = self.repository.get_adapter(adapter_id)
        if record is None:
            raise NotFoundError("IntegrationAdapter", adapter_id)
        return record

    def list_adapters(self, adapter_type: str | None = None, status: str | None = None) -> list[dict]:
        return self.repository.list_adapters(adapter_type=adapter_type, status=status)

    def update_adapter(self, adapter_id: int, data: dict) -> dict:
        return self.repository.update_adapter(adapter_id, data)

    def activate_adapter(self, adapter_id: int) -> dict:
        return self.repository.update_adapter(adapter_id, {"status": "active"})

    def deactivate_adapter(self, adapter_id: int) -> dict:
        return self.repository.update_adapter(adapter_id, {"status": "inactive"})

    def sync(self, adapter_id: int) -> dict:
        adapter = self.get_adapter(adapter_id)
        log = self.repository.create_sync_log({"adapter_id": adapter_id, "status": "running", "records_processed": 0, "records_failed": 0, "started_at": datetime.utcnow()})
        # simulate sync
        records_processed = 100
        records_failed = 0
        log = self.repository.create_sync_log({"adapter_id": adapter_id, "status": "completed", "records_processed": records_processed, "records_failed": records_failed, "completed_at": datetime.utcnow()})
        self.repository.update_adapter(adapter_id, {"last_sync": datetime.utcnow(), "status": "active"})
        default_bus.publish(DomainEvent(name="SyncCompleted", payload={"adapter_id": adapter_id, "records": records_processed}))
        return log

    def sync_logs(self, adapter_id: int | None = None) -> list[dict]:
        return self.repository.list_sync_logs(adapter_id=adapter_id)

    def create_webhook(self, data: WebhookCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_webhook(payload)
        default_bus.publish(DomainEvent(name="WebhookCreated", payload={"webhook_id": record["id"]}))
        return record

    def get_webhook(self, webhook_id: int) -> dict:
        record = self.repository.get_webhook(webhook_id)
        if record is None:
            raise NotFoundError("Webhook", webhook_id)
        return record

    def list_webhooks(self, is_active: bool | None = None) -> list[dict]:
        return self.repository.list_webhooks(is_active=is_active)

    def delete_webhook(self, webhook_id: int) -> bool:
        if self.repository.get_webhook(webhook_id) is None:
            raise NotFoundError("Webhook", webhook_id)
        del self.repository._webhooks[webhook_id]
        return True

    def trigger_webhook(self, webhook_id: int, event: str, payload: dict) -> dict:
        webhook = self.get_webhook(webhook_id)
        import json
        delivery = self.repository.create_delivery({"webhook_id": webhook_id, "event": event, "payload": json.dumps(payload), "response_status": 200, "response_body": "OK", "delivered_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="WebhookDelivered", payload={"webhook_id": webhook_id, "event": event}))
        return delivery

    def list_deliveries(self, webhook_id: int | None = None) -> list[dict]:
        return self.repository.list_deliveries(webhook_id=webhook_id)

    def retry_delivery(self, delivery_id: int) -> dict:
        deliveries = self.repository.list_deliveries()
        delivery = next((d for d in deliveries if d["id"] == delivery_id), None)
        if delivery is None:
            raise NotFoundError("WebhookDelivery", delivery_id)
        return self.repository.create_delivery({"webhook_id": delivery["webhook_id"], "event": delivery["event"], "payload": delivery["payload"], "response_status": 200, "response_body": "OK (retry)", "delivered_at": datetime.utcnow()})

    def adapter_health(self, adapter_id: int) -> dict:
        adapter = self.get_adapter(adapter_id)
        logs = self.repository.list_sync_logs(adapter_id=adapter_id)
        last = logs[-1] if logs else None
        return {"adapter_id": adapter_id, "status": adapter.get("status"), "last_sync": adapter.get("last_sync"), "last_sync_status": last.get("status") if last else None, "records_processed": last.get("records_processed", 0) if last else 0}

    def clear(self) -> None:
        self.repository.clear()
