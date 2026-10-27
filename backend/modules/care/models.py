"""Care coordination domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class CareTeamRole(str, Enum):
    PRIMARY = "primary"
    CONSULTING = "consulting"
    NURSING = "nursing"
    PHARMACY = "pharmacy"
    SOCIAL_WORK = "social_work"


class TaskStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    CANCELLED = "cancelled"


class HandoffStatus(str, Enum):
    PENDING = "pending"
    ACKNOWLEDGED = "acknowledged"
    COMPLETED = "completed"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class CareTeam(Base):
        __tablename__ = "care_teams"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class CareTeamMember(Base):
        __tablename__ = "care_team_members"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        care_team_id: Mapped[int] = mapped_column(ForeignKey("care_teams.id"), nullable=False, index=True)
        user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
        role: Mapped[CareTeamRole] = mapped_column(SAEnum(CareTeamRole), default=CareTeamRole.CONSULTING)
        joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class CareTask(Base):
        __tablename__ = "care_tasks"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        assigned_to: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        title: Mapped[str] = mapped_column(String(200), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        status: Mapped[TaskStatus] = mapped_column(SAEnum(TaskStatus), default=TaskStatus.OPEN)
        priority: Mapped[str] = mapped_column(String(20), default="normal")
        due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    class HandoffNote(Base):
        __tablename__ = "care_handoffs"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        from_user: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
        to_user: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
        summary: Mapped[str] = mapped_column(Text, nullable=False)
        status: Mapped[HandoffStatus] = mapped_column(SAEnum(HandoffStatus), default=HandoffStatus.PENDING)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        acknowledged_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    class DischargePlan(Base):
        __tablename__ = "care_discharge_plans"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        encounter_id: Mapped[Optional[int]] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=True)
        summary: Mapped[str] = mapped_column(Text, nullable=False)
        follow_up_appointments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        medications: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        home_care_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    CareTeam = None  # type: ignore
    CareTeamMember = None  # type: ignore
    CareTask = None  # type: ignore
    HandoffNote = None  # type: ignore
    DischargePlan = None  # type: ignore
