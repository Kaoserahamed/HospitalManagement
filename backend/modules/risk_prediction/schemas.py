"""Risk prediction Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RiskModelBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    version: str = Field(..., min_length=1, max_length=20)
    description: Optional[str] = None
    features: str
    is_active: bool = True


class RiskModelCreate(RiskModelBase):
    pass


class RiskModelRead(RiskModelBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class RiskPredictionBase(BaseModel):
    model_id: int
    patient_id: int
    encounter_id: Optional[int] = None
    score: float = Field(..., ge=0, le=1)
    risk_level: str
    factors: Optional[str] = None


class RiskPredictionCreate(RiskPredictionBase):
    pass


class RiskPredictionRead(RiskPredictionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    predicted_at: Optional[datetime] = None


class RiskFactorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    weight: float
    category: Optional[str] = Field(None, max_length=60)
    description: Optional[str] = None


class RiskFactorCreate(RiskFactorBase):
    pass


class RiskFactorRead(RiskFactorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class RiskEvaluationRequest(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    features: dict = {}


class RiskEvaluationResult(BaseModel):
    patient_id: int
    score: float
    risk_level: str
    factors: dict
    model_version: str
