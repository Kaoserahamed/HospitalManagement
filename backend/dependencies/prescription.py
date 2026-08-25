from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from repositories.prescription_repository import PrescriptionRepository
from repositories.appointment_repository import AppointmentRepository
from services.prescription_service import PrescriptionService
from controllers.prescription_controller import PrescriptionController


def get_prescription_repository(db: AsyncSession = Depends(get_db)) -> PrescriptionRepository:
    return PrescriptionRepository(db)


def get_appointment_repository(db: AsyncSession = Depends(get_db)) -> AppointmentRepository:
    return AppointmentRepository(db)


def get_prescription_service(
    repo: PrescriptionRepository = Depends(get_prescription_repository),
    appointment_repo: AppointmentRepository = Depends(get_appointment_repository)
) -> PrescriptionService:
    return PrescriptionService(repo, appointment_repo)


def get_prescription_controller(
    service: PrescriptionService = Depends(get_prescription_service)
) -> PrescriptionController:
    return PrescriptionController(service)
