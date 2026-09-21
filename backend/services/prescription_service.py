import json

from fastapi import HTTPException, status

from models.prescription import Prescription
from repositories.appointment_repository import AppointmentRepository
from repositories.prescription_repository import PrescriptionRepository
from schemas.prescription import PrescriptionCreate, PrescriptionUpdate


class PrescriptionService:
    def __init__(
        self, prescription_repo: PrescriptionRepository, appointment_repo: AppointmentRepository
    ):
        self.prescription_repo = prescription_repo
        self.appointment_repo = appointment_repo

    async def create_prescription(self, doctor_id: str, data: PrescriptionCreate) -> Prescription:
        """Doctor creates a prescription"""
        # Verify appointment exists
        appointment = await self.appointment_repo.get_by_id(data.appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
            )

        # Verify doctor matches the appointment's doctor
        if appointment.doctor_id != doctor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only create prescriptions for your own appointments",
            )

        # Verify patient matches the appointment's patient
        if appointment.patient_id != data.patient_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Patient ID does not match the appointment",
            )

        medications_json = json.dumps([med.model_dump() for med in data.medications])

        prescription = Prescription(
            appointment_id=data.appointment_id,
            patient_id=data.patient_id,
            doctor_id=doctor_id,
            diagnosis=data.diagnosis,
            medications=medications_json,
            instructions=data.instructions,
            follow_up_date=data.follow_up_date,
        )
        return await self.prescription_repo.create(prescription)

    async def get_prescription(
        self, prescription_id: str, requester_id: str | None = None
    ) -> Prescription:
        """Get a specific prescription (scoped to the owning doctor when known)"""
        prescription = await self.prescription_repo.get_by_id(prescription_id)
        if not prescription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found"
            )
        if requester_id is not None and prescription.doctor_id != requester_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this prescription",
            )
        return prescription

    async def get_patient_prescriptions(
        self,
        patient_id: str,
        requester_id: str | None = None,
        requester_role: str | None = None,
    ) -> list[Prescription]:
        """Get all prescriptions for a patient.

        Patient self-access returns the full list. When a staff requester is
        supplied, doctors are limited to their own prescriptions for that
        patient; receptionists/admins keep front-desk read access.
        """
        prescriptions = await self.prescription_repo.get_by_patient(patient_id)
        if requester_role == "doctor":
            return [rx for rx in prescriptions if rx.doctor_id == requester_id]
        return prescriptions

    async def get_doctor_prescriptions(self, doctor_id: str) -> list[Prescription]:
        """Get all prescriptions by a doctor"""
        return await self.prescription_repo.get_by_doctor(doctor_id)

    async def update_prescription(
        self, prescription_id: str, doctor_id: str, data: PrescriptionUpdate
    ) -> Prescription:
        """Doctor updates their prescription"""
        prescription = await self.prescription_repo.get_by_id(prescription_id)
        if not prescription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found"
            )

        # Verify doctor owns this prescription
        if prescription.doctor_id != doctor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own prescriptions",
            )

        if data.diagnosis is not None:
            prescription.diagnosis = data.diagnosis
        if data.medications is not None:
            prescription.medications = json.dumps([med.model_dump() for med in data.medications])
        if data.instructions is not None:
            prescription.instructions = data.instructions
        if data.follow_up_date is not None:
            prescription.follow_up_date = data.follow_up_date

        return await self.prescription_repo.update(prescription)

    async def delete_prescription(self, prescription_id: str, doctor_id: str) -> None:
        """Doctor deletes their prescription"""
        prescription = await self.prescription_repo.get_by_id(prescription_id)
        if not prescription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found"
            )

        # Verify doctor owns this prescription
        if prescription.doctor_id != doctor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own prescriptions",
            )

        await self.prescription_repo.delete(prescription)
