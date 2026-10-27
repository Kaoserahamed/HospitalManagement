"""Escalation repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class EscalationRepository:
    def __init__(self) -> None:
        self._policies: dict[int, dict] = {}
        self._escalations: dict[int, dict] = {}
        self._counters = {"policy": 0, "escalation": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_policy(self, data: dict) -> dict:
        pid = self._next("policy")
        record = {"id": pid, **data, "is_active": data.get("is_active", True)}
        self._policies[pid] = record
        return dict(record)

    def get_policy(self, policy_id: int) -> Optional[dict]:
        record = self._policies.get(policy_id)
        return dict(record) if record else None

    def list_policies(self) -> list[dict]:
        return [dict(p) for p in self._policies.values()]

    def create_escalation(self, data: dict) -> dict:
        eid = self._next("escalation")
        record = {"id": eid, **data, "status": data.get("status", "open")}
        self._escalations[eid] = record
        return dict(record)

    def get_escalation(self, escalation_id: int) -> Optional[dict]:
        record = self._escalations.get(escalation_id)
        return dict(record) if record else None

    def update_escalation(self, escalation_id: int, data: dict) -> dict:
        record = self._escalations.get(escalation_id)
        if record is None:
            raise KeyError(f"Escalation {escalation_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._escalations[escalation_id] = record
        return dict(record)

    def list_escalations(self, params: PageParams, patient_id: int | None = None, status: str | None = None, level: str | None = None) -> PageResult:
        items = list(self._escalations.values())
        if patient_id is not None:
            items = [e for e in items if e.get("patient_id") == patient_id]
        if status is not None:
            items = [e for e in items if e.get("status") == status]
        if level is not None:
            items = [e for e in items if e.get("level") == level]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def resolve(self, escalation_id: int, notes: str | None = None) -> dict:
        payload = {"status": "resolved", "resolved_at": datetime.utcnow()}
        if notes:
            payload["notes"] = notes
        return self.update_escalation(escalation_id, payload)

    def escalate(self, escalation_id: int) -> dict:
        record = self.get_escalation(escalation_id)
        if record is None:
            raise KeyError(f"Escalation {escalation_id} not found")
        levels = ["level1", "level2", "level3"]
        current = record.get("level", "level1")
        idx = levels.index(current) if current in levels else 0
        next_level = levels[min(idx + 1, len(levels) - 1)]
        return self.update_escalation(escalation_id, {"level": next_level, "status": "escalated"})

    def clear(self) -> None:
        self._policies.clear()
        self._escalations.clear()
        for k in self._counters:
            self._counters[k] = 0
