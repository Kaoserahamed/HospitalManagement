"""Quality Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class QualityMeasureBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    category: str = "custom"
    description: Optional[str] = None
    numerator: int = Field(0, ge=0)
    denominator: int = Field(0, ge=0)
    target: float = Field(0.0, ge=0, le=1)
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None


class QualityMeasureCreate(QualityMeasureBase):
    pass


class QualityMeasureRead(QualityMeasureBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class QualityResultBase(BaseModel):
    measure_id: int
    patient_id: int
    numerator_met: bool = False


class QualityResultCreate(QualityResultBase):
    pass


class QualityResultRead(QualityResultBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None


class BenchmarkBase(BaseModel):
    measure_id: int
    benchmark_value: float = Field(..., ge=0, le=1)
    source: Optional[str] = Field(None, max_length=120)
    effective_date: Optional[datetime] = None


class BenchmarkCreate(BenchmarkBase):
    pass


class BenchmarkRead(BenchmarkBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class QualitySummary(BaseModel):
    measure_id: int
    name: str
    rate: float
    target: float
    gap: float
    status: str
