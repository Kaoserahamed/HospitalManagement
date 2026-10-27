"""Multidisciplinary team meeting models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class MeetingStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class MDTMeeting(Base):
        __tablename__ = "mdt_meetings"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        title: Mapped[str] = mapped_column(String(200), nullable=False)
        scheduled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
        status: Mapped[MeetingStatus] = mapped_column(SAEnum(MeetingStatus), default=MeetingStatus.SCHEDULED)
        location: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class MDTAttendee(Base):
        __tablename__ = "mdt_attendees"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        meeting_id: Mapped[int] = mapped_column(ForeignKey("mdt_meetings.id"), nullable=False, index=True)
        user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
        role: Mapped[str] = mapped_column(String(80), nullable=False)
        attended: Mapped[bool] = mapped_column(default=False)

    class MDTDecision(Base):
        __tablename__ = "mdt_decisions"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        meeting_id: Mapped[int] = mapped_column(ForeignKey("mdt_meetings.id"), nullable=False, index=True)
        decision: Mapped[str] = mapped_column(Text, nullable=False)
        owner_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        status: Mapped[str] = mapped_column(String(20), default="open")
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    MDTMeeting = None  # type: ignore
    MDTAttendee = None  # type: ignore
    MDTDecision = None  # type: ignore
