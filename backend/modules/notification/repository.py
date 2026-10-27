"""Notification repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class NotificationRepository:
    def __init__(self) -> None:
        self._notifications: dict[int, dict] = {}
        self._templates: dict[int, dict] = {}
        self._counters = {"notification": 0, "template": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create(self, data: dict) -> dict:
        nid = self._next("notification")
        record = {"id": nid, **data, "status": data.get("status", "pending"), "is_read": False}
        self._notifications[nid] = record
        return dict(record)

    def get(self, notification_id: int) -> Optional[dict]:
        record = self._notifications.get(notification_id)
        return dict(record) if record else None

    def update(self, notification_id: int, data: dict) -> dict:
        record = self._notifications.get(notification_id)
        if record is None:
            raise KeyError(f"Notification {notification_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._notifications[notification_id] = record
        return dict(record)

    def list(self, params: PageParams, recipient_id: int | None = None, status: str | None = None, unread_only: bool = False) -> PageResult:
        items = list(self._notifications.values())
        if recipient_id is not None:
            items = [n for n in items if n.get("recipient_id") == recipient_id]
        if status is not None:
            items = [n for n in items if n.get("status") == status]
        if unread_only:
            items = [n for n in items if not n.get("is_read")]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def mark_read(self, notification_id: int) -> dict:
        from datetime import datetime
        return self.update(notification_id, {"is_read": True, "status": "read", "read_at": datetime.utcnow()})

    def mark_all_read(self, recipient_id: int) -> int:
        count = 0
        for nid, record in list(self._notifications.items()):
            if record.get("recipient_id") == recipient_id and not record.get("is_read"):
                self.update(nid, {"is_read": True, "status": "read"})
                count += 1
        return count

    def create_template(self, data: dict) -> dict:
        tid = self._next("template")
        record = {"id": tid, **data, "is_active": data.get("is_active", True)}
        self._templates[tid] = record
        return dict(record)

    def get_template(self, name: str) -> Optional[dict]:
        for record in self._templates.values():
            if record.get("name") == name:
                return dict(record)
        return None

    def list_templates(self) -> list[dict]:
        return [dict(t) for t in self._templates.values()]

    def count_unread(self, recipient_id: int) -> int:
        return sum(1 for n in self._notifications.values() if n.get("recipient_id") == recipient_id and not n.get("is_read"))

    def clear(self) -> None:
        self._notifications.clear()
        self._templates.clear()
        for k in self._counters:
            self._counters[k] = 0
