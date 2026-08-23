from services.auth_service import AuthService
from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse

class AuthController:
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    async def register(self, data: UserCreate) -> UserResponse:
        user = await self.auth_service.register(data)
        return UserResponse.model_validate(user)

    async def login(self, data: UserLogin) -> TokenResponse:
        return await self.auth_service.login(data.email, data.password)