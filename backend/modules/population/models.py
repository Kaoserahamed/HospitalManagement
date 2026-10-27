"""Population health domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class RegistryType(str, Enum):
    DISEASE = "disease"
    OUTCOME = "outcome"
    RISK = "risk"


class MeasurePeriod(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUALLY = "annually"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class PopulationRegistry(Base):
        __tablename__ = "population_registries"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        registry_type: Mapped[RegistryType] = mapped_column(SAEnum(RegistryType), default=RegistryType.DISEASE)
        condition_code: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class RegistryMember(Base):
        __tablename__ = "population_registry_members"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        registry_id: Mapped[int] = mapped_column(ForeignKey("population_registries.id"), nullable=False, index=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        enrolled_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
        status: Mapped[str] = mapped_column(String(20), default="active")

    class PopulationMeasure(Base):
        __tablename__ = "population_measures"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        registry_id: Mapped[int] = mapped_column(ForeignKey("population_registries.id"), nullable=False, index=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        numerator: Mapped[int] = mapped_column(Integer, default=0)
        denominator: Mapped[int] = mapped_column(Integer, default=0)
        period: Mapped[MeasurePeriod] = mapped_column(SAEnum(MeasurePeriod), default=MeasurePeriod.QUARTERLY)
        period_start: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        period_end: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    class OutcomeTracker(Base):
        __tablename__ = "population_outcomes"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        registry_id: Mapped[Optional[int]] = mapped_column(ForeignKey("population_registries.id"), nullable=True)
        outcome: Mapped[str] = mapped_column(String(120), nullable=False)
        value: Mapped[float] = mapped_column(Float, nullable=False)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    PopulationRegistry = None  # type: ignore
    RegistryMember = None  # type: ignore
    PopulationMeasure = None  # type: ignore
    OutcomeTracker = None  # type: ignore
