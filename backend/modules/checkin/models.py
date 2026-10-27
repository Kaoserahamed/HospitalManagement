"""Check-in and queue management models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class CheckInStatus(str, Enum):
    CHECKED_IN = "checked_in"
    WAITING = "waiting"
    CALLED = "called"
    IN_SERVICE = "in_service"
    COMPLETED = "completed"
    NO_SHOW = "no_show"


class QueuePriority(str, Enum):
    NORMAL = "normal"
    URGENT = "urgent"
    EMERGENCY = "emergency"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class CheckIn(Base):
        __tablename__ = "checkins"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        appointment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("appointments.id"), nullable=True)
        department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id"), nullable=True)
        status: Mapped[CheckInStatus] = mapped_column(SAEnum(CheckInStatus), default=CheckInStatus.CHECKED_IN)
        priority: Mapped[QueuePriority] = mapped_column(SAEnum(QueuePriority), default=QueuePriority.NORMAL)
        checked_in_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        called_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        estimated_wait_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    class QueueEntry(Base):
        __tablename__ = "queue_entries"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        checkin_id: Mapped[int] = mapped_column(ForeignKey("checkins.id"), nullable=False, index=True)
        department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id"), nullable=True)
        position: Mapped[int] = mapped_column(Integer, nullable=False)
        priority: Mapped[QueuePriority] = mapped_column(SAEnum(QueuePriority), default=QueuePriority.NORMAL)
        estimated_wait: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class KioskSession(Base):
        __tablename__ = "kiosk_sessions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[Optional[int]] = mapped_column(ForeignKey("patients.id"), nullable=True)
        started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        actions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    CheckIn = None  # type: ignore
    QueueEntry = None  # type: ignore
    KioskSession = None  # type: ignore
