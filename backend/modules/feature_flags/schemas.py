"""Feature flags Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FeatureFlagBase(BaseModel):
    key: str = Field(..., min_length=1, max_length=80)
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    enabled: bool = False
    rollout_percentage: int = Field(0, ge=0, le=100)
    target_roles: Optional[str] = Field(None, max_length=240)


class FeatureFlagCreate(FeatureFlagBase):
    pass


class FeatureFlagUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=120)
    description: Optional[str] = None
    enabled: Optional[bool] = None
    rollout_percentage: Optional[int] = Field(None, ge=0, le=100)
    target_roles: Optional[str] = Field(None, max_length=240)


class FeatureFlagRead(FeatureFlagBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class OverrideBase(BaseModel):
    flag_id: int
    user_id: int
    enabled: bool


class OverrideCreate(OverrideBase):
    pass


class OverrideRead(OverrideBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class FlagEvaluation(BaseModel):
    key: str
    user_id: Optional[int] = None
    role: Optional[str] = None


class FlagEvaluationResult(BaseModel):
    key: str
    enabled: bool
    reason: str
