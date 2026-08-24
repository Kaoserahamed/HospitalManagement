from pydantic import BaseModel, ConfigDict
from datetime import datetime


class DepartmentCreate(BaseModel):
    """Schema for creating a department"""
    name: str
    description: str | None = None


class DepartmentUpdate(BaseModel):
    """Schema for updating a department"""
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class DepartmentResponse(BaseModel):
    """Schema for department response"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class DoctorAssignmentRequest(BaseModel):
    """Schema for assigning doctor to department"""
    user_id: str
    department_id: str
    specialization: str | None = None


class DoctorProfileResponse(BaseModel):
    """Schema for doctor profile response"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    department_id: str | None
    specialization: str | None
    created_at: datetime
    updated_at: datetime


class DoctorWithDepartment(BaseModel):
    """Schema for doctor with department info"""
    id: str
    email: str
    first_name: str
    last_name: str
    phone: str | None
    is_active: bool
    department_id: str | None
    department_name: str | None
    specialization: str | None
