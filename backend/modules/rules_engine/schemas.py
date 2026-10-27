"""Rules engine Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RuleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    rule_type: str
    condition: str
    action: str
    priority: int = 0
    status: str = "draft"
    version: str = "1.0"


class RuleCreate(RuleBase):
    pass


class RuleRead(RuleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class RuleExecutionBase(BaseModel):
    rule_id: int
    input_data: str
    output_data: Optional[str] = None
    result: str
    error: Optional[str] = None


class RuleExecutionCreate(RuleExecutionBase):
    pass


class RuleExecutionRead(RuleExecutionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    executed_at: Optional[datetime] = None


class RuleSetBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    rule_ids: str
    is_active: bool = True


class RuleSetCreate(RuleSetBase):
    pass


class RuleSetRead(RuleSetBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class RuleEvaluationRequest(BaseModel):
    rule_id: int
    input_data: dict


class RuleEvaluationResult(BaseModel):
    rule_id: int
    result: str
    output_data: Optional[dict] = None
    error: Optional[str] = None
