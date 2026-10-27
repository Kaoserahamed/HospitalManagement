"""Security repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class SecurityRepository:
    def __init__(self) -> None:
        self._mfa: dict[int, dict] = {}
        self._sso: dict[int, dict] = {}
        self._events: dict[int, dict] = {}
        self._keys: dict[int, dict] = {}
        self._counters = {"mfa": 0, "sso": 0, "event": 0, "key": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_mfa(self, data: dict) -> dict:
        mid = self._next("mfa")
        record = {"id": mid, **data, "status": data.get("status", "disabled")}
        self._mfa[mid] = record
        return dict(record)

    def get_mfa(self, user_id: int) -> Optional[dict]:
        for record in self._mfa.values():
            if record.get("user_id") == user_id:
                return dict(record)
        return None

    def update_mfa(self, user_id: int, data: dict) -> dict:
        for mid, record in list(self._mfa.items()):
            if record.get("user_id") == user_id:
                record.update({k: v for k, v in data.items() if v is not None})
                self._mfa[mid] = record
                return dict(record)
        raise KeyError(f"MFA config for user {user_id} not found")

    def create_sso_link(self, data: dict) -> dict:
        sid = self._next("sso")
        record = {"id": sid, **data}
        self._sso[sid] = record
        return dict(record)

    def get_sso_link(self, user_id: int, provider: str) -> Optional[dict]:
        for record in self._sso.values():
            if record.get("user_id") == user_id and record.get("provider") == provider:
                return dict(record)
        return None

    def list_sso_links(self, user_id: int) -> list[dict]:
        return [dict(s) for s in self._sso.values() if s.get("user_id") == user_id]

    def record_event(self, data: dict) -> dict:
        eid = self._next("event")
        record = {"id": eid, **data}
        self._events[eid] = record
        return dict(record)

    def list_events(self, params: PageParams, user_id: int | None = None, event_type: str | None = None, severity: str | None = None) -> PageResult:
        items = list(self._events.values())
        if user_id is not None:
            items = [e for e in items if e.get("user_id") == user_id]
        if event_type is not None:
            items = [e for e in items if e.get("event_type") == event_type]
        if severity is not None:
            items = [e for e in items if e.get("severity") == severity]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_key(self, data: dict) -> dict:
        kid = self._next("key")
        record = {"id": kid, **data, "is_active": data.get("is_active", True)}
        self._keys[kid] = record
        return dict(record)

    def get_active_key(self, purpose: str) -> Optional[dict]:
        for record in self._keys.values():
            if record.get("purpose") == purpose and record.get("is_active"):
                return dict(record)
        return None

    def rotate_key(self, key_id: str) -> dict:
        for kid, record in list(self._keys.items()):
            if record.get("key_id") == key_id:
                record["is_active"] = False
                record["rotated_at"] = datetime.utcnow() if False else None
                self._keys[kid] = record
                return dict(record)
        raise KeyError(f"Key {key_id} not found")

    def clear(self) -> None:
        self._mfa.clear()
        self._sso.clear()
        self._events.clear()
        self._keys.clear()
        for k in self._counters:
            self._counters[k] = 0
