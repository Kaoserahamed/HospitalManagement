from pydantic import BaseModel, ConfigDict, field_validator
from datetime import time, date
from models.doctor_schedule import DayOfWeek


class DoctorScheduleCreate(BaseModel):
    """Schema for creating doctor schedule"""
    doctor_id: str
    day_of_week: DayOfWeek
    start_time: time
    end_time: time
    slot_duration: int  # in minutes

    @field_validator("slot_duration")
    @classmethod
    def validate_slot_duration(cls, value: int) -> int:
        if value < 5 or value > 240:
            raise ValueError("Slot duration must be between 5 and 240 minutes")
        return value

    @field_validator("end_time")
    @classmethod
    def validate_times(cls, end_time: time, info) -> time:
        if 'start_time' in info.data:
            start_time = info.data['start_time']
            if end_time <= start_time:
                raise ValueError("End time must be after start time")
        return end_time


class DoctorScheduleUpdate(BaseModel):
    """Schema for updating doctor schedule"""
    day_of_week: DayOfWeek | None = None
    start_time: time | None = None
    end_time: time | None = None
    slot_duration: int | None = None
    is_active: bool | None = None

    @field_validator("slot_duration")
    @classmethod
    def validate_slot_duration(cls, value: int | None) -> int | None:
        if value and (value < 5 or value > 240):
            raise ValueError("Slot duration must be between 5 and 240 minutes")
        return value


class DoctorScheduleResponse(BaseModel):
    """Schema for doctor schedule response"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    doctor_id: str
    day_of_week: DayOfWeek
    start_time: time
    end_time: time
    slot_duration: int
    is_active: bool


class AvailableSlot(BaseModel):
    """Schema for available appointment slot"""
    date: date
    time: time
    available: bool


class DoctorAvailabilityRequest(BaseModel):
    """Schema for checking doctor availability"""
    doctor_id: str
    date: date

    @field_validator("date")
    @classmethod
    def validate_date(cls, value: date) -> date:
        if value < date.today():
            raise ValueError("Date cannot be in the past")
        return value
