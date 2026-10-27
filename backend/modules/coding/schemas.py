"""Coding Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class MedicalCodeBase(BaseModel):
    system: str
    code: str = Field(..., min_length=1, max_length=20)
    description: str = Field(..., min_length=1, max_length=500)
    category: Optional[str] = Field(None, max_length=120)
    is_billable: bool = True


class MedicalCodeCreate(MedicalCodeBase):
    pass


class MedicalCodeRead(MedicalCodeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class CodeMappingBase(BaseModel):
    source_system: str
    source_code: str = Field(..., min_length=1, max_length=20)
    target_system: str
    target_code: str = Field(..., min_length=1, max_length=20)
    confidence: float = Field(1.0, ge=0, le=1)


class CodeMappingCreate(CodeMappingBase):
    pass


class CodeMappingRead(CodeMappingBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class EncounterCodeBase(BaseModel):
    encounter_id: int
    system: str
    code: str = Field(..., min_length=1, max_length=20)
    description: Optional[str] = Field(None, max_length=500)
    is_primary: bool = False


class EncounterCodeCreate(EncounterCodeBase):
    pass


class EncounterCodeRead(EncounterCodeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    added_at: Optional[datetime] = None


class CodeSearchRequest(BaseModel):
    system: Optional[str] = None
    query: str
    limit: int = 20


class CodeValidationResult(BaseModel):
    code: str
    system: str
    valid: bool
    description: Optional[str] = None
