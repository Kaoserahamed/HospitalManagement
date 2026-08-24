from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import decode_access_token
from models.user import User, UserRole
from models.patient import Patient
from repositories.user_repository import UserRepository
from repositories.patient_repository import PatientRepository
from services.auth_service import AuthService
from controllers.auth_controller import AuthController

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_user_repository(db: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(db)

def get_patient_repository(db: AsyncSession = Depends(get_db)) -> PatientRepository:
    return PatientRepository(db)

def get_auth_service(
    user_repo: UserRepository = Depends(get_user_repository),
    patient_repo: PatientRepository = Depends(get_patient_repository)
) -> AuthService:
    return AuthService(user_repo, patient_repo)

def get_auth_controller(service: AuthService = Depends(get_auth_service)) -> AuthController:
    return AuthController(service)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    repo: UserRepository = Depends(get_user_repository),
) -> User:
    """Dependency to get current authenticated staff user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise credentials_exception

    # Verify this is a staff token
    token_type = payload.get("type")
    if token_type != "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token type. Staff access required."
        )

    user_id: str = payload.get("sub")
    user = await repo.get_by_id(user_id)
    
    if not user:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended"
        )
    
    return user

async def get_current_patient(
    token: str = Depends(oauth2_scheme),
    repo: PatientRepository = Depends(get_patient_repository),
) -> Patient:
    """Dependency to get current authenticated patient from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise credentials_exception

    # Verify this is a patient token
    token_type = payload.get("type")
    if token_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token type. Patient access required."
        )

    patient_id: str = payload.get("sub")
    patient = await repo.get_by_id(patient_id)
    
    if not patient:
        raise credentials_exception
    
    if not patient.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    return patient

def require_roles(*roles: UserRole):
    """Dependency factory to enforce role-based access control for staff users"""
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join([r.value for r in roles])}"
            )
        return current_user
    return role_checker


async def require_staff_or_patient(
    token: str = Depends(oauth2_scheme),
    user_repo: UserRepository = Depends(get_user_repository),
    patient_repo: PatientRepository = Depends(get_patient_repository),
):
    """Allow any authenticated staff user or patient"""
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    token_type = payload.get("type")
    entity_id = payload.get("sub")

    if token_type == "staff":
        user = await user_repo.get_by_id(entity_id)
        if user and user.is_active:
            return user
    elif token_type == "patient":
        patient = await patient_repo.get_by_id(entity_id)
        if patient and patient.is_active:
            return patient

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")