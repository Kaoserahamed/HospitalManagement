"""Scheduling domain models."""

from __future__ import annotations

from datetime import datetime, date, time
from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column


class ShiftSwapStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class OnCallType(str, Enum):
    PRIMARY = "primary"
    SECONDARY = "secondary"
    BACKUP = "backup"


class CoverageStatus(str, Enum):
    COVERED = "covered"
    GAP = "gap"
    OVERSTAFFED = "overstaffed"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class ShiftSwapRequest(Base):
        __tablename__ = "scheduling_shift_swaps"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        requester_id: Mapped[int] = mapped_column(ForeignKey("staff_profiles.id"), nullable=False, index=True)
        target_id: Mapped[int] = mapped_column(ForeignKey("staff_profiles.id"), nullable=False, index=True)
        requester_shift_id: Mapped[int] = mapped_column(ForeignKey("staff_shifts.id"), nullable=False)
        target_shift_id: Mapped[int] = mapped_column(ForeignKey("staff_shifts.id"), nullable=False)
        status: Mapped[ShiftSwapStatus] = mapped_column(SAEnum(ShiftSwapStatus), default=ShiftSwapStatus.PENDING)
        reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        reviewed_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    class OnCallSchedule(Base):
        __tablename__ = "scheduling_oncall"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False, index=True)
        staff_id: Mapped[int] = mapped_column(ForeignKey("staff_profiles.id"), nullable=False, index=True)
        on_call_type: Mapped[OnCallType] = mapped_column(SAEnum(OnCallType), default=OnCallType.PRIMARY)
        start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
        is_active: Mapped[bool] = mapped_column(Boolean, default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class CoverageAlert(Base):
        __tablename__ = "scheduling_coverage_alerts"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False, index=True)
        date: Mapped[date] = mapped_column(Date, nullable=False)
        shift_type: Mapped[str] = mapped_column(String(20), nullable=False)
        status: Mapped[CoverageStatus] = mapped_column(SAEnum(CoverageStatus), default=CoverageStatus.GAP)
        message: Mapped[str] = mapped_column(Text, nullable=False)
        acknowledged: Mapped[bool] = mapped_column(Boolean, default=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class ShiftTemplate(Base):
        __tablename__ = "scheduling_shift_templates"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False)
        shift_type: Mapped[str] = mapped_column(String(20), nullable=False)
        start_time: Mapped[time] = mapped_column(Time, nullable=False)
        end_time: Mapped[time] = mapped_column(Time, nullable=False)
        days_of_week: Mapped[str] = mapped_column(String(20), nullable=False)  # e.g. "1,2,3,4,5"
        is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    class StaffAvailability(Base):
        __tablename__ = "scheduling_availability"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        staff_id: Mapped[int] = mapped_column(ForeignKey("staff_profiles.id"), nullable=False, index=True)
        day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)
        start_time: Mapped[time] = mapped_column(Time, nullable=False)
        end_time: Mapped[time] = mapped_column(Time, nullable=False)
        is_available: Mapped[bool] = mapped_column(Boolean, default=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    ShiftSwapRequest = None  # type: ignore
    OnCallSchedule = None  # type: ignore
    CoverageAlert = None  # type: ignore
    ShiftTemplate = None  # type: ignore
    StaffAvailability = None  # type: ignore
