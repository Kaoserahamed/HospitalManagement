"""Audit service."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from backend.shared.errors import NotFoundError
from backend.shared.pagination import PageParams, PageResult

from .repository import AuditRepository
from .schemas import AuditLogCreate, AuditQuery


class AuditService:
    def __init__(self, repository: AuditRepository | None = None) -> None:
        self.repository = repository or AuditRepository()

    def record(self, data: AuditLogCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        payload.setdefault("occurred_at", datetime.utcnow())
        return self.repository.record(payload)

    def list(self, query: AuditQuery | dict) -> PageResult:
        payload = query.model_dump() if hasattr(query, "model_dump") else dict(query)
        params = PageParams(page=payload.get("page", 1), per_page=payload.get("per_page", 50))
        return self.repository.list(
            params,
            actor_id=payload.get("actor_id"),
            action=payload.get("action"),
            resource_type=payload.get("resource_type"),
            resource_id=payload.get("resource_id"),
            severity=payload.get("severity"),
            from_date=payload.get("from_date"),
            to_date=payload.get("to_date"),
        )

    def log_create(self, actor_id: int | None, resource_type: str, resource_id: int | None, metadata: str | None = None) -> dict:
        return self.record({"actor_id": actor_id, "action": "create", "resource_type": resource_type, "resource_id": resource_id, "metadata_json": metadata})

    def log_read(self, actor_id: int | None, resource_type: str, resource_id: int | None) -> dict:
        return self.record({"actor_id": actor_id, "action": "read", "resource_type": resource_type, "resource_id": resource_id})

    def log_update(self, actor_id: int | None, resource_type: str, resource_id: int | None, metadata: str | None = None) -> dict:
        return self.record({"actor_id": actor_id, "action": "update", "resource_type": resource_type, "resource_id": resource_id, "metadata_json": metadata})

    def log_delete(self, actor_id: int | None, resource_type: str, resource_id: int | None) -> dict:
        return self.record({"actor_id": actor_id, "action": "delete", "resource_type": resource_type, "resource_id": resource_id, "severity": "warning"})

    def log_login(self, actor_id: int | None, ip_address: str | None = None, user_agent: str | None = None) -> dict:
        return self.record({"actor_id": actor_id, "action": "login", "resource_type": "session", "ip_address": ip_address, "user_agent": user_agent})

    def log_logout(self, actor_id: int | None) -> dict:
        return self.record({"actor_id": actor_id, "action": "logout", "resource_type": "session"})

    def log_export(self, actor_id: int | None, resource_type: str, metadata: str | None = None) -> dict:
        return self.record({"actor_id": actor_id, "action": "export", "resource_type": resource_type, "metadata_json": metadata, "severity": "warning"})

    def count(self) -> int:
        return self.repository.count()

    def recent(self, limit: int = 20) -> list[dict]:
        query = AuditQuery(page=1, per_page=limit)
        return list(self.list(query).items)
