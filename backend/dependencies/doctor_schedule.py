from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from repositories.doctor_schedule_repository import DoctorScheduleRepository
from repositories.user_repository import UserRepository
from repositories.appointment_repository import AppointmentRepository
from services.doctor_schedule_service import DoctorScheduleService
from controllers.doctor_schedule_controller import DoctorScheduleController


def get_doctor_schedule_controller(session: AsyncSession = Depends(get_db)) -> DoctorScheduleController:
    schedule_repo = DoctorScheduleRepository(session)
    user_repo = UserRepository(session)
    appointment_repo = AppointmentRepository(session)
    service = DoctorScheduleService(schedule_repo, user_repo, appointment_repo)
    return DoctorScheduleController(service)
