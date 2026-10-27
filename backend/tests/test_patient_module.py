"""Tests for patient module."""

import pytest

from backend.modules.patient.repository import PatientRepository
from backend.modules.patient.service import PatientService
from backend.modules.patient.schemas import PatientCreate


@pytest.fixture
def service():
    repo = PatientRepository()
    return PatientService(repository=repo)


def test_create_patient(service):
    data = {"first_name": "John", "last_name": "Doe", "dob": "1990-01-01", "gender": "male"}
    result = service.create(data)
    assert result["id"] == 1
    assert result["first_name"] == "John"


def test_create_patient_missing_name(service):
    with pytest.raises(Exception):
        service.create({"first_name": "", "last_name": "Doe", "dob": "1990-01-01"})


def test_get_patient(service):
    service.create({"first_name": "Jane", "last_name": "Smith", "dob": "1985-05-05"})
    result = service.get(1)
    assert result["last_name"] == "Smith"


def test_get_patient_not_found(service):
    with pytest.raises(Exception):
        service.get(999)


def test_update_patient(service):
    service.create({"first_name": "Bob", "last_name": "Brown", "dob": "1970-01-01"})
    updated = service.update(1, {"phone": "555-1234"})
    assert updated["phone"] == "555-1234"


def test_delete_patient(service):
    service.create({"first_name": "Alice", "last_name": "Wonder", "dob": "1995-01-01"})
    assert service.delete(1) is True
    with pytest.raises(Exception):
        service.get(1)


def test_list_patients(service):
    for i in range(5):
        service.create({"first_name": f"P{i}", "last_name": "Test", "dob": "1990-01-01"})
    result = service.list(__import__("backend.shared.pagination", fromlist=["PageParams"]).PageParams(page=1, per_page=3))
    assert result.total == 5
    assert len(result.items) == 3


def test_search_patients(service):
    service.create({"first_name": "Alice", "last_name": "Smith", "dob": "1990-01-01"})
    service.create({"first_name": "Bob", "last_name": "Jones", "dob": "1990-01-01"})
    results = service.search("Alice")
    assert len(results) == 1


def test_count_patients(service):
    service.create({"first_name": "A", "last_name": "B", "dob": "1990-01-01"})
    assert service.count() == 1


def test_find_by_user(service):
    service.create({"first_name": "U", "last_name": "Ser", "dob": "1990-01-01", "user_id": 42})
    result = service.find_by_user(42)
    assert result is not None
    assert result["user_id"] == 42


def test_deactivate_reactivate(service):
    service.create({"first_name": "D", "last_name": "E", "dob": "1990-01-01"})
    service.deactivate(1)
    assert service.get(1)["status"] == "inactive"
    service.reactivate(1)
    assert service.get(1)["status"] == "active"


def test_add_allergy(service):
    service.create({"first_name": "A", "last_name": "B", "dob": "1990-01-01"})
    entry = service.add_allergy(1, "penicillin", "rash", "moderate")
    assert entry["substance"] == "penicillin"


def test_bulk_import(service):
    items = [
        {"first_name": "X", "last_name": "Y", "dob": "1990-01-01"},
        {"first_name": "Z", "last_name": "W", "dob": "1990-01-01"},
    ]
    created = service.bulk_import(items)
    assert len(created) == 2
    assert service.count() == 2


def test_repository_clear(service):
    service.create({"first_name": "A", "last_name": "B", "dob": "1990-01-01"})
    service.repository.clear()
    assert service.count() == 0


def test_patient_update_insurance(service):
    service.create({"first_name": "I", "last_name": "N", "dob": "1990-01-01"})
    ins = service.update_insurance(1, {"provider": "Acme", "policy_number": "123"})
    assert ins["provider"] == "Acme"
