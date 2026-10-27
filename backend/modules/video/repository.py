"""Video repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class VideoRepository:
    def __init__(self) -> None:
        self._sessions: dict[int, dict] = {}
        self._signaling: dict[int, dict] = {}
        self._metrics: dict[int, dict] = {}
        self._counters = {"session": 0, "signaling": 0, "metric": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_session(self, data: dict) -> dict:
        sid = self._next("session")
        record = {"id": sid, **data, "status": data.get("status", "created"), "participant_count": 0}
        self._sessions[sid] = record
        return dict(record)

    def get_session(self, session_id: int) -> Optional[dict]:
        record = self._sessions.get(session_id)
        return dict(record) if record else None

    def get_session_by_room(self, room_id: str) -> Optional[dict]:
        for record in self._sessions.values():
            if record.get("room_id") == room_id:
                return dict(record)
        return None

    def update_session(self, session_id: int, data: dict) -> dict:
        record = self._sessions.get(session_id)
        if record is None:
            raise KeyError(f"Session {session_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._sessions[session_id] = record
        return dict(record)

    def list_sessions(self, params: PageParams, status: str | None = None) -> PageResult:
        items = list(self._sessions.values())
        if status is not None:
            items = [s for s in items if s.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_signaling(self, data: dict) -> dict:
        sid = self._next("signaling")
        record = {"id": sid, **data}
        self._signaling[sid] = record
        return dict(record)

    def list_signaling(self, session_id: int) -> list[dict]:
        return [dict(m) for m in self._signaling.values() if m.get("session_id") == session_id]

    def create_metric(self, data: dict) -> dict:
        mid = self._next("metric")
        record = {"id": mid, **data}
        self._metrics[mid] = record
        return dict(record)

    def list_metrics(self, session_id: int) -> list[dict]:
        return [dict(m) for m in self._metrics.values() if m.get("session_id") == session_id]

    def count_sessions(self) -> int:
        return len(self._sessions)

    def clear(self) -> None:
        self._sessions.clear()
        self._signaling.clear()
        self._metrics.clear()
        for k in self._counters:
            self._counters[k] = 0
