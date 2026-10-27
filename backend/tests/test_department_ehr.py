"""Tests for department and EHR modules."""

import pytest
from datetime import datetime

from backend.modules.department.repository import DepartmentRepository
from backend.modules.department.service import DepartmentService
from backend.modules.ehr.repository import EHRRepository
from backend.modules.ehr.service import EHRService
from backend.shared.pagination import PageParams


@pytest.fixture
def dept_service():
    return DepartmentService(repository=DepartmentRepository())


@pytest.fixture
def ehr_service():
    return EHRService(repository=EHRRepository())


# Department tests
def test_create_department(dept_service):
    result = dept_service.create({"name": "Cardiology"})
    assert result["id"] == 1
    assert result["name"] == "Cardiology"


def test_create_duplicate_department(dept_service):
    dept_service.create({"name": "Neurology"})
    with pytest.raises(Exception):
        dept_service.create({"name": "Neurology"})


def test_get_department(dept_service):
    dept_service.create({"name": "Ortho"})
    result = dept_service.get(1)
    assert result["name"] == "Ortho"


def test_update_department(dept_service):
    dept_service.create({"name": "Peds"})
    updated = dept_service.update(1, {"location": "Building A"})
    assert updated["location"] == "Building A"


def test_delete_department(dept_service):
    dept_service.create({"name": "Temp"})
    assert dept_service.delete(1) is True
    with pytest.raises(Exception):
        dept_service.get(1)


def test_list_departments(dept_service):
    for i in range(5):
        dept_service.create({"name": f"Dept{i}"})
    result = dept_service.list(PageParams(page=1, per_page=3))
    assert result.total == 5


def test_add_room(dept_service):
    dept_service.create({"name": "ICU"})
    room = dept_service.add_room({"department_id": 1, "name": "Room 1", "capacity": 2})
    assert room["department_id"] == 1


def test_list_rooms(dept_service):
    dept_service.create({"name": "ER"})
    dept_service.add_room({"department_id": 1, "name": "R1", "capacity": 1})
    rooms = dept_service.list_rooms(department_id=1)
    assert len(rooms) == 1


def test_add_equipment(dept_service):
    dept_service.create({"name": "Lab"})
    eq = dept_service.add_equipment({"department_id": 1, "name": "Microscope", "quantity": 2})
    assert eq["name"] == "Microscope"


def test_assign_head(dept_service):
    dept_service.create({"name": "Surg"})
    result = dept_service.assign_head(1, 5)
    assert result["head_doctor_id"] == 5


def test_deactivate_activate(dept_service):
    dept_service.create({"name": "Rad"})
    dept_service.deactivate(1)
    assert dept_service.get(1)["is_active"] is False
    dept_service.activate(1)
    assert dept_service.get(1)["is_active"] is True


# EHR tests
def test_create_encounter(ehr_service):
    result = ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    assert result["id"] == 1
    assert result["status"] == "open"


def test_get_encounter(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    result = ehr_service.get_encounter(1)
    assert result["patient_id"] == 1


def test_update_encounter(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    updated = ehr_service.update_encounter(1, {"subjective": "Patient reports pain"})
    assert updated["subjective"] == "Patient reports pain"


def test_finalize_encounter(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    result = ehr_service.finalize_encounter(1, finalized_by=1)
    assert result["status"] == "finalized"


def test_soap_note(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    result = ehr_service.soap_note(1, "S", "O", "A", "P")
    assert result["subjective"] == "S"
    assert result["plan"] == "P"


def test_delete_encounter(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    assert ehr_service.delete_encounter(1) is True
    with pytest.raises(Exception):
        ehr_service.get_encounter(1)


def test_add_vital(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    vital = ehr_service.add_vital({"encounter_id": 1, "heart_rate": 72, "temperature_c": 36.5})
    assert vital["heart_rate"] == 72


def test_list_vitals(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    ehr_service.add_vital({"encounter_id": 1, "heart_rate": 80})
    vitals = ehr_service.list_vitals(1)
    assert len(vitals) == 1


def test_add_diagnosis(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    dx = ehr_service.add_diagnosis({"encounter_id": 1, "code": "I10", "description": "Hypertension", "is_primary": True})
    assert dx["code"] == "I10"


def test_list_diagnoses(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    ehr_service.add_diagnosis({"encounter_id": 1, "code": "E11.9", "description": "Diabetes"})
    dxs = ehr_service.list_diagnoses(1)
    assert len(dxs) == 1


def test_add_lab_result(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    lab = ehr_service.add_lab_result({"encounter_id": 1, "test_name": "CBC", "value": "5.2", "unit": "10^9/L"})
    assert lab["test_name"] == "CBC"


def test_list_lab_results(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    ehr_service.add_lab_result({"encounter_id": 1, "test_name": "Glucose", "value": "90"})
    labs = ehr_service.list_lab_results(1)
    assert len(labs) == 1


def test_add_prescription(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    rx = ehr_service.add_prescription({"encounter_id": 1, "patient_id": 1, "doctor_id": 1, "medication": "Amoxicillin", "dosage": "500mg", "frequency": "3x/day"})
    assert rx["medication"] == "Amoxicillin"


def test_list_prescriptions(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    ehr_service.add_prescription({"encounter_id": 1, "patient_id": 1, "doctor_id": 1, "medication": "Ibuprofen", "dosage": "200mg", "frequency": "2x/day"})
    rxs = ehr_service.list_prescriptions(1)
    assert len(rxs) == 1


def test_patient_history(ehr_service):
    ehr_service.create_encounter({"patient_id": 7, "doctor_id": 1})
    result = ehr_service.patient_history(7, PageParams(page=1, per_page=10))
    assert result.total == 1


def test_encounter_count(ehr_service):
    ehr_service.create_encounter({"patient_id": 1, "doctor_id": 1})
    assert ehr_service.count() == 1
