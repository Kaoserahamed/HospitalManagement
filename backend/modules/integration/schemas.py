"""Integration Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class AdapterBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    adapter_type: str
    endpoint: str = Field(..., min_length=1, max_length=500)
    credentials: Optional[str] = None
    status: str = "active"


class AdapterCreate(AdapterBase):
    pass


class AdapterRead(AdapterBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    last_sync: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: Optional[datetime] = None


class SyncLogBase(BaseModel):
    adapter_id: int
    status: str
    records_processed: int = 0
    records_failed: int = 0
    error: Optional[str] = None


class SyncLogCreate(SyncLogBase):
    pass


class SyncLogRead(SyncLogBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class WebhookBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    url: str = Field(..., min_length=1, max_length=500)
    events: str
    secret: Optional[str] = None
    is_active: bool = True


class WebhookCreate(WebhookBase):
    pass


class WebhookRead(WebhookBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class WebhookDeliveryBase(BaseModel):
    webhook_id: int
    event: str
    payload: str
    response_status: Optional[int] = None
    response_body: Optional[str] = None


class WebhookDeliveryCreate(WebhookDeliveryBase):
    pass


class WebhookDeliveryRead(WebhookDeliveryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    delivered_at: Optional[datetime] = None
