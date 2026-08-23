from fastapi import APIRouter, Depends, status
from controllers.auth_controller import AuthController
from dependencies.auth import get_auth_controller, get_current_user, require_roles
from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from models.user import User, UserRole

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, controller: AuthController = Depends(get_auth_controller)):
    return await controller.register(data)

@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, controller: AuthController = Depends(get_auth_controller)):
    return await controller.login(data)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/admin-only", dependencies=[Depends(require_roles(UserRole.ADMIN))])
async def admin_endpoint():
    return {"message": "Welcome Admin"}