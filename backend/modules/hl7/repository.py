"""HL7 repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class HL7Repository:
    def __init__(self) -> None:
        self._messages: dict[int, dict] = {}
        self._counter: int = 0

    def store(self, data: dict) -> dict:
        self._counter += 1
        record = {"id": self._counter, **data, "status": data.get("status", "received")}
        self._messages[self._counter] = record
        return dict(record)

    def get(self, message_id: int) -> Optional[dict]:
        record = self._messages.get(message_id)
        return dict(record) if record else None

    def update(self, message_id: int, data: dict) -> dict:
        record = self._messages.get(message_id)
        if record is None:
            raise KeyError(f"HL7 message {message_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._messages[message_id] = record
        return dict(record)

    def list(self, params: PageParams, message_type: str | None = None, status: str | None = None) -> PageResult:
        items = list(self._messages.values())
        if message_type is not None:
            items = [m for m in items if m.get("message_type") == message_type]
        if status is not None:
            items = [m for m in items if m.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def count(self) -> int:
        return len(self._messages)

    def clear(self) -> None:
        self._messages.clear()
        self._counter = 0
