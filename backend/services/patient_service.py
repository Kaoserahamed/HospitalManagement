from fastapi import HTTPException, status
from repositories.patient_repository import PatientRepository
from models.patient import Patient


class PatientService:
    def __init__(self, patient_repo: PatientRepository):
        self.patient_repo = patient_repo

    async def get_all_patients(self, active_only: bool = False) -> list[Patient]:
        """Get all patients"""
        return await self.patient_repo.get_all(active_only)

    async def get_patient(self, patient_id: str) -> Patient:
        """Get a specific patient"""
        patient = await self.patient_repo.get_by_id(patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found"
            )
        return patient
