from fastapi import APIRouter, Depends, status
from controllers.department_controller import DepartmentController
from dependencies.department import get_department_controller
from dependencies.auth import require_roles
from schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
    DoctorAssignmentRequest,
    DoctorProfileResponse,
    DoctorWithDepartment
)
from models.user import User, UserRole

router = APIRouter(prefix="/departments", tags=["Departments"])


# Doctor-related endpoints (must come before /{department_id})
@router.get("/doctors/all", response_model=list[DoctorWithDepartment])
async def get_all_doctors_with_departments(
    controller: DepartmentController = Depends(get_department_controller),
):
    """Get all doctors with their departments (public access for appointment booking)"""
    return await controller.get_all_doctors_with_departments()


@router.get("/my-department/info", response_model=DepartmentResponse | None)
async def get_my_department(
    current_user: User = Depends(require_roles(UserRole.DOCTOR)),
    controller: DepartmentController = Depends(get_department_controller),
):
    """Doctor: Get my assigned department"""
    return await controller.get_doctor_department(current_user.id)


# Admin-only endpoints
@router.post("", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(
    data: DepartmentCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: DepartmentController = Depends(get_department_controller),
):
    """Admin: Create a new department"""
    return await controller.create_department(data)


@router.put("/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: str,
    data: DepartmentUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: DepartmentController = Depends(get_department_controller),
):
    """Admin: Update a department"""
    return await controller.update_department(department_id, data)


@router.post("/assign-doctor", response_model=DoctorProfileResponse)
async def assign_doctor_to_department(
    data: DoctorAssignmentRequest,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: DepartmentController = Depends(get_department_controller),
):
    """Admin: Assign a doctor to a department"""
    return await controller.assign_doctor(data)


@router.delete("/assign-doctor/{user_id}", response_model=DoctorProfileResponse)
async def remove_doctor_assignment(
    user_id: str,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    controller: DepartmentController = Depends(get_department_controller),
):
    """Admin: Remove doctor's department assignment"""
    return await controller.remove_doctor_assignment(user_id)


# Public endpoints (for appointment booking)
@router.get("", response_model=list[DepartmentResponse])
async def get_all_departments(
    active_only: bool = False,
    controller: DepartmentController = Depends(get_department_controller),
):
    """Get all departments (public access for appointment booking)"""
    return await controller.get_all_departments(active_only=active_only)


@router.get("/{department_id}", response_model=DepartmentResponse)
async def get_department(
    department_id: str,
    controller: DepartmentController = Depends(get_department_controller),
):
    """Get a specific department (public access)"""
    return await controller.get_department(department_id)
