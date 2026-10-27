"""Billing Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ChargeBase(BaseModel):
    patient_id: int
    encounter_id: Optional[int] = None
    code: str = Field(..., min_length=1, max_length=20)
    description: str = Field(..., min_length=1, max_length=240)
    quantity: int = Field(1, ge=1)
    unit_price: float = Field(..., ge=0)


class ChargeCreate(ChargeBase):
    pass


class ChargeRead(ChargeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    total: float = 0.0
    created_at: Optional[datetime] = None


class InvoiceBase(BaseModel):
    patient_id: int
    invoice_number: Optional[str] = None
    tax: float = Field(0.0, ge=0)
    due_date: Optional[datetime] = None


class InvoiceCreate(InvoiceBase):
    charge_ids: list[int] = []


class InvoiceUpdate(BaseModel):
    status: Optional[str] = None
    tax: Optional[float] = Field(None, ge=0)
    due_date: Optional[datetime] = None


class InvoiceRead(InvoiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    invoice_number: str
    status: str = "draft"
    subtotal: float = 0.0
    total: float = 0.0
    issued_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class InvoiceItemBase(BaseModel):
    invoice_id: int
    charge_id: Optional[int] = None
    description: str = Field(..., min_length=1, max_length=240)
    quantity: int = Field(1, ge=1)
    unit_price: float = Field(..., ge=0)


class InvoiceItemCreate(InvoiceItemBase):
    pass


class InvoiceItemRead(InvoiceItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    total: float = 0.0


class PaymentCreate(BaseModel):
    invoice_id: int
    amount: float = Field(..., ge=0)
    method: str = "cash"
    reference: Optional[str] = Field(None, max_length=120)


class PaymentRead(PaymentCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    paid_at: Optional[datetime] = None


class ClaimCreate(BaseModel):
    invoice_id: int
    payer: str = Field(..., min_length=1, max_length=120)
    claim_number: Optional[str] = Field(None, max_length=60)


class ClaimRead(ClaimCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "submitted"
    submitted_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    denial_reason: Optional[str] = None


class BillingSummary(BaseModel):
    total_invoiced: float = 0.0
    total_paid: float = 0.0
    total_outstanding: float = 0.0
    invoice_count: int = 0
