"""Lab Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class LabOrderBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    ordering_provider: int
    test_code: str = Field(..., min_length=1, max_length=40)
    test_name: str = Field(..., min_length=1, max_length=120)
    priority: str = "routine"
    notes: Optional[str] = None


class LabOrderCreate(LabOrderBase):
    pass


class LabOrderUpdate(BaseModel):
    status: Optional[str] = None
    collected_at: Optional[datetime] = None
    resulted_at: Optional[datetime] = None
    notes: Optional[str] = None


class LabOrderRead(LabOrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "ordered"
    ordered_at: Optional[datetime] = None
    collected_at: Optional[datetime] = None
    resulted_at: Optional[datetime] = None


class LabResultBase(BaseModel):
    order_id: int
    value: str = Field(..., min_length=1, max_length=120)
    unit: Optional[str] = Field(None, max_length=40)
    reference_range: Optional[str] = Field(None, max_length=80)
    abnormal: bool = False


class LabResultCreate(LabResultBase):
    pass


class LabResultRead(LabResultBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    resulted_at: Optional[datetime] = None


class LabPanelBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    tests: str


class LabPanelCreate(LabPanelBase):
    pass


class LabPanelRead(LabPanelBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
