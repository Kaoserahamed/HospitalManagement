from fastapi import APIRouter, Depends, status

from controllers.auth_controller import AuthController
from controllers.patient_controller import PatientController
from dependencies.auth import get_auth_controller, require_roles
from dependencies.pagination import PaginationParams, get_pagination
from dependencies.patient import get_patient_controller
from models.user import User, UserRole
from schemas.patient import PatientCreate, PatientResponse
from schemas.schemas import PatientListItem

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.post("/register", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def register_patient_by_receptionist(
    data: PatientCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST)),
    controller: AuthController = Depends(get_auth_controller),
):
    """Admin/Receptionist: Register a new patient"""
    return await controller.register_patient(data)


@router.get("", response_model=list[PatientListItem])
async def get_all_patients(
    active_only: bool = False,
    pagination: PaginationParams = Depends(get_pagination),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST)),
    controller: PatientController = Depends(get_patient_controller),
):
    """Admin/Receptionist: Get all patients (bounded, paginated)."""
    return await controller.get_all_patients(
        active_only, limit=pagination.limit, offset=pagination.offset
    )


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: str,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)),
    controller: PatientController = Depends(get_patient_controller),
):
    """Get a specific patient"""
    return await controller.get_patient(patient_id)
