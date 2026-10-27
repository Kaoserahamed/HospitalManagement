"""Coding repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class CodingRepository:
    def __init__(self) -> None:
        self._codes: dict[int, dict] = {}
        self._mappings: dict[int, dict] = {}
        self._encounter_codes: dict[int, dict] = {}
        self._counters = {"code": 0, "mapping": 0, "encounter_code": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_code(self, data: dict) -> dict:
        cid = self._next("code")
        record = {"id": cid, **data}
        self._codes[cid] = record
        return dict(record)

    def get_code(self, system: str, code: str) -> Optional[dict]:
        for record in self._codes.values():
            if record.get("system") == system and record.get("code") == code:
                return dict(record)
        return None

    def search_codes(self, system: str | None, query: str, limit: int = 20) -> list[dict]:
        q = query.lower()
        items = list(self._codes.values())
        if system is not None:
            items = [c for c in items if c.get("system") == system]
        items = [c for c in items if q in c.get("code", "").lower() or q in c.get("description", "").lower()]
        return [dict(c) for c in items[:limit]]

    def create_mapping(self, data: dict) -> dict:
        mid = self._next("mapping")
        record = {"id": mid, **data}
        self._mappings[mid] = record
        return dict(record)

    def find_mappings(self, source_system: str, source_code: str, target_system: str | None = None) -> list[dict]:
        items = [m for m in self._mappings.values() if m.get("source_system") == source_system and m.get("source_code") == source_code]
        if target_system is not None:
            items = [m for m in items if m.get("target_system") == target_system]
        return [dict(m) for m in items]

    def add_encounter_code(self, data: dict) -> dict:
        eid = self._next("encounter_code")
        record = {"id": eid, **data}
        self._encounter_codes[eid] = record
        return dict(record)

    def list_encounter_codes(self, encounter_id: int) -> list[dict]:
        return [dict(c) for c in self._encounter_codes.values() if c.get("encounter_id") == encounter_id]

    def remove_encounter_code(self, code_id: int) -> bool:
        return self._encounter_codes.pop(code_id, None) is not None

    def count_codes(self) -> int:
        return len(self._codes)

    def clear(self) -> None:
        self._codes.clear()
        self._mappings.clear()
        self._encounter_codes.clear()
        for k in self._counters:
            self._counters[k] = 0
