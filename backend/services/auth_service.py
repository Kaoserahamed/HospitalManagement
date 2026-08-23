from fastapi import HTTPException, status
from repositories.user_repository import UserRepository
from schemas.user import UserCreate, TokenResponse
from models.user import User
from core.security import hash_password, verify_password, create_access_token

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register(self, data: UserCreate) -> User:
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

    async def login(self, email: str, password: str) -> TokenResponse:
        user = await self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive account")

        token = create_access_token({"sub": user.id, "role": user.role.value})
        return TokenResponse(access_token=token)