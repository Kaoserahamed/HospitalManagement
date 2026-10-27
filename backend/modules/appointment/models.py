"""Appointment domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class AppointmentType(str, Enum):
    CONSULTATION = "consultation"
    FOLLOW_UP = "follow_up"
    EMERGENCY = "emergency"
    TELEMEDICINE = "telemedicine"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Appointment(Base):
        __tablename__ = "appointments"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.id"), nullable=False, index=True)
        department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id"), nullable=True)
        start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
        end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        status: Mapped[AppointmentStatus] = mapped_column(SAEnum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)
        appointment_type: Mapped[AppointmentType] = mapped_column(SAEnum(AppointmentType), default=AppointmentType.CONSULTATION)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        @property
        def duration_minutes(self) -> int:
            delta = self.end_time - self.start_time
            return int(delta.total_seconds() // 60)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "patient_id": self.patient_id,
                "doctor_id": self.doctor_id,
                "department_id": self.department_id,
                "start_time": self.start_time.isoformat() if self.start_time else None,
                "end_time": self.end_time.isoformat() if self.end_time else None,
                "status": self.status.value if isinstance(self.status, AppointmentStatus) else self.status,
                "appointment_type": self.appointment_type.value if isinstance(self.appointment_type, AppointmentType) else self.appointment_type,
                "notes": self.notes,
                "duration_minutes": self.duration_minutes,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            }

    class ScheduleSlot(Base):
        __tablename__ = "schedule_slots"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.id"), nullable=False, index=True)
        start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        is_booked: Mapped[bool] = mapped_column(default=False)
        appointment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("appointments.id"), nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Appointment = None  # type: ignore
    ScheduleSlot = None  # type: ignore


def overlaps(a_start, a_end, b_start, b_end) -> bool:
    return a_start < b_end and b_start < a_end
