"""Feature flags repository."""

from __future__ import annotations

import hashlib
from typing import Optional


class FeatureFlagRepository:
    def __init__(self) -> None:
        self._flags: dict[int, dict] = {}
        self._overrides: dict[int, dict] = {}
        self._counters = {"flag": 0, "override": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create(self, data: dict) -> dict:
        fid = self._next("flag")
        record = {"id": fid, **data}
        self._flags[fid] = record
        return dict(record)

    def get(self, flag_id: int) -> Optional[dict]:
        record = self._flags.get(flag_id)
        return dict(record) if record else None

    def get_by_key(self, key: str) -> Optional[dict]:
        for record in self._flags.values():
            if record.get("key") == key:
                return dict(record)
        return None

    def update(self, flag_id: int, data: dict) -> dict:
        record = self._flags.get(flag_id)
        if record is None:
            raise KeyError(f"Flag {flag_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._flags[flag_id] = record
        return dict(record)

    def list(self) -> list[dict]:
        return [dict(f) for f in self._flags.values()]

    def delete(self, flag_id: int) -> bool:
        return self._flags.pop(flag_id, None) is not None

    def create_override(self, data: dict) -> dict:
        oid = self._next("override")
        record = {"id": oid, **data}
        self._overrides[oid] = record
        return dict(record)

    def get_override(self, flag_id: int, user_id: int) -> Optional[dict]:
        for record in self._overrides.values():
            if record.get("flag_id") == flag_id and record.get("user_id") == user_id:
                return dict(record)
        return None

    def list_overrides(self, flag_id: int | None = None) -> list[dict]:
        items = list(self._overrides.values())
        if flag_id is not None:
            items = [o for o in items if o.get("flag_id") == flag_id]
        return [dict(o) for o in items]

    def clear(self) -> None:
        self._flags.clear()
        self._overrides.clear()
        for k in self._counters:
            self._counters[k] = 0

    @staticmethod
    def hash_user(user_id: int, key: str) -> int:
        h = hashlib.md5(f"{user_id}:{key}".encode()).hexdigest()
        return int(h, 16) % 100
