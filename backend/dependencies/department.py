from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from repositories.department_repository import DepartmentRepository
from repositories.doctor_repository import DoctorRepository
from repositories.user_repository import UserRepository
from services.department_service import DepartmentService
from controllers.department_controller import DepartmentController
from dependencies.auth import get_user_repository


def get_department_repository(db: AsyncSession = Depends(get_db)) -> DepartmentRepository:
    return DepartmentRepository(db)


def get_doctor_repository(db: AsyncSession = Depends(get_db)) -> DoctorRepository:
    return DoctorRepository(db)


def get_department_service(
    department_repo: DepartmentRepository = Depends(get_department_repository),
    doctor_repo: DoctorRepository = Depends(get_doctor_repository),
    user_repo: UserRepository = Depends(get_user_repository)
) -> DepartmentService:
    return DepartmentService(department_repo, doctor_repo, user_repo)


def get_department_controller(
    service: DepartmentService = Depends(get_department_service)
) -> DepartmentController:
    return DepartmentController(service)
