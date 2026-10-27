"""Tests for Phase 2 modules."""

import pytest
from datetime import datetime, date

from backend.modules.fhir.repository import FHIRRepository
from backend.modules.fhir.service import FHIRService
from backend.modules.hl7.repository import HL7Repository
from backend.modules.hl7.service import HL7Service
from backend.modules.dicom.repository import DicomRepository
from backend.modules.dicom.service import DicomService
from backend.modules.cds.repository import CDSRepository
from backend.modules.cds.service import CDSService
from backend.modules.lab.repository import LabRepository
from backend.modules.lab.service import LabService
from backend.modules.quality.repository import QualityRepository
from backend.modules.quality.service import QualityService
from backend.modules.feature_flags.repository import FeatureFlagRepository
from backend.modules.feature_flags.service import FeatureFlagService
from backend.modules.care.repository import CareRepository
from backend.modules.care.service import CareService
from backend.modules.population.repository import PopulationRepository
from backend.modules.population.service import PopulationService
from backend.modules.mdt.repository import MDTRepository
from backend.modules.mdt.service import MDTService
from backend.shared.pagination import PageParams


# FHIR
@pytest.fixture
def fhir():
    return FHIRService(repository=FHIRRepository())


def test_fhir_create_resource(fhir):
    r = fhir.create_resource({"resource_type": "Patient", "resource_id": "123", "payload": "{}"})
    assert r["resource_type"] == "Patient"


def test_fhir_get_resource(fhir):
    fhir.create_resource({"resource_type": "Patient", "resource_id": "456", "payload": "{}"})
    r = fhir.get_resource("Patient", "456")
    assert r["resource_id"] == "456"


def test_fhir_patient_to_fhir(fhir):
    result = fhir.patient_to_fhir({"id": 1, "first_name": "John", "last_name": "Doe", "dob": "1990-01-01", "gender": "male"})
    assert result["resourceType"] == "Patient"


def test_fhir_validate(fhir):
    result = fhir.validate_resource("Patient", {"resourceType": "Patient"})
    assert result["valid"] is True


# HL7
@pytest.fixture
def hl7():
    return HL7Service(repository=HL7Repository())


def test_hl7_parse(hl7):
    raw = "MSH|^~\\&|HIS||LIS||20240101||ADT^A01||P|2.5\nPID|1||123||Doe^John||19900101|M"
    result = hl7.parse_message(raw)
    assert result["message_type"] == "ADT"
    assert result["patient_id"] == "123"


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
@pytest.fixture
def dicom():
    return DicomService(repository=DicomRepository())


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


# CDS
@pytest.fixture
def cds():
    return CDSService(repository=CDSRepository())


def test_cds_create_rule(cds):
    r = cds.create_rule({"name": "Allergy alert", "rule_type": "allergy_alert", "condition": "allergy in meds", "action": "alert"})
    assert r["name"] == "Allergy alert"


def test_cds_evaluate(cds):
    result = cds.evaluate({"patient_id": 1, "medications": ["Penicillin"], "allergies": ["penicillin"]})
    assert result["has_critical"] is True


def test_cds_dose_check(cds):
    cds.create_dose_range({"medication": "Amoxicillin", "min_dose": 250, "max_dose": 500, "unit": "mg"})
    result = cds.check_dose("Amoxicillin", 100)
    assert result["status"] == "below_range"


def test_cds_diagnosis_suggestions(cds):
    result = cds.diagnosis_suggestions(["fever", "cough"])
    assert len(result) >= 1


# Lab
@pytest.fixture
def lab():
    return LabService(repository=LabRepository())


def test_lab_create_order(lab):
    o = lab.create_order({"patient_id": 1, "ordering_provider": 1, "test_code": "CBC", "test_name": "Complete Blood Count"})
    assert o["status"] == "ordered"


def test_lab_collect_and_result(lab):
    o = lab.create_order({"patient_id": 1, "ordering_provider": 1, "test_code": "GLU", "test_name": "Glucose"})
    lab.collect_sample(o["id"])
    result = lab.add_result({"order_id": o["id"], "value": "95", "unit": "mg/dL"})
    assert result["value"] == "95"


def test_lab_panel_order(lab):
    panel = lab.create_panel({"name": "BMP", "tests": "GLU,BUN,CREAT"})
    orders = lab.order_panel(panel["id"], 1, 1)
    assert len(orders) == 3


# Quality
@pytest.fixture
def quality():
    return QualityService(repository=QualityRepository())


def test_quality_create_measure(quality):
    m = quality.create_measure({"name": "BP Control", "numerator": 0, "denominator": 0, "target": 0.8})
    assert m["name"] == "BP Control"


def test_quality_record_result(quality):
    m = quality.create_measure({"name": "A1C", "numerator": 0, "denominator": 0, "target": 0.7})
    quality.record_result({"measure_id": m["id"], "patient_id": 1, "numerator_met": True})
    rate = quality.rate(m["id"])
    assert rate == 1.0


def test_quality_summary(quality):
    m = quality.create_measure({"name": "Screening", "numerator": 0, "denominator": 0, "target": 0.9})
    quality.record_result({"measure_id": m["id"], "patient_id": 1, "numerator_met": True})
    summary = quality.summary(m["id"])
    assert summary["status"] == "on_track"


# Feature flags
@pytest.fixture
def flags():
    return FeatureFlagService(repository=FeatureFlagRepository())


def test_create_flag(flags):
    f = flags.create({"key": "new_ui", "name": "New UI", "enabled": True, "rollout_percentage": 100})
    assert f["key"] == "new_ui"


def test_evaluate_flag(flags):
    flags.create({"key": "beta", "name": "Beta", "enabled": True, "rollout_percentage": 100})
    result = flags.evaluate("beta", user_id=1)
    assert result["enabled"] is True


def test_flag_override(flags):
    f = flags.create({"key": "exp", "name": "Exp", "enabled": True, "rollout_percentage": 0})
    flags.create_override({"flag_id": f["id"], "user_id": 1, "enabled": True})
    result = flags.evaluate("exp", user_id=1)
    assert result["reason"] == "user_override"


# Care
@pytest.fixture
def care():
    return CareService(repository=CareRepository())


def test_create_care_team(care):
    t = care.create_team({"patient_id": 1, "name": "Team A"})
    assert t["name"] == "Team A"


def test_create_care_task(care):
    task = care.create_task({"patient_id": 1, "title": "Follow up"})
    assert task["status"] == "open"


def test_complete_care_task(care):
    task = care.create_task({"patient_id": 1, "title": "Task"})
    completed = care.complete_task(task["id"])
    assert completed["status"] == "done"


def test_handoff(care):
    ho = care.create_handoff({"patient_id": 1, "from_user": 1, "to_user": 2, "summary": "Handoff"})
    assert ho["status"] == "pending"
    ack = care.acknowledge_handoff(ho["id"])
    assert ack["status"] == "acknowledged"


def test_discharge_plan(care):
    plan = care.create_discharge_plan({"patient_id": 1, "summary": "Discharge instructions"})
    assert plan["patient_id"] == 1


# Population
@pytest.fixture
def population():
    return PopulationService(repository=PopulationRepository())


def test_create_registry(population):
    r = population.create_registry({"name": "Diabetes", "registry_type": "disease"})
    assert r["name"] == "Diabetes"


def test_enroll_member(population):
    r = population.create_registry({"name": "HTN"})
    member = population.enroll_member({"registry_id": r["id"], "patient_id": 1})
    assert member["patient_id"] == 1


def test_record_outcome(population):
    o = population.record_outcome({"patient_id": 1, "outcome": "a1c", "value": 7.0})
    assert o["value"] == 7.0


# MDT
@pytest.fixture
def mdt():
    return MDTService(repository=MDTRepository())


def test_schedule_mdt(mdt):
    m = mdt.schedule_meeting({"patient_id": 1, "title": "Case review", "scheduled_at": datetime(2024, 1, 1, 10)})
    assert m["status"] == "scheduled"


def test_add_attendee(mdt):
    m = mdt.schedule_meeting({"patient_id": 1, "title": "Review", "scheduled_at": datetime(2024, 1, 1, 10)})
    att = mdt.add_attendee({"meeting_id": m["id"], "user_id": 1, "role": "doctor"})
    assert att["attended"] is False


def test_add_decision(mdt):
    m = mdt.schedule_meeting({"patient_id": 1, "title": "Review", "scheduled_at": datetime(2024, 1, 1, 10)})
    d = mdt.add_decision({"meeting_id": m["id"], "decision": "Proceed with surgery"})
    assert d["status"] == "open"


def test_complete_meeting(mdt):
    m = mdt.schedule_meeting({"patient_id": 1, "title": "Review", "scheduled_at": datetime(2024, 1, 1, 10)})
    completed = mdt.complete_meeting(m["id"])
    assert completed["status"] == "completed"
