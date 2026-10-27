"""Insurance Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class InsurancePlanBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    payer_type: str = "private"
    coverage_details: Optional[str] = None


class InsurancePlanCreate(InsurancePlanBase):
    pass


class InsurancePlanRead(InsurancePlanBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class PatientInsuranceBase(BaseModel):
    patient_id: int
    plan_id: int
    policy_number: str = Field(..., min_length=1, max_length=120)
    group_number: Optional[str] = Field(None, max_length=120)
    effective_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None


class PatientInsuranceCreate(PatientInsuranceBase):
    pass


class PatientInsuranceRead(PatientInsuranceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ClaimBase(BaseModel):
    invoice_id: int
    plan_id: int
    claim_number: Optional[str] = Field(None, max_length=60)
    amount_claimed: float = Field(..., ge=0)


class ClaimCreate(ClaimBase):
    pass


class ClaimUpdate(BaseModel):
    status: Optional[str] = None
    amount_approved: Optional[float] = Field(None, ge=0)
    denial_reason: Optional[str] = None


class ClaimRead(ClaimBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "submitted"
    amount_approved: Optional[float] = None
    submitted_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    denial_reason: Optional[str] = None


class AppealBase(BaseModel):
    claim_id: int
    reason: str = Field(..., min_length=1)


class AppealCreate(AppealBase):
    pass


class AppealRead(AppealBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    submitted_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
