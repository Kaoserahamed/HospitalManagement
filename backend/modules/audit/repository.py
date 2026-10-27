"""Audit repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class AuditRepository:
    def __init__(self) -> None:
        self._logs: list[dict] = []
        self._counter: int = 0

    def record(self, data: dict) -> dict:
        self._counter += 1
        record = {"id": self._counter, **data, "occurred_at": data.get("occurred_at", datetime.utcnow())}
        self._logs.append(record)
        return dict(record)

    def list(self, params: PageParams, actor_id: int | None = None, action: str | None = None,
             resource_type: str | None = None, resource_id: int | None = None,
             severity: str | None = None, from_date: datetime | None = None,
             to_date: datetime | None = None) -> PageResult:
        items = list(self._logs)
        if actor_id is not None:
            items = [l for l in items if l.get("actor_id") == actor_id]
        if action is not None:
            items = [l for l in items if l.get("action") == action]
        if resource_type is not None:
            items = [l for l in items if l.get("resource_type") == resource_type]
        if resource_id is not None:
            items = [l for l in items if l.get("resource_id") == resource_id]
        if severity is not None:
            items = [l for l in items if l.get("severity") == severity]
        if from_date is not None:
            items = [l for l in items if l.get("occurred_at") and l["occurred_at"] >= from_date]
        if to_date is not None:
            items = [l for l in items if l.get("occurred_at") and l["occurred_at"] <= to_date]
        # newest first
        items = sorted(items, key=lambda x: x.get("occurred_at") or datetime.min, reverse=True)
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def count(self) -> int:
        return len(self._logs)

    def clear(self) -> None:
        self._logs.clear()
        self._counter = 0
