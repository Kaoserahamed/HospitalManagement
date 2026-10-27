"""Population health repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class PopulationRepository:
    def __init__(self) -> None:
        self._registries: dict[int, dict] = {}
        self._members: dict[int, dict] = {}
        self._measures: dict[int, dict] = {}
        self._outcomes: dict[int, dict] = {}
        self._counters = {"registry": 0, "member": 0, "measure": 0, "outcome": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_registry(self, data: dict) -> dict:
        rid = self._next("registry")
        record = {"id": rid, **data}
        self._registries[rid] = record
        return dict(record)

    def get_registry(self, registry_id: int) -> Optional[dict]:
        record = self._registries.get(registry_id)
        return dict(record) if record else None

    def list_registries(self) -> list[dict]:
        return [dict(r) for r in self._registries.values()]

    def enroll_member(self, data: dict) -> dict:
        mid = self._next("member")
        record = {"id": mid, **data, "status": data.get("status", "active")}
        self._members[mid] = record
        return dict(record)

    def list_members(self, registry_id: int | None = None) -> list[dict]:
        items = list(self._members.values())
        if registry_id is not None:
            items = [m for m in items if m.get("registry_id") == registry_id]
        return [dict(m) for m in items]

    def create_measure(self, data: dict) -> dict:
        mid = self._next("measure")
        record = {"id": mid, **data}
        self._measures[mid] = record
        return dict(record)

    def list_measures(self, registry_id: int | None = None) -> list[dict]:
        items = list(self._measures.values())
        if registry_id is not None:
            items = [m for m in items if m.get("registry_id") == registry_id]
        return [dict(m) for m in items]

    def record_outcome(self, data: dict) -> dict:
        oid = self._next("outcome")
        record = {"id": oid, **data}
        self._outcomes[oid] = record
        return dict(record)

    def list_outcomes(self, patient_id: int | None = None, registry_id: int | None = None) -> list[dict]:
        items = list(self._outcomes.values())
        if patient_id is not None:
            items = [o for o in items if o.get("patient_id") == patient_id]
        if registry_id is not None:
            items = [o for o in items if o.get("registry_id") == registry_id]
        return [dict(o) for o in items]

    def count_members(self, registry_id: int | None = None) -> int:
        items = list(self._members.values())
        if registry_id is not None:
            items = [m for m in items if m.get("registry_id") == registry_id]
        return len(items)

    def clear(self) -> None:
        self._registries.clear()
        self._members.clear()
        self._measures.clear()
        self._outcomes.clear()
        for k in self._counters:
            self._counters[k] = 0
