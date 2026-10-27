"""Rules engine repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class RulesEngineRepository:
    def __init__(self) -> None:
        self._rules: dict[int, dict] = {}
        self._executions: dict[int, dict] = {}
        self._sets: dict[int, dict] = {}
        self._counters = {"rule": 0, "execution": 0, "set": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_rule(self, data: dict) -> dict:
        rid = self._next("rule")
        record = {"id": rid, **data, "status": data.get("status", "draft")}
        self._rules[rid] = record
        return dict(record)

    def get_rule(self, rule_id: int) -> Optional[dict]:
        record = self._rules.get(rule_id)
        return dict(record) if record else None

    def list_rules(self, rule_type: str | None = None, status: str | None = None) -> list[dict]:
        items = list(self._rules.values())
        if rule_type is not None:
            items = [r for r in items if r.get("rule_type") == rule_type]
        if status is not None:
            items = [r for r in items if r.get("status") == status]
        return [dict(r) for r in items]

    def update_rule(self, rule_id: int, data: dict) -> dict:
        record = self._rules.get(rule_id)
        if record is None:
            raise KeyError(f"Rule {rule_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._rules[rule_id] = record
        return dict(record)

    def create_execution(self, data: dict) -> dict:
        eid = self._next("execution")
        record = {"id": eid, **data}
        self._executions[eid] = record
        return dict(record)

    def list_executions(self, rule_id: int | None = None) -> list[dict]:
        items = list(self._executions.values())
        if rule_id is not None:
            items = [e for e in items if e.get("rule_id") == rule_id]
        return [dict(e) for e in items]

    def create_set(self, data: dict) -> dict:
        sid = self._next("set")
        record = {"id": sid, **data, "is_active": data.get("is_active", True)}
        self._sets[sid] = record
        return dict(record)

    def get_set(self, set_id: int) -> Optional[dict]:
        record = self._sets.get(set_id)
        return dict(record) if record else None

    def list_sets(self) -> list[dict]:
        return [dict(s) for s in self._sets.values()]

    def clear(self) -> None:
        self._rules.clear()
        self._executions.clear()
        self._sets.clear()
        for k in self._counters:
            self._counters[k] = 0
