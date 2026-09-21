from schemas.schemas import PatientListItem, PatientResponse
from services.patient_service import PatientService


class PatientController:
    def __init__(self, service: PatientService):
        self.service = service

    async def get_all_patients(
        self, active_only: bool = False, limit: int | None = None, offset: int = 0
    ) -> list[PatientListItem]:
        """Get all patients"""
        patients = await self.service.get_all_patients(
            active_only, limit=limit, offset=offset
        )
        return [PatientListItem.model_validate(p) for p in patients]

    async def get_patient(
        self, patient_id: str, requester_id: str, requester_role: str
    ) -> PatientResponse:
        """Get a specific patient (care-relationship scoped)"""
        patient = await self.service.get_patient(
            patient_id, requester_id=requester_id, requester_role=requester_role
        )
        return PatientResponse.model_validate(patient)
