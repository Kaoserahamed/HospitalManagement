"""Security Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class MFAConfigBase(BaseModel):
    user_id: int
    method: str = "totp"
    status: str = "disabled"
    secret: Optional[str] = None
    backup_codes: Optional[str] = None


class MFAConfigCreate(MFAConfigBase):
    pass


class MFAConfigRead(MFAConfigBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    enabled_at: Optional[datetime] = None


class MFAVerifyRequest(BaseModel):
    user_id: int
    code: str = Field(..., min_length=6, max_length=6)


class MFASetupResponse(BaseModel):
    secret: str
    qr_code_url: str
    backup_codes: list[str]


class SSOLinkBase(BaseModel):
    user_id: int
    provider: str
    external_id: str = Field(..., min_length=1, max_length=240)
    idp_name: Optional[str] = Field(None, max_length=120)


class SSOLinkCreate(SSOLinkBase):
    pass


class SSOLinkRead(SSOLinkBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    linked_at: Optional[datetime] = None


class SecurityEventBase(BaseModel):
    user_id: Optional[int] = None
    event_type: str = Field(..., min_length=1, max_length=80)
    severity: str = "info"
    ip_address: Optional[str] = Field(None, max_length=64)
    user_agent: Optional[str] = Field(None, max_length=240)
    details: Optional[str] = None


class SecurityEventCreate(SecurityEventBase):
    pass


class SecurityEventRead(SecurityEventBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    occurred_at: Optional[datetime] = None


class EncryptionKeyBase(BaseModel):
    key_id: str = Field(..., min_length=1, max_length=64)
    algorithm: str = Field(..., min_length=1, max_length=40)
    purpose: str = Field(..., min_length=1, max_length=80)
    is_active: bool = True


class EncryptionKeyCreate(EncryptionKeyBase):
    pass


class EncryptionKeyRead(EncryptionKeyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    rotated_at: Optional[datetime] = None


class PermissionCheck(BaseModel):
    user_id: int
    resource: str
    action: str


class PermissionResult(BaseModel):
    allowed: bool
    reason: str
