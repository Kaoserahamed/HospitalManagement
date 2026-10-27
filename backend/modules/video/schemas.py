"""Video Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class VideoSessionBase(BaseModel):
    visit_id: int
    room_id: str = Field(..., min_length=1, max_length=64)
    quality: str = "sd"


class VideoSessionCreate(VideoSessionBase):
    pass


class VideoSessionRead(VideoSessionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "created"
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    recording_path: Optional[str] = None
    participant_count: int = 0
    created_at: Optional[datetime] = None


class SignalingMessageBase(BaseModel):
    session_id: int
    sender_id: int
    message_type: str = Field(..., min_length=1, max_length=40)
    payload: str


class SignalingMessageCreate(SignalingMessageBase):
    pass


class SignalingMessageRead(SignalingMessageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class SessionMetricBase(BaseModel):
    session_id: int
    metric_name: str = Field(..., min_length=1, max_length=60)
    metric_value: float = 0.0


class SessionMetricCreate(SessionMetricBase):
    pass


class SessionMetricRead(SessionMetricBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None
