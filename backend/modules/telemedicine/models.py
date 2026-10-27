"""Telemedicine domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class VisitStatus(str, Enum):
    SCHEDULED = "scheduled"
    WAITING = "waiting"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class SessionQuality(str, Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class VirtualVisit(Base):
        __tablename__ = "telemedicine_visits"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        appointment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("appointments.id"), nullable=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.id"), nullable=False, index=True)
        status: Mapped[VisitStatus] = mapped_column(SAEnum(VisitStatus), default=VisitStatus.SCHEDULED)
        scheduled_start: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        scheduled_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        actual_start: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        actual_end: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        waiting_room_entered_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        session_quality: Mapped[Optional[SessionQuality]] = mapped_column(SAEnum(SessionQuality), nullable=True)
        recording_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "appointment_id": self.appointment_id,
                "patient_id": self.patient_id,
                "doctor_id": self.doctor_id,
                "status": self.status.value if isinstance(self.status, VisitStatus) else self.status,
                "scheduled_start": self.scheduled_start.isoformat() if self.scheduled_start else None,
                "scheduled_end": self.scheduled_end.isoformat() if self.scheduled_end else None,
                "actual_start": self.actual_start.isoformat() if self.actual_start else None,
                "actual_end": self.actual_end.isoformat() if self.actual_end else None,
                "session_quality": self.session_quality.value if isinstance(self.session_quality, SessionQuality) else self.session_quality,
                "recording_url": self.recording_url,
                "notes": self.notes,
            }

    class WaitingRoom(Base):
        __tablename__ = "telemedicine_waiting_room"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        visit_id: Mapped[int] = mapped_column(ForeignKey("telemedicine_visits.id"), nullable=False, index=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False)
        entered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        position: Mapped[int] = mapped_column(Integer, default=0)
        is_admitted: Mapped[bool] = mapped_column(Boolean, default=False)

    class SessionMetric(Base):
        __tablename__ = "telemedicine_session_metrics"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        visit_id: Mapped[int] = mapped_column(ForeignKey("telemedicine_visits.id"), nullable=False, index=True)
        metric_name: Mapped[str] = mapped_column(String(80), nullable=False)
        metric_value: Mapped[float] = mapped_column(default=0.0)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    VirtualVisit = None  # type: ignore
    WaitingRoom = None  # type: ignore
    SessionMetric = None  # type: ignore
