from fastapi import APIRouter, Depends, status, Query
from controllers.appointment_controller import AppointmentController
from dependencies.appointment import get_appointment_controller
from dependencies.auth import get_current_user, require_roles
from schemas.schemas import (
    AppointmentCreate, AppointmentUpdate, AppointmentStatusUpdate,
    AppointmentResponse, AppointmentWithDetails
)
from models.user import User, UserRole
from models.appointment import AppointmentStatus

router = APIRouter(prefix="/appointments", tags=["Appointments"])


# Patient endpoints
@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    data: AppointmentCreate,
    current_user: User = Depends(require_roles(UserRole.PATIENT)),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Patient: Book a new appointment"""
    return await controller.create_appointment(current_user.id, data)


@router.get("/my-appointments", response_model=list[AppointmentWithDetails])
async def get_my_appointments(
    current_user: User = Depends(require_roles(UserRole.PATIENT)),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Patient: Get my appointments"""
    return await controller.get_patient_appointments(current_user.id)


@router.delete("/{appointment_id}/cancel", response_model=AppointmentResponse)
async def cancel_my_appointment(
    appointment_id: str,
    current_user: User = Depends(require_roles(UserRole.PATIENT)),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Patient: Cancel my appointment"""
    return await controller.cancel_appointment(appointment_id, current_user.id, current_user.role)


# Doctor endpoints
@router.get("/my-schedule", response_model=list[AppointmentWithDetails])
async def get_my_schedule(
    current_user: User = Depends(require_roles(UserRole.DOCTOR)),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Doctor: Get my appointments schedule"""
    return await controller.get_doctor_appointments(current_user.id)


@router.patch("/{appointment_id}/status", response_model=AppointmentResponse)
async def update_appointment_status(
    appointment_id: str,
    data: AppointmentStatusUpdate,
    current_user: User = Depends(require_roles(UserRole.DOCTOR)),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Doctor: Update appointment status"""
    return await controller.update_status(appointment_id, data)


# Receptionist endpoints
@router.post("/create", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment_for_patient(
    data: AppointmentCreate,
    patient_id: str = Query(..., description="Patient user ID"),
    current_user: User = Depends(require_roles(UserRole.RECEPTIONIST, UserRole.ADMIN)),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Receptionist/Admin: Create appointment for a patient"""
    return await controller.create_appointment(patient_id, data)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: str,
    data: AppointmentUpdate,
    current_user: User = Depends(require_roles(UserRole.RECEPTIONIST, UserRole.ADMIN)),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Receptionist/Admin: Update appointment"""
    return await controller.update_appointment(appointment_id, data)


@router.delete("/{appointment_id}", response_model=AppointmentResponse)
async def cancel_appointment(
    appointment_id: str,
    current_user: User = Depends(require_roles(UserRole.RECEPTIONIST, UserRole.ADMIN)),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Receptionist/Admin: Cancel appointment"""
    return await controller.cancel_appointment(appointment_id, current_user.id, current_user.role)


# Admin/Receptionist - View all appointments
@router.get("", response_model=list[AppointmentWithDetails])
async def get_all_appointments(
    status_filter: AppointmentStatus | None = Query(None, alias="status"),
    current_user: User = Depends(require_roles(UserRole.RECEPTIONIST, UserRole.ADMIN)),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Receptionist/Admin: Get all appointments"""
    return await controller.get_all_appointments(status=status_filter)


@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user),
    controller: AppointmentController = Depends(get_appointment_controller),
):
    """Get a specific appointment"""
    return await controller.get_appointment(appointment_id)
