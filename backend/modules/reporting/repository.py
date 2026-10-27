"""Reporting repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class ReportingRepository:
    def __init__(self) -> None:
        self._definitions: dict[int, dict] = {}
        self._executions: dict[int, dict] = {}
        self._subscriptions: dict[int, dict] = {}
        self._counters = {"definition": 0, "execution": 0, "subscription": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_definition(self, data: dict) -> dict:
        did = self._next("definition")
        record = {"id": did, **data, "is_active": data.get("is_active", True)}
        self._definitions[did] = record
        return dict(record)

    def get_definition(self, definition_id: int) -> Optional[dict]:
        record = self._definitions.get(definition_id)
        return dict(record) if record else None

    def list_definitions(self, active_only: bool = False) -> list[dict]:
        items = list(self._definitions.values())
        if active_only:
            items = [d for d in items if d.get("is_active")]
        return [dict(d) for d in items]

    def update_definition(self, definition_id: int, data: dict) -> dict:
        record = self._definitions.get(definition_id)
        if record is None:
            raise KeyError(f"Definition {definition_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._definitions[definition_id] = record
        return dict(record)

    def create_execution(self, data: dict) -> dict:
        eid = self._next("execution")
        record = {"id": eid, **data, "status": data.get("status", "pending")}
        self._executions[eid] = record
        return dict(record)

    def get_execution(self, execution_id: int) -> Optional[dict]:
        record = self._executions.get(execution_id)
        return dict(record) if record else None

    def update_execution(self, execution_id: int, data: dict) -> dict:
        record = self._executions.get(execution_id)
        if record is None:
            raise KeyError(f"Execution {execution_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._executions[execution_id] = record
        return dict(record)

    def list_executions(self, definition_id: int | None = None) -> list[dict]:
        items = list(self._executions.values())
        if definition_id is not None:
            items = [e for e in items if e.get("definition_id") == definition_id]
        return [dict(e) for e in items]

    def create_subscription(self, data: dict) -> dict:
        sid = self._next("subscription")
        record = {"id": sid, **data, "is_active": data.get("is_active", True)}
        self._subscriptions[sid] = record
        return dict(record)

    def list_subscriptions(self, definition_id: int | None = None) -> list[dict]:
        items = list(self._subscriptions.values())
        if definition_id is not None:
            items = [s for s in items if s.get("definition_id") == definition_id]
        return [dict(s) for s in items]

    def clear(self) -> None:
        self._definitions.clear()
        self._executions.clear()
        self._subscriptions.clear()
        for k in self._counters:
            self._counters[k] = 0
