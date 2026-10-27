"""Performance Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PerformanceMetricBase(BaseModel):
    endpoint: str = Field(..., min_length=1, max_length=240)
    method: str = Field(..., min_length=1, max_length=10)
    duration_ms: float = Field(..., ge=0)
    status_code: int


class PerformanceMetricCreate(PerformanceMetricBase):
    pass


class PerformanceMetricRead(PerformanceMetricBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None


class SlowQueryBase(BaseModel):
    query: str = Field(..., min_length=1)
    duration_ms: float = Field(..., ge=0)
    params: Optional[str] = None


class SlowQueryCreate(SlowQueryBase):
    pass


class SlowQueryRead(SlowQueryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None


class CacheStatsBase(BaseModel):
    cache_name: str = Field(..., min_length=1, max_length=80)
    hits: int = Field(0, ge=0)
    misses: int = Field(0, ge=0)
    evictions: int = Field(0, ge=0)


class CacheStatsCreate(CacheStatsBase):
    pass


class CacheStatsRead(CacheStatsBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None


class PerformanceSummary(BaseModel):
    endpoint: str
    request_count: int
    avg_duration_ms: float
    p95_duration_ms: float
    error_rate: float


class ProfilingResult(BaseModel):
    function_name: str
    call_count: int
    total_time_ms: float
    avg_time_ms: float
