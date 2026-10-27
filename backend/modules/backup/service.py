"""Backup service."""

from __future__ import annotations

import hashlib
from datetime import datetime, timedelta
from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import BackupRepository
from .schemas import BackupCreate, BackupScheduleCreate, RestoreCreate


class BackupService:
    def __init__(self, repository: BackupRepository | None = None) -> None:
        self.repository = repository or BackupRepository()

    def create_backup(self, data: BackupCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_backup({**payload, "status": "pending"})
        default_bus.publish(DomainEvent(name="BackupCreated", payload={"backup_id": record["id"]}))
        return record

    def get_backup(self, backup_id: int) -> dict:
        record = self.repository.get_backup(backup_id)
        if record is None:
            raise NotFoundError("Backup", backup_id)
        return record

    def list_backups(self, params: PageParams, backup_type: str | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_backups(params, backup_type=backup_type, status=status)

    def run_backup(self, backup_id: int) -> dict:
        record = self.get_backup(backup_id)
        self.repository.update_backup(backup_id, {"status": "running", "started_at": datetime.utcnow()})
        # simulate backup
        size = 1024 * 1024
        checksum = hashlib.sha256(str(backup_id).encode()).hexdigest()
        file_path = f"/backups/backup_{backup_id}.sql.gz"
        record = self.repository.update_backup(backup_id, {"status": "completed", "file_path": file_path, "size_bytes": size, "checksum": checksum, "completed_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="BackupCompleted", payload={"backup_id": backup_id}))
        return record

    def fail_backup(self, backup_id: int, error: str) -> dict:
        record = self.repository.update_backup(backup_id, {"status": "failed", "error": error, "completed_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="BackupFailed", payload={"backup_id": backup_id, "error": error}))
        return record

    def delete_backup(self, backup_id: int) -> bool:
        if self.repository.get_backup(backup_id) is None:
            raise NotFoundError("Backup", backup_id)
        del self.repository._backups[backup_id]
        return True

    def create_restore(self, data: RestoreCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_backup(payload["backup_id"]) is None:
            raise NotFoundError("Backup", payload["backup_id"])
        record = self.repository.create_restore(payload)
        default_bus.publish(DomainEvent(name="RestoreCreated", payload={"restore_id": record["id"]}))
        return record

    def get_restore(self, restore_id: int) -> dict:
        record = self.repository.get_restore(restore_id)
        if record is None:
            raise NotFoundError("Restore", restore_id)
        return record

    def run_restore(self, restore_id: int) -> dict:
        record = self.get_restore(restore_id)
        self.repository.update_restore(restore_id, {"status": "running", "started_at": datetime.utcnow()})
        # simulate restore
        record = self.repository.update_restore(restore_id, {"status": "completed", "completed_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="RestoreCompleted", payload={"restore_id": restore_id}))
        return record

    def create_schedule(self, data: BackupScheduleCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        payload["next_run"] = datetime.utcnow() + timedelta(days=1)
        record = self.repository.create_schedule(payload)
        default_bus.publish(DomainEvent(name="BackupScheduleCreated", payload={"schedule_id": record["id"]}))
        return record

    def list_schedules(self, active_only: bool = False) -> list[dict]:
        return self.repository.list_schedules(active_only=active_only)

    def due_schedules(self) -> list[dict]:
        now = datetime.utcnow()
        schedules = self.repository.list_schedules(active_only=True)
        return [s for s in schedules if s.get("next_run") and s["next_run"] <= now]

    def latest_backup(self) -> dict | None:
        backups = self.repository.list_backups(PageParams(page=1, per_page=100))
        items = sorted(backups.items, key=lambda x: x.get("created_at", ""), reverse=True)
        return items[0] if items else None

    def backup_stats(self) -> dict:
        backups = self.repository.list_backups(PageParams(page=1, per_page=100))
        items = list(backups.items)
        return {
            "total": len(items),
            "completed": sum(1 for b in items if b.get("status") == "completed"),
            "failed": sum(1 for b in items if b.get("status") == "failed"),
            "total_size_bytes": sum(b.get("size_bytes", 0) or 0 for b in items),
        }

    def clear(self) -> None:
        self.repository.clear()
