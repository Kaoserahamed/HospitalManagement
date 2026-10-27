"""Backup repository."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class BackupRepository:
    def __init__(self) -> None:
        self._backups: dict[int, dict] = {}
        self._restores: dict[int, dict] = {}
        self._schedules: dict[int, dict] = {}
        self._counters = {"backup": 0, "restore": 0, "schedule": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_backup(self, data: dict) -> dict:
        bid = self._next("backup")
        record = {"id": bid, **data, "status": data.get("status", "pending")}
        self._backups[bid] = record
        return dict(record)

    def get_backup(self, backup_id: int) -> Optional[dict]:
        record = self._backups.get(backup_id)
        return dict(record) if record else None

    def update_backup(self, backup_id: int, data: dict) -> dict:
        record = self._backups.get(backup_id)
        if record is None:
            raise KeyError(f"Backup {backup_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._backups[backup_id] = record
        return dict(record)

    def list_backups(self, params: PageParams, backup_type: str | None = None, status: str | None = None) -> PageResult:
        items = list(self._backups.values())
        if backup_type is not None:
            items = [b for b in items if b.get("backup_type") == backup_type]
        if status is not None:
            items = [b for b in items if b.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_restore(self, data: dict) -> dict:
        rid = self._next("restore")
        record = {"id": rid, **data, "status": data.get("status", "pending")}
        self._restores[rid] = record
        return dict(record)

    def get_restore(self, restore_id: int) -> Optional[dict]:
        record = self._restores.get(restore_id)
        return dict(record) if record else None

    def update_restore(self, restore_id: int, data: dict) -> dict:
        record = self._restores.get(restore_id)
        if record is None:
            raise KeyError(f"Restore {restore_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._restores[restore_id] = record
        return dict(record)

    def create_schedule(self, data: dict) -> dict:
        sid = self._next("schedule")
        record = {"id": sid, **data, "is_active": data.get("is_active", True)}
        self._schedules[sid] = record
        return dict(record)

    def list_schedules(self, active_only: bool = False) -> list[dict]:
        items = list(self._schedules.values())
        if active_only:
            items = [s for s in items if s.get("is_active")]
        return [dict(s) for s in items]

    def clear(self) -> None:
        self._backups.clear()
        self._restores.clear()
        self._schedules.clear()
        for k in self._counters:
            self._counters[k] = 0
