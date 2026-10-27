"""Pharmacy Pydantic schemas."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class MedicationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    generic_name: Optional[str] = Field(None, max_length=120)
    form: str = "tablet"
    strength: Optional[str] = Field(None, max_length=60)
    manufacturer: Optional[str] = Field(None, max_length=120)
    requires_prescription: bool = True


class MedicationCreate(MedicationBase):
    pass


class MedicationRead(MedicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class StockBase(BaseModel):
    medication_id: int
    quantity: int = Field(0, ge=0)
    reorder_point: int = Field(10, ge=0)
    location: Optional[str] = Field(None, max_length=80)


class StockCreate(StockBase):
    pass


class StockRead(StockBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    updated_at: Optional[datetime] = None


class LotBase(BaseModel):
    medication_id: int
    lot_number: str = Field(..., min_length=1, max_length=60)
    quantity: int = Field(0, ge=0)
    expiry_date: date


class LotCreate(LotBase):
    pass


class LotRead(LotBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    received_at: Optional[datetime] = None


class SupplierBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    contact: Optional[str] = Field(None, max_length=120)
    email: Optional[str] = Field(None, max_length=120)
    phone: Optional[str] = Field(None, max_length=40)


class SupplierCreate(SupplierBase):
    pass


class SupplierRead(SupplierBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class DispenseCreate(BaseModel):
    prescription_id: int
    medication_id: int
    quantity: int = Field(..., ge=1)
    dispensed_by: Optional[int] = None
    notes: Optional[str] = None


class DispenseRead(DispenseCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    dispensed_at: Optional[datetime] = None


class InteractionCheck(BaseModel):
    medication_a: str
    medication_b: str


class InteractionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    medication_a: str
    medication_b: str
    severity: str
    description: str
