"""Reporting Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReportDefinitionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    query: str = Field(..., min_length=1)
    parameters: Optional[str] = None
    format: str = "csv"
    schedule: str = "once"
    is_active: bool = True


class ReportDefinitionCreate(ReportDefinitionBase):
    pass


class ReportDefinitionRead(ReportDefinitionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class ReportExecutionBase(BaseModel):
    definition_id: int
    status: str = "pending"
    row_count: int = 0
    file_path: Optional[str] = Field(None, max_length=500)
    error: Optional[str] = None


class ReportExecutionCreate(ReportExecutionBase):
    pass


class ReportExecutionRead(ReportExecutionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class ReportSubscriptionBase(BaseModel):
    definition_id: int
    user_id: int
    delivery_channel: str = "email"
    is_active: bool = True


class ReportSubscriptionCreate(ReportSubscriptionBase):
    pass


class ReportSubscriptionRead(ReportSubscriptionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ReportRunRequest(BaseModel):
    definition_id: int
    parameters: Optional[dict] = None
