"""EHR Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class EncounterBase(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_id: Optional[int] = None
    encounter_type: str = "outpatient"
    chief_complaint: Optional[str] = None


class EncounterCreate(EncounterBase):
    pass


class EncounterUpdate(BaseModel):
    chief_complaint: Optional[str] = None
    subjective: Optional[str] = None
    objective: Optional[str] = None
    assessment: Optional[str] = None
    plan: Optional[str] = None
    status: Optional[str] = None


class EncounterRead(EncounterBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str = "open"
    subjective: Optional[str] = None
    objective: Optional[str] = None
    assessment: Optional[str] = None
    plan: Optional[str] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    finalized_at: Optional[datetime] = None


class VitalCreate(BaseModel):
    encounter_id: int
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    heart_rate: Optional[int] = None
    temperature_c: Optional[float] = None
    respiratory_rate: Optional[int] = None
    oxygen_saturation: Optional[float] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None


class VitalRead(VitalCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: Optional[datetime] = None


class DiagnosisCreate(BaseModel):
    encounter_id: int
    code: str = Field(..., min_length=1, max_length=20)
    description: str = Field(..., min_length=1, max_length=240)
    is_primary: bool = False


class DiagnosisRead(DiagnosisCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    noted_at: Optional[datetime] = None


class LabResultCreate(BaseModel):
    encounter_id: int
    test_name: str = Field(..., min_length=1, max_length=120)
    value: str = Field(..., min_length=1, max_length=120)
    unit: Optional[str] = Field(None, max_length=40)
    reference_range: Optional[str] = Field(None, max_length=80)
    abnormal: bool = False


class LabResultRead(LabResultCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    resulted_at: Optional[datetime] = None


class PrescriptionCreate(BaseModel):
    encounter_id: int
    patient_id: int
    doctor_id: int
    medication: str = Field(..., min_length=1, max_length=120)
    dosage: str = Field(..., min_length=1, max_length=80)
    frequency: str = Field(..., min_length=1, max_length=80)
    duration: Optional[str] = Field(None, max_length=80)
    instructions: Optional[str] = None


class PrescriptionRead(PrescriptionCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    issued_at: Optional[datetime] = None
