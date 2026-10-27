"""PathologyReport domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column


class PathologyReportStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PathologyReportPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class PathologyReport(Base):
        __tablename__ = "pathology"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int | None] = mapped_column(
            ForeignKey("patients.id"), nullable=True, index=True
        )
        title: Mapped[str] = mapped_column(String(200), nullable=False)
        description: Mapped[str | None] = mapped_column(Text, nullable=True)
        status: Mapped[PathologyReportStatus] = mapped_column(
            SAEnum(PathologyReportStatus), default=PathologyReportStatus.DRAFT
        )
        priority: Mapped[PathologyReportPriority] = mapped_column(
            SAEnum(PathologyReportPriority), default=PathologyReportPriority.NORMAL
        )
        category: Mapped[str | None] = mapped_column(String(80), nullable=True)
        owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
        due_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
        notes: Mapped[str | None] = mapped_column(Text, nullable=True)
        is_active: Mapped[bool] = mapped_column(Boolean, default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        updated_at: Mapped[datetime] = mapped_column(
            DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
        )

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "patient_id": self.patient_id,
                "title": self.title,
                "description": self.description,
                "status": self.status.value
                if isinstance(self.status, PathologyReportStatus)
                else self.status,
                "priority": self.priority.value
                if isinstance(self.priority, PathologyReportPriority)
                else self.priority,
                "category": self.category,
                "owner_id": self.owner_id,
                "due_date": self.due_date.isoformat() if self.due_date else None,
                "notes": self.notes,
                "is_active": self.is_active,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            }

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    PathologyReport = None  # type: ignore


def pathology_created_payload(record) -> dict:
    return {
        "id": getattr(record, "id", None),
        "title": getattr(record, "title", None),
        "status": getattr(record, "status", None),
    }
