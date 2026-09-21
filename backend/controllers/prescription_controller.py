from schemas.prescription import PrescriptionCreate, PrescriptionResponse, PrescriptionUpdate
from services.prescription_service import PrescriptionService


class PrescriptionController:
    def __init__(self, service: PrescriptionService):
        self.service = service

    async def create_prescription(
        self, doctor_id: str, data: PrescriptionCreate
    ) -> PrescriptionResponse:
        """Doctor creates a prescription"""
        prescription = await self.service.create_prescription(doctor_id, data)
        return PrescriptionResponse.model_validate(prescription)

    async def get_prescription(self, prescription_id: str, doctor_id: str) -> PrescriptionResponse:
        """Doctor reads their own prescription (ownership enforced)"""
        prescription = await self.service.get_prescription(prescription_id, requester_id=doctor_id)
        return PrescriptionResponse.model_validate(prescription)

    async def get_patient_prescriptions(
        self,
        patient_id: str,
        requester_id: str | None = None,
        requester_role: str | None = None,
    ) -> list[PrescriptionResponse]:
        """Get prescriptions for a patient (doctor reads own only)"""
        prescriptions = await self.service.get_patient_prescriptions(
            patient_id, requester_id=requester_id, requester_role=requester_role
        )
        return [PrescriptionResponse.model_validate(p) for p in prescriptions]

    async def get_doctor_prescriptions(self, doctor_id: str) -> list[PrescriptionResponse]:
        """Get all prescriptions by a doctor"""
        prescriptions = await self.service.get_doctor_prescriptions(doctor_id)
        return [PrescriptionResponse.model_validate(p) for p in prescriptions]

    async def update_prescription(
        self, prescription_id: str, doctor_id: str, data: PrescriptionUpdate
    ) -> PrescriptionResponse:
        """Doctor updates their prescription"""
        prescription = await self.service.update_prescription(prescription_id, doctor_id, data)
        return PrescriptionResponse.model_validate(prescription)

    async def delete_prescription(self, prescription_id: str, doctor_id: str) -> None:
        """Doctor deletes their prescription"""
        await self.service.delete_prescription(prescription_id, doctor_id)
