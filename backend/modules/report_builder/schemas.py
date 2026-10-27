"""Report builder Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReportTemplateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    report_type: str = "tabular"
    query: str = Field(..., min_length=1)
    parameters: Optional[str] = None
    columns: Optional[str] = None
    is_active: bool = True


class ReportTemplateCreate(ReportTemplateBase):
    pass


class ReportTemplateRead(ReportTemplateBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ReportScheduleBase(BaseModel):
    template_id: int
    cron_expression: str = Field(..., min_length=1, max_length=80)
    export_format: str = "csv"
    delivery_channel: str = "email"
    recipients: str = Field(..., min_length=1)
    is_active: bool = True


class ReportScheduleCreate(ReportScheduleBase):
    pass


class ReportScheduleRead(ReportScheduleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    created_at: Optional[datetime] = None


class ReportExportBase(BaseModel):
    template_id: int
    schedule_id: Optional[int] = None
    format: str = "csv"


class ReportExportCreate(ReportExportBase):
    pass


class ReportExportRead(ReportExportBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    file_path: Optional[str] = None
    row_count: int = 0
    status: str = "pending"
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class ReportDashboardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    widgets: str
    is_default: bool = False


class ReportDashboardCreate(ReportDashboardBase):
    pass


class ReportDashboardRead(ReportDashboardBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class ReportRunRequest(BaseModel):
    template_id: int
    parameters: Optional[dict] = None
    format: str = "csv"


class ReportExportRequest(BaseModel):
    template_id: int
    format: str = "csv"
    schedule_id: Optional[int] = None
