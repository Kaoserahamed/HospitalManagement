"""Import/Export Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ImportJobBase(BaseModel):
    entity_type: str = Field(..., min_length=1, max_length=60)
    file_name: str = Field(..., min_length=1, max_length=240)
    file_path: Optional[str] = Field(None, max_length=500)


class ImportJobCreate(ImportJobBase):
    pass


class ImportJobRead(ImportJobBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "pending"
    total_rows: int = 0
    processed_rows: int = 0
    error_rows: int = 0
    errors: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class ExportJobBase(BaseModel):
    entity_type: str = Field(..., min_length=1, max_length=60)
    format: str = "csv"
    filters: Optional[str] = None


class ExportJobCreate(ExportJobBase):
    pass


class ExportJobRead(ExportJobBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    file_path: Optional[str] = None
    row_count: int = 0
    status: str = "pending"
    error: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class ImportRequest(BaseModel):
    entity_type: str
    file_name: str
    file_path: str
    mapping: Optional[dict] = None


class ExportRequest(BaseModel):
    entity_type: str
    format: str = "csv"
    filters: Optional[dict] = None
    columns: Optional[list[str]] = None
