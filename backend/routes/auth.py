from fastapi import APIRouter, Depends, status
from controllers.auth_controller import AuthController
from dependencies.auth import get_auth_controller, get_current_user, require_roles
from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from models.user import User, UserRole

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    data: UserCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: AuthController = Depends(get_auth_controller),
):
    """Admin-only endpoint to create doctors, receptionists, and other admins"""
    return await controller.create_user_by_admin(data)

@router.get("/users", response_model=list[UserResponse])
async def get_all_users(
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: AuthController = Depends(get_auth_controller),
):
    """Admin-only endpoint to get all users"""
    return await controller.get_all_users()

@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, controller: AuthController = Depends(get_auth_controller)):
    return await controller.login(data)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user