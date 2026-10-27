"""Department Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    location: Optional[str] = Field(None, max_length=120)
    head_doctor_id: Optional[int] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=120)
    description: Optional[str] = None
    location: Optional[str] = Field(None, max_length=120)
    head_doctor_id: Optional[int] = None
    is_active: Optional[bool] = None


class DepartmentRead(DepartmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class RoomBase(BaseModel):
    department_id: int
    name: str = Field(..., min_length=1, max_length=80)
    capacity: int = Field(1, ge=1)
    equipment: Optional[str] = None


class RoomCreate(RoomBase):
    pass


class RoomRead(RoomBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_available: bool = True


class EquipmentBase(BaseModel):
    department_id: int
    name: str = Field(..., min_length=1, max_length=120)
    quantity: int = Field(1, ge=0)
    status: str = "available"


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentRead(EquipmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
