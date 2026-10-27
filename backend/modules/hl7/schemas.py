"""HL7 Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class HL7MessageBase(BaseModel):
    message_type: str
    event: str
    raw_message: str
    patient_id: Optional[int] = None


class HL7MessageCreate(HL7MessageBase):
    pass


class HL7MessageRead(HL7MessageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "received"
    parsed_json: Optional[str] = None
    received_at: Optional[datetime] = None
    processed_at: Optional[datetime] = None
    error: Optional[str] = None


class HL7ParseRequest(BaseModel):
    raw_message: str


class HL7ParseResult(BaseModel):
    message_type: str
    event: str
    segments: list[dict]
    patient_id: Optional[str] = None
    valid: bool = True
    error: Optional[str] = None


class HL7AckResponse(BaseModel):
    ack_code: str = "AA"
    message_control_id: str
    text: Optional[str] = None
