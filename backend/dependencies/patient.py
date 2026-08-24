from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from repositories.patient_repository import PatientRepository
from services.patient_service import PatientService
from controllers.patient_controller import PatientController


def get_patient_repository(db: AsyncSession = Depends(get_db)) -> PatientRepository:
    return PatientRepository(db)


def get_patient_service(
    patient_repo: PatientRepository = Depends(get_patient_repository)
) -> PatientService:
    return PatientService(patient_repo)


def get_patient_controller(
    service: PatientService = Depends(get_patient_service)
) -> PatientController:
    return PatientController(service)
