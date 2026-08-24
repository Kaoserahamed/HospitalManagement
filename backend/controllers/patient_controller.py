from services.patient_service import PatientService
from schemas.schemas import PatientResponse, PatientListItem


class PatientController:
    def __init__(self, service: PatientService):
        self.service = service

    async def get_all_patients(self, active_only: bool = False) -> list[PatientListItem]:
        """Get all patients"""
        patients = await self.service.get_all_patients(active_only)
        return [PatientListItem.model_validate(p) for p in patients]

    async def get_patient(self, patient_id: str) -> PatientResponse:
        """Get a specific patient"""
        patient = await self.service.get_patient(patient_id)
        return PatientResponse.model_validate(patient)
