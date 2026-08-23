from pydantic import BaseModel, ConfigDict, field_validator, EmailStr

from models.user import UserRole


class UserCreate(BaseModel):
    """Schema for admin-created users (doctors, receptionists, admins)"""
    email: EmailStr
    password: str
    role: UserRole
    first_name: str
    last_name: str
    phone: str | None = None

    @field_validator("role", mode="before")
    @classmethod
    def normalize_role(cls, value):
        if isinstance(value, str):
            return value.lower().strip()
        return value


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    role: UserRole
    first_name: str
    last_name: str
    phone: str | None = None
    is_active: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"