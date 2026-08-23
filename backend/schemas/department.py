from pydantic import BaseModel, ConfigDict, field_validator


class DepartmentCreate(BaseModel):
    """Schema for creating a new department"""
    name: str
    description: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Department name cannot be empty")
        return value


class DepartmentUpdate(BaseModel):
    """Schema for updating an existing department"""
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        if value is not None:
            value = value.strip()
            if not value:
                raise ValueError("Department name cannot be empty")
        return value


class DepartmentResponse(BaseModel):
    """Schema for department response"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str | None
    is_active: bool


class DoctorAssignmentRequest(BaseModel):
    """Schema for assigning a doctor to a department"""
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
