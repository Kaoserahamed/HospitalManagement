"""Tests for telemedicine, FHIR, HL7, DICOM modules."""

import pytest
from datetime import datetime

from backend.modules.telemedicine.repository import TelemedicineRepository
from backend.modules.telemedicine.service import TelemedicineService
from backend.modules.fhir.repository import FHIRRepository
from backend.modules.fhir.service import FHIRService
from backend.modules.hl7.repository import HL7Repository
from backend.modules.hl7.service import HL7Service
from backend.modules.dicom.repository import DicomRepository
from backend.modules.dicom.service import DicomService


@pytest.fixture
def tele():
    return TelemedicineService(repository=TelemedicineRepository())


@pytest.fixture
def fhir():
    return FHIRService(repository=FHIRRepository())


@pytest.fixture
def hl7():
    return HL7Service(repository=HL7Repository())


@pytest.fixture
def dicom():
    return DicomService(repository=DicomRepository())


# Telemedicine
def test_schedule_visit(tele):
    v = tele.schedule_visit({"patient_id": 1, "doctor_id": 1, "scheduled_start": datetime(2024, 1, 1, 10), "scheduled_end": datetime(2024, 1, 1, 11)})
    assert v["status"] == "scheduled"


def test_start_end_visit(tele):
    v = tele.schedule_visit({"patient_id": 1, "doctor_id": 1, "scheduled_start": datetime(2024, 1, 1, 10), "scheduled_end": datetime(2024, 1, 1, 11)})
    tele.start_visit(v["id"])
    ended = tele.end_visit(v["id"], quality="good")
    assert ended["status"] == "completed"


def test_waiting_room(tele):
    v = tele.schedule_visit({"patient_id": 1, "doctor_id": 1, "scheduled_start": datetime(2024, 1, 1, 10), "scheduled_end": datetime(2024, 1, 1, 11)})
    entry = tele.enter_waiting_room({"visit_id": v["id"], "patient_id": 1})
    admitted = tele.admit_patient(entry["id"])
    assert admitted["is_admitted"] is True


def test_visit_summary(tele):
    tele.schedule_visit({"patient_id": 1, "doctor_id": 1, "scheduled_start": datetime(2024, 1, 1, 10), "scheduled_end": datetime(2024, 1, 1, 11)})
    summary = tele.summary()
    assert summary["total_visits"] == 1


# FHIR
def test_fhir_create_resource(fhir):
    r = fhir.create_resource({"resource_type": "Patient", "resource_id": "123", "payload": "{}"})
    assert r["resource_type"] == "Patient"


def test_fhir_patient_to_fhir(fhir):
    result = fhir.patient_to_fhir({"id": 1, "first_name": "John", "last_name": "Doe", "dob": "1990-01-01", "gender": "male"})
    assert result["resourceType"] == "Patient"


def test_fhir_validate(fhir):
    result = fhir.validate_resource("Patient", {"resourceType": "Patient"})
    assert result["valid"] is True


def test_fhir_subscription(fhir):
    sub = fhir.create_subscription({"resource_type": "Patient", "criteria": "Patient?name=John", "channel_type": "rest-hook", "endpoint": "https://example.com/hook"})
    assert sub["resource_type"] == "Patient"


# HL7
def test_hl7_parse(hl7):
    raw = "MSH|^~\\&|HIS||LIS||20240101||ADT^A01||P|2.5\nPID|1||123||Doe^John||19900101|M"
    result = hl7.parse_message(raw)
    assert result["message_type"] == "ADT"


def test_hl7_receive(hl7):
    raw = "MSH|^~\\&|HIS||LIS||20240101||ADT^A01||P|2.5\nPID|1||123||Doe^John"
    msg = hl7.receive({"message_type": "ADT", "event": "A01", "raw_message": raw})
    assert msg["status"] == "received"


def test_hl7_generate_ack(hl7):
    ack = hl7.generate_ack("MSG001")
    assert "MSA" in ack


def test_hl7_convert_patient(hl7):
    result = hl7.convert_patient_to_hl7({"id": 1, "first_name": "Jane", "last_name": "Smith", "dob": "1985-05-05", "gender": "F"})
    assert "PID" in result


# DICOM
def test_dicom_create_study(dicom):
    s = dicom.create_study({"study_instance_uid": "1.2.3", "patient_id": 1, "modality": "CT"})
    assert s["modality"] == "CT"


def test_dicom_series_instance(dicom):
    s = dicom.create_study({"study_instance_uid": "1.2.4", "patient_id": 1})
    series = dicom.create_series({"study_id": s["id"], "series_instance_uid": "1.2.4.1", "modality": "CT"})
    inst = dicom.create_instance({"series_id": series["id"], "sop_instance_uid": "1.2.4.1.1"})
    assert inst["series_id"] == series["id"]


def test_dicom_study_summary(dicom):
    s = dicom.create_study({"study_instance_uid": "1.2.5", "patient_id": 1})
    dicom.create_series({"study_id": s["id"], "series_instance_uid": "1.2.5.1"})
    summary = dicom.study_summary(s["id"])
    assert summary["series_count"] == 1
