"""PrescriptionService unit tests with in-memory repositories.

Focuses on the ownership and consistency rules: only the appointment's
doctor may prescribe, patient ids must match the appointment, and only the
owning doctor may update/delete.
"""

import json
from datetime import date, time

import pytest
from fastapi import HTTPException

from models.appointment import Appointment, AppointmentStatus
from models.prescription import Prescription
from schemas.prescription import (
    MedicationItem,
    PrescriptionCreate,
    PrescriptionUpdate,
)
from services.prescription_service import PrescriptionService


class FakePrescriptionRepository:
    def __init__(self):
        self.items: dict[str, Prescription] = {}

    async def get_by_id(self, prescription_id):
        return self.items.get(prescription_id)

    async def create(self, prescription):
        if prescription.id is None:
            prescription.id = "rx-new"
        self.items[prescription.id] = prescription
        return prescription

    async def update(self, prescription):
        self.items[prescription.id] = prescription
        return prescription

    async def delete(self, prescription):
        self.items.pop(prescription.id, None)

    async def get_by_patient(self, patient_id):
        return [p for p in self.items.values() if p.patient_id == patient_id]

    async def get_by_doctor(self, doctor_id):
        return [p for p in self.items.values() if p.doctor_id == doctor_id]


class FakeAppointmentRepository:
    def __init__(self, appointment: Appointment | None = None):
        self.appointment = appointment

    async def get_by_id(self, appointment_id):
        return (
            self.appointment if self.appointment and self.appointment.id == appointment_id else None
        )


def _appointment(appointment_id="apt-1", doctor_id="d-1", patient_id="p-1"):
    return Appointment(
        id=appointment_id,
        patient_id=patient_id,
        doctor_id=doctor_id,
        department_id="dept-1",
        appointment_date=date(2030, 5, 1),
        appointment_time=time(10, 0),
        status=AppointmentStatus.CONFIRMED,
    )


def _rx_data(appointment_id="apt-1", patient_id="p-1"):
    return PrescriptionCreate(
        appointment_id=appointment_id,
        patient_id=patient_id,
        diagnosis="Hypertension",
        medications=[
            MedicationItem(name="Amlodipine", dosage="5mg", frequency="1x/day", duration="30 days")
        ],
        instructions="Take in the morning",
    )


def _service(appointment=None):
    return PrescriptionService(FakePrescriptionRepository(), FakeAppointmentRepository(appointment))


class TestCreationRules:
    async def test_creates_prescription_with_serialized_medications(self):
        service = _service(_appointment())
        rx = await service.create_prescription("d-1", _rx_data())
        assert rx.doctor_id == "d-1"
        assert rx.patient_id == "p-1"
        assert json.loads(rx.medications)[0]["name"] == "Amlodipine"

    async def test_unknown_appointment_rejected(self):
        service = _service(None)
        with pytest.raises(HTTPException) as exc:
            await service.create_prescription("d-1", _rx_data())
        assert exc.value.status_code == 404

    async def test_other_doctor_forbidden(self):
        # The appointment belongs to d-1; d-2 may not prescribe on it.
        service = _service(_appointment())
        with pytest.raises(HTTPException) as exc:
            await service.create_prescription("d-2", _rx_data())
        assert exc.value.status_code == 403
        assert "own appointments" in exc.value.detail

    async def test_patient_mismatch_rejected(self):
        service = _service(_appointment())
        with pytest.raises(HTTPException) as exc:
            await service.create_prescription("d-1", _rx_data(patient_id="other"))
        assert exc.value.status_code == 400
        assert "does not match" in exc.value.detail


class TestOwnershipRules:
    def _seed(self, doctor_id="d-1"):
        rx = Prescription(
            id="rx-1",
            appointment_id="apt-1",
            patient_id="p-1",
            doctor_id=doctor_id,
            diagnosis="Hypertension",
            medications=json.dumps([{"name": "Amlodipine"}]),
        )
        service = _service(_appointment())
        service.prescription_repo.items["rx-1"] = rx
        return service, rx

    async def test_other_doctor_cannot_update(self):
        service, _ = self._seed()
        with pytest.raises(HTTPException) as exc:
            await service.update_prescription(
                "rx-1", "d-2", PrescriptionUpdate(diagnosis="Changed")
            )
        assert exc.value.status_code == 403
        assert "own prescriptions" in exc.value.detail

    async def test_owner_updates_prescription(self):
        service, _ = self._seed()
        updated = await service.update_prescription(
            "rx-1",
            "d-1",
            PrescriptionUpdate(
                diagnosis="Stage 1 hypertension",
                medications=[
                    MedicationItem(
                        name="Lisinopril",
                        dosage="10mg",
                        frequency="1x/day",
                        duration="30 days",
                    )
                ],
                follow_up_date=date(2030, 6, 1),
            ),
        )
        assert updated.diagnosis == "Stage 1 hypertension"
        assert json.loads(updated.medications)[0]["name"] == "Lisinopril"
        assert updated.follow_up_date == date(2030, 6, 1)

    async def test_other_doctor_cannot_delete(self):
        service, _ = self._seed()
        with pytest.raises(HTTPException) as exc:
            await service.delete_prescription("rx-1", "d-2")
        assert exc.value.status_code == 403

    async def test_owner_deletes_prescription(self):
        service, _ = self._seed()
        await service.delete_prescription("rx-1", "d-1")
        assert "rx-1" not in service.prescription_repo.items

    async def test_unknown_prescription_rejected(self):
        service = _service(_appointment())
        with pytest.raises(HTTPException) as exc:
            await service.update_prescription("ghost", "d-1", PrescriptionUpdate(diagnosis="x"))
        assert exc.value.status_code == 404


class TestListings:
    async def test_scoped_listings(self):
        rx1 = Prescription(
            id="rx-1",
            appointment_id="apt-1",
            patient_id="p-1",
            doctor_id="d-1",
            diagnosis="A",
            medications="[]",
        )
        rx2 = Prescription(
            id="rx-2",
            appointment_id="apt-2",
            patient_id="p-2",
            doctor_id="d-2",
            diagnosis="B",
            medications="[]",
        )
        service = _service(_appointment())
        service.prescription_repo.items = {"rx-1": rx1, "rx-2": rx2}

        by_patient = await service.get_patient_prescriptions("p-1")
        by_doctor = await service.get_doctor_prescriptions("d-2")
        assert [r.id for r in by_patient] == ["rx-1"]
        assert [r.id for r in by_doctor] == ["rx-2"]


class TestStaffListingScoping:
    """Doctors see only their own prescriptions for a patient via the staff
    endpoint; receptionists/admins keep front-desk read access."""

    def _seed(self):
        own = Prescription(
            id="rx-1",
            appointment_id="apt-1",
            patient_id="p-1",
            doctor_id="d-1",
            diagnosis="A",
            medications="[]",
        )
        other = Prescription(
            id="rx-2",
            appointment_id="apt-2",
            patient_id="p-1",
            doctor_id="d-2",
            diagnosis="B",
            medications="[]",
        )
        service = _service(_appointment())
        service.prescription_repo.items = {"rx-1": own, "rx-2": other}
        return service

    async def test_doctor_sees_only_own_prescriptions(self):
        service = self._seed()
        result = await service.get_patient_prescriptions(
            "p-1", requester_id="d-1", requester_role="doctor"
        )
        assert [r.id for r in result] == ["rx-1"]

    async def test_receptionist_sees_all(self):
        service = self._seed()
        result = await service.get_patient_prescriptions(
            "p-1", requester_id="r-1", requester_role="receptionist"
        )
        assert [r.id for r in result] == ["rx-1", "rx-2"]

    async def test_patient_self_access_sees_all_own(self):
        service = self._seed()
        result = await service.get_patient_prescriptions("p-1")
        assert [r.id for r in result] == ["rx-1", "rx-2"]
