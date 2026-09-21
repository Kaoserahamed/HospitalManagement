"""PatientService and DoctorScheduleService unit tests."""

from datetime import date

import pytest
from fastapi import HTTPException

from models.patient import Patient
from services.patient_service import PatientService


def _patient(patient_id="p-1", is_active=True):
    return Patient(
        id=patient_id,
        nid="NID-1",
        phone="01700000001",
        first_name="Asha",
        last_name="Rahman",
        date_of_birth=date(1990, 1, 1),
        gender="female",
        is_active=is_active,
    )


class FakePatientRepository:
    def __init__(self, patients=None):
        self.items = {p.id: p for p in (patients or [])}
        self.calls = []

    async def get_all(self, active_only=False, limit=None, offset=0):
        items = list(self.items.values())
        if active_only:
            items = [p for p in items if p.is_active]
        self.calls.append({"limit": limit, "offset": offset})
        items = items[offset:]
        return items[:limit] if limit is not None else items

    async def get_by_id(self, patient_id):
        return self.items.get(patient_id)


class TestPatientService:
    async def test_get_all_patients_passes_bounds(self):
        repo = FakePatientRepository([_patient("p-1"), _patient("p-2", False)])
        service = PatientService(repo)
        result = await service.get_all_patients(limit=5, offset=1)
        assert len(result) == 1
        assert repo.calls == [{"limit": 5, "offset": 1}]

    async def test_get_all_active_only(self):
        service = PatientService(FakePatientRepository([_patient("p-1"), _patient("p-2", False)]))
        result = await service.get_all_patients(active_only=True)
        assert [p.id for p in result] == ["p-1"]

    async def test_get_patient_found(self):
        service = PatientService(FakePatientRepository([_patient()]))
        patient = await service.get_patient("p-1", requester_id="r-1", requester_role="receptionist")
        assert patient.id == "p-1"

    async def test_get_patient_missing(self):
        service = PatientService(FakePatientRepository())
        with pytest.raises(HTTPException) as exc:
            await service.get_patient("ghost", requester_id="r-1", requester_role="receptionist")
        assert exc.value.status_code == 404


class _FakeRelationshipRepository:
    """Appointment repo stub exposing only the care-relationship check."""

    def __init__(self, relationships: set[tuple[str, str]] | None = None):
        self.relationships = relationships or set()

    async def doctor_has_patient(self, doctor_id, patient_id):
        return (doctor_id, patient_id) in self.relationships


class TestPatientReadScoping:
    """Doctors need a care relationship; patients read only their own record."""

    def _service(self, relationship: bool, with_repo: bool = True):
        appointment_repo = (
            _FakeRelationshipRepository({("d-1", "p-1")} if relationship else set())
            if with_repo
            else None
        )
        return PatientService(FakePatientRepository([_patient()]), appointment_repo)

    async def test_doctor_with_relationship_allowed(self):
        service = self._service(relationship=True)
        patient = await service.get_patient("p-1", requester_id="d-1", requester_role="doctor")
        assert patient.id == "p-1"

    async def test_doctor_without_relationship_forbidden(self):
        service = self._service(relationship=False)
        with pytest.raises(HTTPException) as exc:
            await service.get_patient("p-1", requester_id="d-2", requester_role="doctor")
        assert exc.value.status_code == 403

    async def test_doctor_without_relationship_repo_fails_closed(self):
        service = self._service(relationship=True, with_repo=False)
        with pytest.raises(HTTPException) as exc:
            await service.get_patient("p-1", requester_id="d-1", requester_role="doctor")
        assert exc.value.status_code == 403

    async def test_receptionist_allowed(self):
        service = self._service(relationship=False)
        patient = await service.get_patient("p-1", requester_id="r-1", requester_role="receptionist")
        assert patient.id == "p-1"

    async def test_admin_allowed(self):
        service = self._service(relationship=False)
        patient = await service.get_patient("p-1", requester_id="a-1", requester_role="admin")
        assert patient.id == "p-1"

    async def test_patient_reads_own_record(self):
        service = self._service(relationship=False)
        patient = await service.get_patient("p-1", requester_id="p-1", requester_role="patient")
        assert patient.id == "p-1"

    async def test_patient_cannot_read_other_record(self):
        service = self._service(relationship=True)
        with pytest.raises(HTTPException) as exc:
            await service.get_patient("p-1", requester_id="p-2", requester_role="patient")
        assert exc.value.status_code == 403
