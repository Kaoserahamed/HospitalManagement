"""Analytics Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RegistryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    condition_code: Optional[str] = Field(None, max_length=40)


class RegistryCreate(RegistryBase):
    pass


class RegistryRead(RegistryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class OutcomeBase(BaseModel):
    patient_id: int
    measure: str = Field(..., min_length=1, max_length=80)
    value: float


class OutcomeCreate(OutcomeBase):
    pass


class OutcomeRead(OutcomeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None


class QualityMeasureBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    measure_type: str = "custom"
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


class ReportBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    report_type: str = Field(..., min_length=1, max_length=80)
    format: str = "csv"
    parameters: Optional[str] = None


class ReportCreate(ReportBase):
    pass


class ReportRead(ReportBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    generated_at: Optional[datetime] = None
    file_path: Optional[str] = None
    created_at: Optional[datetime] = None


class ReadmissionRiskBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    score: float = Field(..., ge=0, le=1)
    risk_level: str = Field(..., pattern="^(low|medium|high)$")
    factors: Optional[str] = None


class ReadmissionRiskCreate(ReadmissionRiskBase):
    pass


class ReadmissionRiskRead(ReadmissionRiskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    computed_at: Optional[datetime] = None


class DashboardSummary(BaseModel):
    total_patients: int = 0
    total_appointments: int = 0
    total_encounters: int = 0
    occupancy_rate: float = 0.0
    revenue: float = 0.0
    quality_score: float = 0.0
