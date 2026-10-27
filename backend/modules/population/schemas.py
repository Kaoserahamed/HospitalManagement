"""Population health Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RegistryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    registry_type: str = "disease"
    condition_code: Optional[str] = Field(None, max_length=40)
    description: Optional[str] = None


class RegistryCreate(RegistryBase):
    pass


class RegistryRead(RegistryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class RegistryMemberBase(BaseModel):
    registry_id: int
    patient_id: int
    status: str = "active"


class RegistryMemberCreate(RegistryMemberBase):
    pass


class RegistryMemberRead(RegistryMemberBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    enrolled_at: Optional[datetime] = None


class PopulationMeasureBase(BaseModel):
    registry_id: int
    name: str = Field(..., min_length=1, max_length=120)
    numerator: int = Field(0, ge=0)
    denominator: int = Field(0, ge=0)
    period: str = "quarterly"
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None


class PopulationMeasureCreate(PopulationMeasureBase):
    pass


class PopulationMeasureRead(PopulationMeasureBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class OutcomeBase(BaseModel):
    patient_id: int
    registry_id: Optional[int] = None
    outcome: str = Field(..., min_length=1, max_length=120)
    value: float


class OutcomeCreate(OutcomeBase):
    pass


class OutcomeRead(OutcomeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None


class PopulationSummary(BaseModel):
    total_registries: int = 0
    total_members: int = 0
    average_measure_rate: float = 0.0
