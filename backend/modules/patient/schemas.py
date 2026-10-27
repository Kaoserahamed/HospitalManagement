"""Patient Pydantic schemas."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class PatientBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    dob: date
    gender: str = "unspecified"
    phone: Optional[str] = Field(None, max_length=30)
    address: Optional[str] = None
    insurance_provider: Optional[str] = Field(None, max_length=120)
    insurance_number: Optional[str] = Field(None, max_length=120)

    @field_validator("first_name", "last_name")
    @classmethod
    def strip_names(cls, value: str) -> str:
        return value.strip()


class PatientCreate(PatientBase):
    user_id: Optional[int] = None


class PatientUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    dob: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = Field(None, max_length=30)
    address: Optional[str] = None
    insurance_provider: Optional[str] = Field(None, max_length=120)
    insurance_number: Optional[str] = Field(None, max_length=120)
    status: Optional[str] = None


class PatientRead(PatientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[int] = None
    status: str = "active"
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    full_name: Optional[str] = None


class AllergyBase(BaseModel):
    substance: str = Field(..., min_length=1, max_length=120)
    reaction: Optional[str] = Field(None, max_length=240)
    severity: Optional[str] = Field(None, max_length=40)


class AllergyCreate(AllergyBase):
    pass


class AllergyRead(AllergyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: int
    recorded_at: Optional[datetime] = None


class InsuranceBase(BaseModel):
    provider: str = Field(..., min_length=1, max_length=120)
    policy_number: str = Field(..., min_length=1, max_length=120)
    group_number: Optional[str] = Field(None, max_length=120)
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None


class InsuranceCreate(InsuranceBase):
    pass


class InsuranceRead(InsuranceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: int


class PatientListParams(BaseModel):
    page: int = 1
    per_page: int = 20
    search: Optional[str] = None
    status: Optional[str] = None
    gender: Optional[str] = None


class PatientStats(BaseModel):
    total: int = 0
    active: int = 0
    inactive: int = 0
