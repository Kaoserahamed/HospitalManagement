from fastapi import APIRouter, Depends, status
from dependencies.auth import require_roles
from dependencies.patient import get_patient_controller
from controllers.patient_controller import PatientController
from schemas.schemas import PatientResponse, PatientListItem
from models.user import User, UserRole

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("", response_model=list[PatientListItem])
async def get_all_patients(
    active_only: bool = False,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST)),
    controller: PatientController = Depends(get_patient_controller),
):
    """Admin/Receptionist: Get all patients"""
    return await controller.get_all_patients(active_only)


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: str,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)),
    controller: PatientController = Depends(get_patient_controller),
):
    """Get a specific patient"""
    return await controller.get_patient(patient_id)
