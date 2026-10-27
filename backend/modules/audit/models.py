"""Audit domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class AuditAction(str, Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    LOGIN = "login"
    LOGOUT = "logout"
    EXPORT = "export"


class AuditSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class AuditLog(Base):
        __tablename__ = "audit_logs"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        actor_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
        action: Mapped[AuditAction] = mapped_column(SAEnum(AuditAction), nullable=False)
        resource_type: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
        resource_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        severity: Mapped[AuditSeverity] = mapped_column(SAEnum(AuditSeverity), default=AuditSeverity.INFO)
        ip_address: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
        user_agent: Mapped[Optional[str]] = mapped_column(String(240), nullable=True)
        metadata_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        occurred_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "actor_id": self.actor_id,
                "action": self.action.value if isinstance(self.action, AuditAction) else self.action,
                "resource_type": self.resource_type,
                "resource_id": self.resource_id,
                "severity": self.severity.value if isinstance(self.severity, AuditSeverity) else self.severity,
                "ip_address": self.ip_address,
                "occurred_at": self.occurred_at.isoformat() if self.occurred_at else None,
            }

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    AuditLog = None  # type: ignore
