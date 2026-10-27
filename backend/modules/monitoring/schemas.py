"""Monitoring Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DeviceBase(BaseModel):
    patient_id: int
    device_type: str = Field(..., min_length=1, max_length=60)
    serial_number: str = Field(..., min_length=1, max_length=120)


class DeviceCreate(DeviceBase):
    pass


class DeviceRead(DeviceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool = True
    registered_at: Optional[datetime] = None


class ReadingBase(BaseModel):
    patient_id: int
    device_id: Optional[int] = None
    vital_type: str
    value: float
    unit: Optional[str] = Field(None, max_length=20)


class ReadingCreate(ReadingBase):
    pass


class ReadingRead(ReadingBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None


class ThresholdBase(BaseModel):
    vital_type: str
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    severity: str = "warning"


class ThresholdCreate(ThresholdBase):
    pass


class ThresholdRead(ThresholdBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class AlertBase(BaseModel):
    patient_id: int
    vital_type: str
    value: float
    severity: str = "warning"
    message: str


class AlertCreate(AlertBase):
    pass


class AlertRead(AlertBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    acknowledged: bool = False
    created_at: Optional[datetime] = None
