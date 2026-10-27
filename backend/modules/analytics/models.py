"""Analytics domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class MeasureType(str, Enum):
    HEDIS = "hedis"
    CORE = "core"
    CUSTOM = "custom"


class ReportFormat(str, Enum):
    CSV = "csv"
    PDF = "pdf"
    JSON = "json"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class Registry(Base):
        __tablename__ = "analytics_registries"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        condition_code: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class Outcome(Base):
        __tablename__ = "analytics_outcomes"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        measure: Mapped[str] = mapped_column(String(80), nullable=False)
        value: Mapped[float] = mapped_column(Float, nullable=False)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class QualityMeasure(Base):
        __tablename__ = "analytics_quality_measures"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        measure_type: Mapped[MeasureType] = mapped_column(SAEnum(MeasureType), default=MeasureType.CUSTOM)
        numerator: Mapped[int] = mapped_column(Integer, default=0)
        denominator: Mapped[int] = mapped_column(Integer, default=0)
        target: Mapped[float] = mapped_column(Float, default=0.0)
        period_start: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        period_end: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    class Report(Base):
        __tablename__ = "analytics_reports"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        report_type: Mapped[str] = mapped_column(String(80), nullable=False)
        format: Mapped[ReportFormat] = mapped_column(SAEnum(ReportFormat), default=ReportFormat.CSV)
        parameters: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        generated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class ReadmissionRisk(Base):
        __tablename__ = "analytics_readmission_risk"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        encounter_id: Mapped[Optional[int]] = mapped_column(ForeignKey("ehr_encounters.id"), nullable=True)
        score: Mapped[float] = mapped_column(Float, nullable=False)
        risk_level: Mapped[str] = mapped_column(String(20), nullable=False)
        factors: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        computed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    Registry = None  # type: ignore
    Outcome = None  # type: ignore
    QualityMeasure = None  # type: ignore
    Report = None  # type: ignore
    ReadmissionRisk = None  # type: ignore
