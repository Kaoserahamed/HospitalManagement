"""FHIR Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


class FHIRResourceBase(BaseModel):
    resource_type: str
    resource_id: str = Field(..., min_length=1, max_length=64)
    payload: str
    source_system: Optional[str] = Field(None, max_length=80)


class FHIRResourceCreate(FHIRResourceBase):
    pass


class FHIRResourceRead(FHIRResourceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    version: int = 1
    last_updated: Optional[datetime] = None


class FHIRBundleBase(BaseModel):
    bundle_type: str = Field(..., min_length=1, max_length=40)
    payload: str


class FHIRBundleCreate(FHIRBundleBase):
    pass


class FHIRBundleRead(FHIRBundleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    total: int = 0
    created_at: Optional[datetime] = None


class FHIRSubscriptionBase(BaseModel):
    resource_type: str
    criteria: str = Field(..., min_length=1, max_length=240)
    channel_type: str = Field(..., min_length=1, max_length=40)
    endpoint: str = Field(..., min_length=1, max_length=500)


class FHIRSubscriptionCreate(FHIRSubscriptionBase):
    pass


class FHIRSubscriptionRead(FHIRSubscriptionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool = True
    created_at: Optional[datetime] = None


class FHIRSearchRequest(BaseModel):
    resource_type: Optional[str] = None
    query: Optional[str] = None
    page: int = 1
    per_page: int = 20


class FHIRPatientResource(BaseModel):
    resourceType: str = "Patient"
    id: Optional[str] = None
    name: list[dict] = []
    gender: Optional[str] = None
    birthDate: Optional[str] = None
    telecom: list[dict] = []


class FHIRObservationResource(BaseModel):
    resourceType: str = "Observation"
    id: Optional[str] = None
    status: str = "final"
    code: dict = {}
    subject: dict = {}
    valueQuantity: Optional[dict] = None
    effectiveDateTime: Optional[str] = None
