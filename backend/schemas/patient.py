from pydantic import BaseModel, ConfigDict, field_validator
from datetime import date
from models.patient import Gender, BloodGroup


class PatientCreate(BaseModel):
    """Schema for patient registration (used by both public and receptionist)"""
    nid: str
    phone: str
    first_name: str
    last_name: str
    date_of_birth: date
    gender: Gender
    blood_group: BloodGroup | None = None
    address: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None
    medical_history: str | None = None
    allergies: str | None = None

    @field_validator("date_of_birth")
    @classmethod
    def validate_age(cls, value: date) -> date:
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 0:
            raise ValueError("Date of birth cannot be in the future")
        if age > 150:
            raise ValueError("Invalid date of birth")
        return value

    @field_validator("nid")
    @classmethod
    def validate_nid(cls, value: str) -> str:
        nid = value.strip()
        if not nid or len(nid) < 5:
            raise ValueError("NID must be at least 5 characters")
        return nid

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        phone = value.replace("-", "").replace(" ", "").replace("(", "").replace(")", "")
        if not phone or len(phone) < 10:
            raise ValueError("Phone must be at least 10 digits")
        return phone


class PatientLogin(BaseModel):
    """Schema for patient login (NID + phone)"""
    nid: str
    phone: str


class PatientUpdate(BaseModel):
    """Schema for updating patient information"""
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    date_of_birth: date | None = None
    gender: Gender | None = None
    blood_group: BloodGroup | None = None
    address: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None
    medical_history: str | None = None
    allergies: str | None = None
    is_active: bool | None = None


class PatientResponse(BaseModel):
    """Schema for patient response"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    nid: str
    phone: str
    first_name: str
    last_name: str
    date_of_birth: date
    gender: Gender
    blood_group: BloodGroup | None
    address: str | None
    emergency_contact_name: str | None
    emergency_contact_phone: str | None
    medical_history: str | None
    allergies: str | None
    is_active: bool


class PatientListItem(BaseModel):
    """Schema for patient list (minimal info)"""
    id: str
    nid: str
    first_name: str
    last_name: str
    phone: str
    is_active: bool
