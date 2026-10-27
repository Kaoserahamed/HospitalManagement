"""Workflow repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class WorkflowRepository:
    def __init__(self) -> None:
        self._definitions: dict[int, dict] = {}
        self._instances: dict[int, dict] = {}
        self._steps: dict[int, dict] = {}
        self._transitions: dict[int, dict] = {}
        self._counters = {"definition": 0, "instance": 0, "step": 0, "transition": 0}

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

    def create_instance(self, data: dict) -> dict:
        iid = self._next("instance")
        record = {"id": iid, **data, "status": data.get("status", "draft"), "current_step": 0}
        self._instances[iid] = record
        return dict(record)

    def get_instance(self, instance_id: int) -> Optional[dict]:
        record = self._instances.get(instance_id)
        return dict(record) if record else None

    def update_instance(self, instance_id: int, data: dict) -> dict:
        record = self._instances.get(instance_id)
        if record is None:
            raise KeyError(f"Instance {instance_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._instances[instance_id] = record
        return dict(record)

    def list_instances(self, params: PageParams, entity_type: str | None = None, status: str | None = None) -> PageResult:
        items = list(self._instances.values())
        if entity_type is not None:
            items = [i for i in items if i.get("entity_type") == entity_type]
        if status is not None:
            items = [i for i in items if i.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_step(self, data: dict) -> dict:
        sid = self._next("step")
        record = {"id": sid, **data, "status": data.get("status", "pending")}
        self._steps[sid] = record
        return dict(record)

    def get_step(self, step_id: int) -> Optional[dict]:
        record = self._steps.get(step_id)
        return dict(record) if record else None

    def update_step(self, step_id: int, data: dict) -> dict:
        record = self._steps.get(step_id)
        if record is None:
            raise KeyError(f"Step {step_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._steps[step_id] = record
        return dict(record)

    def list_steps(self, instance_id: int) -> list[dict]:
        return [dict(s) for s in self._steps.values() if s.get("instance_id") == instance_id]

    def create_transition(self, data: dict) -> dict:
        tid = self._next("transition")
        record = {"id": tid, **data}
        self._transitions[tid] = record
        return dict(record)

    def list_transitions(self, instance_id: int) -> list[dict]:
        return [dict(t) for t in self._transitions.values() if t.get("instance_id") == instance_id]

    def clear(self) -> None:
        self._definitions.clear()
        self._instances.clear()
        self._steps.clear()
        self._transitions.clear()
        for k in self._counters:
            self._counters[k] = 0
