"""Lab integration domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class LabOrderStatus(str, Enum):
    ORDERED = "ordered"
    COLLECTED = "collected"
    IN_PROGRESS = "in_progress"
    RESULTED = "resulted"
    CANCELLED = "cancelled"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class LabOrder(Base):
        __tablename__ = "lab_orders"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        encounter_id: Mapped[Optional[int]] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=True)
        ordering_provider: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
        test_code: Mapped[str] = mapped_column(String(40), nullable=False)
        test_name: Mapped[str] = mapped_column(String(120), nullable=False)
        status: Mapped[LabOrderStatus] = mapped_column(SAEnum(LabOrderStatus), default=LabOrderStatus.ORDERED)
        priority: Mapped[str] = mapped_column(String(20), default="routine")
        ordered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        collected_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        resulted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    class LabResult(Base):
        __tablename__ = "lab_results_ext"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        order_id: Mapped[int] = mapped_column(ForeignKey("lab_orders.id"), nullable=False, index=True)
        value: Mapped[str] = mapped_column(String(120), nullable=False)
        unit: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
        reference_range: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
        abnormal: Mapped[bool] = mapped_column(default=False)
        resulted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class LabPanel(Base):
        __tablename__ = "lab_panels"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        tests: Mapped[str] = mapped_column(Text, nullable=False)  # comma-separated codes

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    LabOrder = None  # type: ignore
    LabResult = None  # type: ignore
    LabPanel = None  # type: ignore
