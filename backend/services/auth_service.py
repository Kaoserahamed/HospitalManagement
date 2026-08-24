from fastapi import HTTPException, status
from repositories.user_repository import UserRepository
from repositories.patient_repository import PatientRepository
from schemas.user import UserCreate, UserUpdate, PasswordChange, TokenResponse
from schemas.patient import PatientCreate, PatientLogin, PatientResponse
from models.user import User, UserRole
from models.patient import Patient
from core.security import hash_password, verify_password, create_access_token

class AuthService:
    def __init__(self, user_repo: UserRepository, patient_repo: PatientRepository):
        self.user_repo = user_repo
        self.patient_repo = patient_repo

    async def create_user_by_admin(self, data: UserCreate) -> User:
        """Admin-only user creation for doctors, receptionists, and admins"""
        existing_user = await self.user_repo.get_by_email(data.email)
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        
        user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            role=data.role,
            first_name=data.first_name,
            last_name=data.last_name,
            phone=data.phone,
        )
        return await self.user_repo.create(user)

    async def get_all_users(self) -> list[User]:
        """Get all users"""
        return await self.user_repo.get_all()

    async def update_user(self, user_id: str, data: UserUpdate) -> User:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        if data.first_name is not None:
            user.first_name = data.first_name
        if data.last_name is not None:
            user.last_name = data.last_name
        if data.phone is not None:
            user.phone = data.phone
        if data.is_active is not None:
            user.is_active = data.is_active
        if data.password:
            user.password_hash = hash_password(data.password)
        return await self.user_repo.update(user)

    async def delete_user(self, user_id: str, current_admin_id: str) -> None:
        if user_id == current_admin_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete your own account")
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        user.is_active = False
        await self.user_repo.update(user)

    async def change_password(self, user: User, data: PasswordChange) -> None:
        if not verify_password(data.current_password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
        if len(data.new_password) < 6:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 6 characters")
        user.password_hash = hash_password(data.new_password)
        await self.user_repo.update(user)

    async def login(self, email: str, password: str) -> TokenResponse:
        user = await self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive or suspended")

        token = create_access_token({"sub": user.id, "role": user.role.value, "type": "staff"})
        return TokenResponse(access_token=token)

    async def register_patient(self, data: PatientCreate) -> Patient:
        """Public patient registration"""
        # Check if NID already exists
        existing_nid = await self.patient_repo.get_by_nid(data.nid)
        if existing_nid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NID already registered")
        
        # Check if phone already exists
        existing_phone = await self.patient_repo.get_by_phone(data.phone)
        if existing_phone:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone number already registered")
        
        patient = Patient(
            nid=data.nid,
            phone=data.phone,
            first_name=data.first_name,
            last_name=data.last_name,
            date_of_birth=data.date_of_birth,
            gender=data.gender,
            blood_group=data.blood_group,
            address=data.address,
            emergency_contact_name=data.emergency_contact_name,
            emergency_contact_phone=data.emergency_contact_phone,
            medical_history=data.medical_history,
            allergies=data.allergies,
        )
        return await self.patient_repo.create(patient)

    async def patient_login(self, nid: str, phone: str) -> TokenResponse:
        """Patient login with NID and phone"""
        patient = await self.patient_repo.get_by_nid(nid)
        if not patient or patient.phone != phone:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not patient.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")

        token = create_access_token({"sub": patient.id, "type": "patient"})
        return TokenResponse(access_token=token)