from pydantic import BaseModel, ConfigDict, field_validator
from datetime import date, time, datetime
from models.appointment import AppointmentStatus


class AppointmentCreate(BaseModel):
    """Schema for creating a new appointment"""
    doctor_id: str
    department_id: str
    appointment_date: date
    appointment_time: time
    reason: str | None = None

    @field_validator("appointment_date")
    @classmethod
    def validate_future_date(cls, value: date) -> date:
        if value < date.today():
            raise ValueError("Appointment date cannot be in the past")
        return value


class AppointmentUpdate(BaseModel):
    """Schema for updating an appointment"""
    appointment_date: date | None = None
    appointment_time: time | None = None
    status: AppointmentStatus | None = None
    reason: str | None = None
    notes: str | None = None

    @field_validator("appointment_date")
    @classmethod
    def validate_future_date(cls, value: date | None) -> date | None:
        if value and value < date.today():
            raise ValueError("Appointment date cannot be in the past")
        return value


class AppointmentStatusUpdate(BaseModel):
    """Schema for updating appointment status"""
    status: AppointmentStatus
    notes: str | None = None


class AppointmentResponse(BaseModel):
    """Schema for appointment response"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    doctor_id: str
    department_id: str
    appointment_date: date
    appointment_time: time
    status: AppointmentStatus
    reason: str | None
    notes: str | None
    created_at: datetime
    updated_at: datetime


class AppointmentWithDetails(BaseModel):
    """Schema for appointment with user and department details"""
    id: str
    patient_id: str
    patient_name: str
    patient_email: str
    patient_phone: str | None
    doctor_id: str
    doctor_name: str
    doctor_email: str
    department_id: str
    department_name: str
    appointment_date: date
    appointment_time: time
    status: AppointmentStatus
    reason: str | None
    notes: str | None
    created_at: datetime
