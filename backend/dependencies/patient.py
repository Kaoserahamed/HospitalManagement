from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from controllers.patient_controller import PatientController
from core.database import get_db
from repositories.appointment_repository import AppointmentRepository
from repositories.patient_repository import PatientRepository
from services.patient_service import PatientService


def get_patient_repository(db: AsyncSession = Depends(get_db)) -> PatientRepository:
    return PatientRepository(db)


def get_patient_appointment_repository(db: AsyncSession = Depends(get_db)) -> AppointmentRepository:
    return AppointmentRepository(db)


def get_patient_service(
    patient_repo: PatientRepository = Depends(get_patient_repository),
    appointment_repo: AppointmentRepository = Depends(get_patient_appointment_repository),
) -> PatientService:
    return PatientService(patient_repo, appointment_repo)


def get_patient_controller(
    service: PatientService = Depends(get_patient_service),
) -> PatientController:
    return PatientController(service)
