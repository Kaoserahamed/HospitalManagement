"""Integration repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class IntegrationRepository:
    def __init__(self) -> None:
        self._adapters: dict[int, dict] = {}
        self._sync_logs: dict[int, dict] = {}
        self._webhooks: dict[int, dict] = {}
        self._deliveries: dict[int, dict] = {}
        self._counters = {"adapter": 0, "sync": 0, "webhook": 0, "delivery": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_adapter(self, data: dict) -> dict:
        aid = self._next("adapter")
        record = {"id": aid, **data, "status": data.get("status", "active")}
        self._adapters[aid] = record
        return dict(record)

    def get_adapter(self, adapter_id: int) -> Optional[dict]:
        record = self._adapters.get(adapter_id)
        return dict(record) if record else None

    def list_adapters(self, adapter_type: str | None = None, status: str | None = None) -> list[dict]:
        items = list(self._adapters.values())
        if adapter_type is not None:
            items = [a for a in items if a.get("adapter_type") == adapter_type]
        if status is not None:
            items = [a for a in items if a.get("status") == status]
        return [dict(a) for a in items]

    def update_adapter(self, adapter_id: int, data: dict) -> dict:
        record = self._adapters.get(adapter_id)
        if record is None:
            raise KeyError(f"Adapter {adapter_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._adapters[adapter_id] = record
        return dict(record)

    def create_sync_log(self, data: dict) -> dict:
        sid = self._next("sync")
        record = {"id": sid, **data}
        self._sync_logs[sid] = record
        return dict(record)

    def list_sync_logs(self, adapter_id: int | None = None) -> list[dict]:
        items = list(self._sync_logs.values())
        if adapter_id is not None:
            items = [s for s in items if s.get("adapter_id") == adapter_id]
        return [dict(s) for s in items]

    def create_webhook(self, data: dict) -> dict:
        wid = self._next("webhook")
        record = {"id": wid, **data, "is_active": data.get("is_active", True)}
        self._webhooks[wid] = record
        return dict(record)

    def get_webhook(self, webhook_id: int) -> Optional[dict]:
        record = self._webhooks.get(webhook_id)
        return dict(record) if record else None

    def list_webhooks(self, is_active: bool | None = None) -> list[dict]:
        items = list(self._webhooks.values())
        if is_active is not None:
            items = [w for w in items if w.get("is_active") == is_active]
        return [dict(w) for w in items]

    def create_delivery(self, data: dict) -> dict:
        did = self._next("delivery")
        record = {"id": did, **data}
        self._deliveries[did] = record
        return dict(record)

    def list_deliveries(self, webhook_id: int | None = None) -> list[dict]:
        items = list(self._deliveries.values())
        if webhook_id is not None:
            items = [d for d in items if d.get("webhook_id") == webhook_id]
        return [dict(d) for d in items]

    def clear(self) -> None:
        self._adapters.clear()
        self._sync_logs.clear()
        self._webhooks.clear()
        self._deliveries.clear()
        for k in self._counters:
            self._counters[k] = 0
