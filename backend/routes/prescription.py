from fastapi import APIRouter, Depends, status
from controllers.prescription_controller import PrescriptionController
from dependencies.prescription import get_prescription_controller
from dependencies.auth import get_current_user, get_current_patient, require_roles
from schemas.prescription import PrescriptionCreate, PrescriptionUpdate, PrescriptionResponse
from models.user import User, UserRole
from models.patient import Patient

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])


# Doctor endpoints
@router.post("", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_prescription(
    data: PrescriptionCreate,
    current_user: User = Depends(require_roles(UserRole.DOCTOR)),
    controller: PrescriptionController = Depends(get_prescription_controller),
):
    """Doctor: Create a prescription"""
    return await controller.create_prescription(current_user.id, data)


@router.get("/my-prescriptions", response_model=list[PrescriptionResponse])
async def get_my_prescriptions(
    current_user: User = Depends(require_roles(UserRole.DOCTOR)),
    controller: PrescriptionController = Depends(get_prescription_controller),
):
    """Doctor: Get all my prescriptions"""
    return await controller.get_doctor_prescriptions(current_user.id)


@router.put("/{prescription_id}", response_model=PrescriptionResponse)
async def update_prescription(
    prescription_id: str,
    data: PrescriptionUpdate,
    current_user: User = Depends(require_roles(UserRole.DOCTOR)),
    controller: PrescriptionController = Depends(get_prescription_controller),
):
    """Doctor: Update my prescription"""
    return await controller.update_prescription(prescription_id, current_user.id, data)


@router.delete("/{prescription_id}")
async def delete_prescription(
    prescription_id: str,
    current_user: User = Depends(require_roles(UserRole.DOCTOR)),
    controller: PrescriptionController = Depends(get_prescription_controller),
):
    """Doctor: Delete my prescription"""
    await controller.delete_prescription(prescription_id, current_user.id)
    return {"message": "Prescription deleted successfully"}


# Patient endpoints
@router.get("/patient/my-prescriptions", response_model=list[PrescriptionResponse])
async def get_patient_my_prescriptions(
    current_patient: Patient = Depends(get_current_patient),
    controller: PrescriptionController = Depends(get_prescription_controller),
):
    """Patient: Get all my prescriptions"""
    return await controller.get_patient_prescriptions(current_patient.id)


# Staff endpoints (view any patient's prescriptions)
@router.get("/patient/{patient_id}", response_model=list[PrescriptionResponse])
async def get_patient_prescriptions(
    patient_id: str,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)),
    controller: PrescriptionController = Depends(get_prescription_controller),
):
    """Staff: Get prescriptions for a specific patient"""
    return await controller.get_patient_prescriptions(patient_id)


@router.get("/{prescription_id}", response_model=PrescriptionResponse)
async def get_prescription(
    prescription_id: str,
    current_user: User = Depends(get_current_user),
    controller: PrescriptionController = Depends(get_prescription_controller),
):
    """Get a specific prescription"""
    return await controller.get_prescription(prescription_id)
