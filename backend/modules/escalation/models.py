"""Escalation domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class EscalationLevel(str, Enum):
    LEVEL1 = "level1"
    LEVEL2 = "level2"
    LEVEL3 = "level3"


class EscalationStatus(str, Enum):
    OPEN = "open"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"
    ESCALATED = "escalated"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class EscalationPolicy(Base):
        __tablename__ = "escalation_policies"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        levels: Mapped[str] = mapped_column(Text, nullable=False)  # JSON list of levels
        is_active: Mapped[bool] = mapped_column(default=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class Escalation(Base):
        __tablename__ = "escalations"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        source_type: Mapped[str] = mapped_column(String(60), nullable=False)
        source_id: Mapped[int] = mapped_column(Integer, nullable=False)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        level: Mapped[EscalationLevel] = mapped_column(SAEnum(EscalationLevel), default=EscalationLevel.LEVEL1)
        status: Mapped[EscalationStatus] = mapped_column(SAEnum(EscalationStatus), default=EscalationStatus.OPEN)
        assigned_to: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    EscalationPolicy = None  # type: ignore
    Escalation = None  # type: ignore
