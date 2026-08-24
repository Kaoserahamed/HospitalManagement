from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from repositories.appointment_repository import AppointmentRepository
from repositories.user_repository import UserRepository
from repositories.department_repository import DepartmentRepository
from repositories.doctor_repository import DoctorRepository
from repositories.doctor_schedule_repository import DoctorScheduleRepository
from repositories.patient_repository import PatientRepository
from services.appointment_service import AppointmentService
from controllers.appointment_controller import AppointmentController
from dependencies.auth import get_user_repository
from dependencies.department import get_department_repository, get_doctor_repository
from dependencies.patient import get_patient_repository


def get_appointment_repository(db: AsyncSession = Depends(get_db)) -> AppointmentRepository:
    return AppointmentRepository(db)


def get_schedule_repository(db: AsyncSession = Depends(get_db)) -> DoctorScheduleRepository:
    return DoctorScheduleRepository(db)


def get_appointment_service(
    appointment_repo: AppointmentRepository = Depends(get_appointment_repository),
    user_repo: UserRepository = Depends(get_user_repository),
    department_repo: DepartmentRepository = Depends(get_department_repository),
    doctor_repo: DoctorRepository = Depends(get_doctor_repository),
    schedule_repo: DoctorScheduleRepository = Depends(get_schedule_repository),
    patient_repo: PatientRepository = Depends(get_patient_repository)
) -> AppointmentService:
    return AppointmentService(appointment_repo, user_repo, department_repo, doctor_repo, schedule_repo, patient_repo)


def get_appointment_controller(
    service: AppointmentService = Depends(get_appointment_service)
) -> AppointmentController:
    return AppointmentController(service)
