"""Staff domain models."""

from __future__ import annotations

from datetime import datetime, date, time
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column


class ShiftType(str, Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    NIGHT = "night"
    ON_CALL = "on_call"


class TimeOffStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class StaffProfile(Base):
        __tablename__ = "staff_profiles"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, unique=True)
        department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id"), nullable=True)
        title: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
        specialty: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        license_number: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
        phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
        is_active: Mapped[bool] = mapped_column(Boolean, default=True)
        hired_at: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "user_id": self.user_id,
                "department_id": self.department_id,
                "title": self.title,
                "specialty": self.specialty,
                "license_number": self.license_number,
                "phone": self.phone,
                "is_active": self.is_active,
                "hired_at": self.hired_at.isoformat() if self.hired_at else None,
            }

    class Shift(Base):
        __tablename__ = "staff_shifts"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        staff_id: Mapped[int] = mapped_column(ForeignKey("staff_profiles.id"), nullable=False, index=True)
        department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id"), nullable=True)
        shift_type: Mapped[ShiftType] = mapped_column(SAEnum(ShiftType), default=ShiftType.MORNING)
        start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    class TimeOffRequest(Base):
        __tablename__ = "staff_time_off"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        staff_id: Mapped[int] = mapped_column(ForeignKey("staff_profiles.id"), nullable=False, index=True)
        start_date: Mapped[date] = mapped_column(Date, nullable=False)
        end_date: Mapped[date] = mapped_column(Date, nullable=False)
        reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        status: Mapped[TimeOffStatus] = mapped_column(SAEnum(TimeOffStatus), default=TimeOffStatus.PENDING)
        reviewed_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class Roster(Base):
        __tablename__ = "staff_rosters"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False, index=True)
        date: Mapped[date] = mapped_column(Date, nullable=False)
        staff_id: Mapped[int] = mapped_column(ForeignKey("staff_profiles.id"), nullable=False)
        shift_type: Mapped[ShiftType] = mapped_column(SAEnum(ShiftType), default=ShiftType.MORNING)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    StaffProfile = None  # type: ignore
    Shift = None  # type: ignore
    TimeOffRequest = None  # type: ignore
    Roster = None  # type: ignore
