"""Quality metrics domain models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class MeasureCategory(str, Enum):
    HEDIS = "hedis"
    CORE = "core"
    CUSTOM = "custom"
    PATIENT_SAFETY = "patient_safety"


try:
    from sqlalchemy.orm import DeclarativeBase

    class Base(DeclarativeBase):
        pass

    class QualityMeasure(Base):
        __tablename__ = "quality_measures"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        name: Mapped[str] = mapped_column(String(120), nullable=False)
        category: Mapped[MeasureCategory] = mapped_column(SAEnum(MeasureCategory), default=MeasureCategory.CUSTOM)
        description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
        numerator: Mapped[int] = mapped_column(Integer, default=0)
        denominator: Mapped[int] = mapped_column(Integer, default=0)
        target: Mapped[float] = mapped_column(Float, default=0.0)
        period_start: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        period_end: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
        created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class QualityResult(Base):
        __tablename__ = "quality_results"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        measure_id: Mapped[int] = mapped_column(ForeignKey("quality_measures.id"), nullable=False, index=True)
        patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False, index=True)
        numerator_met: Mapped[bool] = mapped_column(default=False)
        recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class Benchmark(Base):
        __tablename__ = "quality_benchmarks"

        id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
        measure_id: Mapped[int] = mapped_column(ForeignKey("quality_measures.id"), nullable=False, index=True)
        benchmark_value: Mapped[float] = mapped_column(Float, nullable=False)
        source: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
        effective_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

except Exception:  # pragma: no cover
    Base = object  # type: ignore
    QualityMeasure = None  # type: ignore
    QualityResult = None  # type: ignore
    Benchmark = None  # type: ignore
