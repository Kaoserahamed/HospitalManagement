from fastapi import APIRouter, Depends, status
from controllers.auth_controller import AuthController
from dependencies.auth import get_auth_controller, get_current_user, get_current_patient, require_roles
from schemas.user import UserCreate, UserLogin, UserUpdate, PasswordChange, UserResponse, TokenResponse
from schemas.patient import PatientCreate, PatientLogin, PatientResponse
from models.user import User, UserRole
from models.patient import Patient

router = APIRouter(prefix="/auth", tags=["Auth"])

# Staff authentication
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
    """Staff login (email + password)"""
    return await controller.login(data)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current staff user"""
    return current_user


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    data: UserUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: AuthController = Depends(get_auth_controller),
):
    return await controller.update_user(user_id, data)


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: AuthController = Depends(get_auth_controller),
):
    return await controller.delete_user(user_id, current_user.id)


@router.put("/password")
async def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    controller: AuthController = Depends(get_auth_controller),
):
    """Staff: change own password"""
    return await controller.change_password(current_user, data)


# Patient authentication
@router.post("/patients/register", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def register_patient(
    data: PatientCreate,
    controller: AuthController = Depends(get_auth_controller),
):
    """Public patient registration (NID + phone)"""
    return await controller.register_patient(data)

@router.post("/patients/login", response_model=TokenResponse)
async def patient_login(
    data: PatientLogin,
    controller: AuthController = Depends(get_auth_controller),
):
    """Patient login (NID + phone)"""
    return await controller.patient_login(data)

@router.get("/patients/me", response_model=PatientResponse)
async def get_patient_me(current_patient: Patient = Depends(get_current_patient)):
    """Get current patient"""
    return PatientResponse.model_validate(current_patient)