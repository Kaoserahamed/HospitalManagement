"""Patient portal repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class PatientPortalRepository:
    def __init__(self) -> None:
        self._messages: dict[int, dict] = {}
        self._downloads: dict[int, dict] = {}
        self._reminders: dict[int, dict] = {}
        self._counters = {"message": 0, "download": 0, "reminder": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_message(self, data: dict) -> dict:
        mid = self._next("message")
        record = {"id": mid, **data, "status": data.get("status", "sent"), "is_read": False}
        self._messages[mid] = record
        return dict(record)

    def get_message(self, message_id: int) -> Optional[dict]:
        record = self._messages.get(message_id)
        return dict(record) if record else None

    def update_message(self, message_id: int, data: dict) -> dict:
        record = self._messages.get(message_id)
        if record is None:
            raise KeyError(f"Message {message_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._messages[message_id] = record
        return dict(record)

    def list_messages(self, params: PageParams, recipient_id: int | None = None, sender_id: int | None = None, unread_only: bool = False) -> PageResult:
        items = list(self._messages.values())
        if recipient_id is not None:
            items = [m for m in items if m.get("recipient_id") == recipient_id]
        if sender_id is not None:
            items = [m for m in items if m.get("sender_id") == sender_id]
        if unread_only:
            items = [m for m in items if not m.get("is_read")]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def mark_read(self, message_id: int) -> dict:
        from datetime import datetime
        return self.update_message(message_id, {"is_read": True, "status": "read", "read_at": datetime.utcnow()})

    def unread_count(self, recipient_id: int) -> int:
        return sum(1 for m in self._messages.values() if m.get("recipient_id") == recipient_id and not m.get("is_read"))

    def conversations(self, user_id: int) -> list[dict]:
        partners = set()
        for m in self._messages.values():
            if m.get("sender_id") == user_id:
                partners.add(m.get("recipient_id"))
            if m.get("recipient_id") == user_id:
                partners.add(m.get("sender_id"))
        result = []
        for pid in partners:
            msgs = [m for m in self._messages.values() if (m.get("sender_id") == pid and m.get("recipient_id") == user_id) or (m.get("sender_id") == user_id and m.get("recipient_id") == pid)]
            msgs.sort(key=lambda x: x.get("created_at") or "", reverse=True)
            unread = sum(1 for m in msgs if m.get("recipient_id") == user_id and not m.get("is_read"))
            result.append({"participant_id": pid, "last_message": msgs[0].get("body") if msgs else None, "unread_count": unread, "last_activity": msgs[0].get("created_at") if msgs else None})
        return result

    def create_download(self, data: dict) -> dict:
        did = self._next("download")
        record = {"id": did, **data}
        self._downloads[did] = record
        return dict(record)

    def list_downloads(self, patient_id: int | None = None) -> list[dict]:
        items = list(self._downloads.values())
        if patient_id is not None:
            items = [d for d in items if d.get("patient_id") == patient_id]
        return [dict(d) for d in items]

    def create_reminder(self, data: dict) -> dict:
        rid = self._next("reminder")
        record = {"id": rid, **data, "status": data.get("status", "pending")}
        self._reminders[rid] = record
        return dict(record)

    def get_reminder(self, reminder_id: int) -> Optional[dict]:
        record = self._reminders.get(reminder_id)
        return dict(record) if record else None

    def update_reminder(self, reminder_id: int, data: dict) -> dict:
        record = self._reminders.get(reminder_id)
        if record is None:
            raise KeyError(f"Reminder {reminder_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._reminders[reminder_id] = record
        return dict(record)

    def list_reminders(self, patient_id: int | None = None, status: str | None = None) -> list[dict]:
        items = list(self._reminders.values())
        if patient_id is not None:
            items = [r for r in items if r.get("patient_id") == patient_id]
        if status is not None:
            items = [r for r in items if r.get("status") == status]
        return [dict(r) for r in items]

    def pending_reminders(self, patient_id: int | None = None) -> list[dict]:
        return self.list_reminders(patient_id=patient_id, status="pending")

    def acknowledge_reminder(self, reminder_id: int) -> dict:
        from datetime import datetime
        return self.update_reminder(reminder_id, {"status": "acknowledged", "acknowledged_at": datetime.utcnow()})

    def clear(self) -> None:
        self._messages.clear()
        self._downloads.clear()
        self._reminders.clear()
        for k in self._counters:
            self._counters[k] = 0
