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
        assert (await service.get_patient("p-1")).id == "p-1"

    async def test_get_patient_missing(self):
        service = PatientService(FakePatientRepository())
        with pytest.raises(HTTPException) as exc:
            await service.get_patient("ghost")
        assert exc.value.status_code == 404
