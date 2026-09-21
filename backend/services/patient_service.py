from fastapi import HTTPException, status

from models.patient import Patient
from repositories.appointment_repository import AppointmentRepository
from repositories.patient_repository import PatientRepository


class PatientService:
    def __init__(
        self,
        patient_repo: PatientRepository,
        appointment_repo: AppointmentRepository | None = None,
    ):
        self.patient_repo = patient_repo
        self.appointment_repo = appointment_repo

    async def get_all_patients(
        self, active_only: bool = False, limit: int | None = None, offset: int = 0
    ) -> list[Patient]:
        """Get all patients, optionally bounded."""
        return await self.patient_repo.get_all(
            active_only, limit=limit, offset=offset
        )

    async def get_patient(
        self,
        patient_id: str,
        requester_id: str,
        requester_role: str,
    ) -> Patient:
        """Get a specific patient, scoped to the requester's authority.

        - Admin/Receptionist: full read access (front-desk function).
        - Doctor: requires an existing care relationship (any appointment
          record with the patient); otherwise the record is withheld.
        - Patient: may only read their own record.
        """
        patient = await self.patient_repo.get_by_id(patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found"
            )

        if requester_role == "patient":
            if requester_id != patient_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this patient record",
                )
        elif requester_role == "doctor":
            has_relationship = self.appointment_repo is not None and (
                await self.appointment_repo.doctor_has_patient(requester_id, patient_id)
            )
            if not has_relationship:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this patient record",
                )
        # admin / receptionist roles pass through
        return patient
