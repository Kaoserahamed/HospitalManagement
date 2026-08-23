from services.auth_service import AuthService
from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse

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