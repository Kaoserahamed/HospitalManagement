from pydantic import BaseModel, ConfigDict
from datetime import date, datetime


class MedicationItem(BaseModel):
    """Single medication item"""
    name: str
    dosage: str
    frequency: str
    duration: str


class PrescriptionCreate(BaseModel):
    """Schema for creating a prescription"""
    appointment_id: str
    patient_id: str
    diagnosis: str
    medications: list[MedicationItem]
    instructions: str | None = None
    follow_up_date: date | None = None


class PrescriptionUpdate(BaseModel):
    """Schema for updating a prescription"""
    diagnosis: str | None = None
    medications: list[MedicationItem] | None = None
    instructions: str | None = None
    follow_up_date: date | None = None


class PrescriptionResponse(BaseModel):
    """Schema for prescription response"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    appointment_id: str
    patient_id: str
    doctor_id: str
    diagnosis: str
    medications: str  # JSON string
    instructions: str | None
    follow_up_date: date | None
    created_at: datetime


class PrescriptionWithDetails(PrescriptionResponse):
    """Prescription with patient and doctor names"""
    patient_name: str | None = None
    doctor_name: str | None = None
