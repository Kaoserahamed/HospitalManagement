"""Task queue domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class TaskStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TaskPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Task(Base):
        __tablename__ = "task_queue"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        payload: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        status: Mapped[TaskStatus] = mapped_column(SAEnum(TaskStatus), default=TaskStatus.QUEUED)
        priority: Mapped[TaskPriority] = mapped_column(SAEnum(TaskPriority), default=TaskPriority.NORMAL)
        attempts: Mapped[int] = mapped_column(Integer, default=0)
        max_attempts: Mapped[int] = mapped_column(Integer, default=3)
        error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "name": self.name,
                "status": self.status.value if isinstance(self.status, TaskStatus) else self.status,
                "priority": self.priority.value if isinstance(self.priority, TaskPriority) else self.priority,
                "attempts": self.attempts,
                "max_attempts": self.max_attempts,
                "error": self.error,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "started_at": self.started_at.isoformat() if self.started_at else None,
                "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            }

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Task = None  # type: ignore
