from fastapi import APIRouter, Depends, status, Query
from datetime import date
from controllers.doctor_schedule_controller import DoctorScheduleController
from dependencies.doctor_schedule import get_doctor_schedule_controller
from dependencies.auth import require_roles
from schemas.schemas import (
    DoctorScheduleCreate, DoctorScheduleUpdate, DoctorScheduleResponse,
    AvailableSlot
)
from models.user import User, UserRole

router = APIRouter(prefix="/schedules", tags=["Doctor Schedules"])


# Admin endpoints
@router.post("", response_model=DoctorScheduleResponse, status_code=status.HTTP_201_CREATED)
async def create_schedule(
    data: DoctorScheduleCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: DoctorScheduleController = Depends(get_doctor_schedule_controller),
):
    """Admin: Create doctor schedule"""
    return await controller.create_schedule(data)


@router.put("/{schedule_id}", response_model=DoctorScheduleResponse)
async def update_schedule(
    schedule_id: str,
    data: DoctorScheduleUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: DoctorScheduleController = Depends(get_doctor_schedule_controller),
):
    """Admin: Update doctor schedule"""
    return await controller.update_schedule(schedule_id, data)


@router.delete("/{schedule_id}")
async def delete_schedule(
    schedule_id: str,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: DoctorScheduleController = Depends(get_doctor_schedule_controller),
):
    """Admin: Delete doctor schedule"""
    return await controller.delete_schedule(schedule_id)


@router.get("/all", response_model=list[DoctorScheduleResponse])
async def get_all_schedules(
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: DoctorScheduleController = Depends(get_doctor_schedule_controller),
):
    """Admin: Get all schedules"""
    return await controller.get_all_schedules()


# Doctor endpoints
@router.get("/my-schedule", response_model=list[DoctorScheduleResponse])
async def get_my_schedule(
    current_user: User = Depends(require_roles(UserRole.DOCTOR)),
    controller: DoctorScheduleController = Depends(get_doctor_schedule_controller),
):
    """Doctor: Get my schedule"""
    return await controller.get_doctor_schedules(current_user.id)


# Public endpoints (for appointment booking)
@router.get("/doctor/{doctor_id}", response_model=list[DoctorScheduleResponse])
async def get_doctor_schedule(
    doctor_id: str,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT)),
    controller: DoctorScheduleController = Depends(get_doctor_schedule_controller),
):
    """Get doctor's schedule"""
    return await controller.get_doctor_schedules(doctor_id)


@router.get("/availability", response_model=list[AvailableSlot])
async def get_available_slots(
    doctor_id: str = Query(..., description="Doctor ID"),
    date: date = Query(..., description="Target date (YYYY-MM-DD)"),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT)),
    controller: DoctorScheduleController = Depends(get_doctor_schedule_controller),
):
    """Get available appointment slots for a doctor on a specific date"""
    return await controller.get_available_slots(doctor_id, date)
