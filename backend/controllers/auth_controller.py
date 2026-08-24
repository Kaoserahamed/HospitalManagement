from services.auth_service import AuthService
from schemas.user import UserCreate, UserLogin, UserUpdate, PasswordChange, UserResponse, TokenResponse
from models.user import User
from schemas.patient import PatientCreate, PatientLogin, PatientResponse

class AuthController:
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    async def create_user_by_admin(self, data: UserCreate) -> UserResponse:
        user = await self.auth_service.create_user_by_admin(data)
        return UserResponse.model_validate(user)

    async def get_all_users(self) -> list[UserResponse]:
        users = await self.auth_service.get_all_users()
        return [UserResponse.model_validate(user) for user in users]

    async def login(self, data: UserLogin) -> TokenResponse:
        return await self.auth_service.login(data.email, data.password)

    async def register_patient(self, data: PatientCreate) -> PatientResponse:
        """Public patient registration"""
        patient = await self.auth_service.register_patient(data)
        return PatientResponse.model_validate(patient)

    async def patient_login(self, data: PatientLogin) -> TokenResponse:
        """Patient login with NID + phone"""
        return await self.auth_service.patient_login(data.nid, data.phone)

    async def update_user(self, user_id: str, data: UserUpdate) -> UserResponse:
        user = await self.auth_service.update_user(user_id, data)
        return UserResponse.model_validate(user)

    async def delete_user(self, user_id: str, current_admin_id: str) -> dict:
        await self.auth_service.delete_user(user_id, current_admin_id)
        return {"success": True}

    async def change_password(self, user: User, data: PasswordChange) -> dict:
        await self.auth_service.change_password(user, data)
        return {"success": True}