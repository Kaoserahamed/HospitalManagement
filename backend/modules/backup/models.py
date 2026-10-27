"""Backup and restore domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class BackupType(str, Enum):
    FULL = "full"
    INCREMENTAL = "incremental"
    DIFFERENTIAL = "differential"


class BackupStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Backup(Base):
        __tablename__ = "backup_jobs"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        backup_type: Mapped[BackupType] = mapped_column(SAEnum(BackupType), default=BackupType.FULL)
        status: Mapped[BackupStatus] = mapped_column(SAEnum(BackupStatus), default=BackupStatus.PENDING)
        file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        size_bytes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        checksum: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
        started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class RestoreJob(Base):
        __tablename__ = "restore_jobs"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        backup_id: Mapped[int] = mapped_column(Integer, nullable=False)
        status: Mapped[BackupStatus] = mapped_column(SAEnum(BackupStatus), default=BackupStatus.PENDING)
        target: Mapped[str] = mapped_column(String(120), nullable=False)
        started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class BackupSchedule(Base):
        __tablename__ = "backup_schedules"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        backup_type: Mapped[BackupType] = mapped_column(SAEnum(BackupType), default=BackupType.FULL)
        cron_expression: Mapped[str] = mapped_column(String(80), nullable=False)
        retention_days: Mapped[int] = mapped_column(Integer, default=30)
        is_active: Mapped[bool] = mapped_column(default=True)
        last_run: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        next_run: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Backup = None  # type: ignore
    RestoreJob = None  # type: ignore
    BackupSchedule = None  # type: ignore
