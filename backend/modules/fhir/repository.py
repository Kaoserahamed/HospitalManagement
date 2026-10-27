"""FHIR repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class FHIRRepository:
    def __init__(self) -> None:
        self._resources: dict[str, dict] = {}
        self._bundles: dict[int, dict] = {}
        self._subscriptions: dict[int, dict] = {}
        self._counters = {"resource": 0, "bundle": 0, "subscription": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_resource(self, data: dict) -> dict:
        rid = self._next("resource")
        record = {"id": rid, **data, "version": data.get("version", 1)}
        key = f"{data['resource_type']}/{data['resource_id']}"
        self._resources[key] = record
        return dict(record)

    def get_resource(self, resource_type: str, resource_id: str) -> Optional[dict]:
        key = f"{resource_type}/{resource_id}"
        record = self._resources.get(key)
        return dict(record) if record else None

    def update_resource(self, resource_type: str, resource_id: str, data: dict) -> dict:
        key = f"{resource_type}/{resource_id}"
        record = self._resources.get(key)
        if record is None:
            raise KeyError(f"Resource {key} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        record["version"] = record.get("version", 1) + 1
        self._resources[key] = record
        return dict(record)

    def delete_resource(self, resource_type: str, resource_id: str) -> bool:
        key = f"{resource_type}/{resource_id}"
        return self._resources.pop(key, None) is not None

    def search_resources(self, params: PageParams, resource_type: str | None = None) -> PageResult:
        items = list(self._resources.values())
        if resource_type is not None:
            items = [r for r in items if r.get("resource_type") == resource_type]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_bundle(self, data: dict) -> dict:
        bid = self._next("bundle")
        record = {"id": bid, **data}
        self._bundles[bid] = record
        return dict(record)

    def get_bundle(self, bundle_id: int) -> Optional[dict]:
        record = self._bundles.get(bundle_id)
        return dict(record) if record else None

    def create_subscription(self, data: dict) -> dict:
        sid = self._next("subscription")
        record = {"id": sid, **data, "is_active": data.get("is_active", True)}
        self._subscriptions[sid] = record
        return dict(record)

    def list_subscriptions(self, resource_type: str | None = None) -> list[dict]:
        items = list(self._subscriptions.values())
        if resource_type is not None:
            items = [s for s in items if s.get("resource_type") == resource_type]
        return [dict(s) for s in items]

    def count_resources(self) -> int:
        return len(self._resources)

    def clear(self) -> None:
        self._resources.clear()
        self._bundles.clear()
        self._subscriptions.clear()
        for k in self._counters:
            self._counters[k] = 0
