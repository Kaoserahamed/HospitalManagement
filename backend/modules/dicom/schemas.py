"""DICOM Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DicomStudyBase(BaseModel):
    study_instance_uid: str = Field(..., min_length=1, max_length=128)
    patient_id: int
    modality: Optional[str] = Field(None, max_length=16)
    study_date: Optional[datetime] = None
    description: Optional[str] = Field(None, max_length=240)
    storage_path: Optional[str] = Field(None, max_length=500)


class DicomStudyCreate(DicomStudyBase):
    pass


class DicomStudyRead(DicomStudyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None


class DicomSeriesBase(BaseModel):
    study_id: int
    series_instance_uid: str = Field(..., min_length=1, max_length=128)
    modality: Optional[str] = Field(None, max_length=16)
    series_number: Optional[int] = None
    instance_count: int = 0


class DicomSeriesCreate(DicomSeriesBase):
    pass


class DicomSeriesRead(DicomSeriesBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class DicomInstanceBase(BaseModel):
    series_id: int
    sop_instance_uid: str = Field(..., min_length=1, max_length=128)
    instance_number: Optional[int] = None
    storage_path: Optional[str] = Field(None, max_length=500)
    file_size: Optional[int] = None


class DicomInstanceCreate(DicomInstanceBase):
    pass


class DicomInstanceRead(DicomInstanceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
