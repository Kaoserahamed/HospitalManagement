"""Tests for escalation, CDS, and monitoring modules."""

import pytest
from datetime import datetime

from backend.modules.escalation.repository import EscalationRepository
from backend.modules.escalation.service import EscalationService
from backend.modules.cds.repository import CDSRepository
from backend.modules.cds.service import CDSService
from backend.modules.monitoring.repository import MonitoringRepository
from backend.modules.monitoring.service import MonitoringService


@pytest.fixture
def escalation():
    return EscalationService(repository=EscalationRepository())


@pytest.fixture
def cds():
    return CDSService(repository=CDSRepository())


@pytest.fixture
def monitoring():
    return MonitoringService(repository=MonitoringRepository())


# Escalation
def test_create_escalation(escalation):
    e = escalation.create_escalation({"source_type": "monitoring", "source_id": 1, "patient_id": 1, "level": "level1", "notes": "Test"})
    assert e["status"] == "open"


def test_resolve_escalation(escalation):
    e = escalation.create_escalation({"source_type": "monitoring", "source_id": 1, "patient_id": 1, "level": "level1"})
    resolved = escalation.resolve(e["id"])
    assert resolved["status"] == "resolved"


def test_escalate(escalation):
    e = escalation.create_escalation({"source_type": "monitoring", "source_id": 1, "patient_id": 1, "level": "level1"})
    escalated = escalation.escalate(e["id"])
    assert escalated["level"] == "level2"
    assert escalated["status"] == "escalated"


def test_open_escalations(escalation):
    escalation.create_escalation({"source_type": "cds", "source_id": 1, "patient_id": 1, "level": "level2"})
    open_esc = escalation.open_escalations()
    assert len(open_esc) == 1


def test_escalate_from_monitoring(escalation):
    e = escalation.escalate_from_monitoring(1, "heart_rate", 120.0, "critical")
    assert e["level"] == "level3"


def test_escalate_from_cds(escalation):
    e = escalation.escalate_from_cds(1, "Allergy conflict detected")
    assert e["level"] == "level2"


def test_count_open(escalation):
    escalation.create_escalation({"source_type": "monitoring", "source_id": 1, "patient_id": 1, "level": "level1"})
    assert escalation.count_open() == 1


# CDS
def test_create_cds_rule(cds):
    r = cds.create_rule({"name": "Allergy alert", "rule_type": "allergy_alert", "condition": "allergy in meds", "action": "alert"})
    assert r["name"] == "Allergy alert"


def test_evaluate_cds(cds):
    result = cds.evaluate({"patient_id": 1, "medications": ["Penicillin"], "allergies": ["penicillin"]})
    assert result["has_critical"] is True
    assert result["alert_count"] >= 1


def test_dose_check(cds):
    cds.create_dose_range({"medication": "Amoxicillin", "min_dose": 250, "max_dose": 500, "unit": "mg"})
    result = cds.check_dose("Amoxicillin", 100)
    assert result["status"] == "below_range"
    result = cds.check_dose("Amoxicillin", 400)
    assert result["status"] == "in_range"


def test_diagnosis_suggestions(cds):
    result = cds.diagnosis_suggestions(["fever", "cough"])
    assert len(result) >= 1


def test_care_gaps(cds):
    gaps = cds.care_gaps(1, ["bp_control", "a1c"])
    assert len(gaps) == 2


def test_acknowledge_alert(cds):
    cds.create_alert({"patient_id": 1, "alert_level": "warning", "message": "Test alert"})
    alerts = cds.list_alerts(patient_id=1)
    ack = cds.acknowledge_alert(alerts[0]["id"])
    assert ack["acknowledged"] is True


# Monitoring
def test_register_device(monitoring):
    d = monitoring.register_device({"patient_id": 1, "device_type": "bp_cuff", "serial_number": "SN001"})
    assert d["serial_number"] == "SN001"


def test_record_reading(monitoring):
    monitoring.create_threshold({"vital_type": "heart_rate", "min_value": 60, "max_value": 100, "severity": "warning"})
    r = monitoring.record_reading({"patient_id": 1, "vital_type": "heart_rate", "value": 72.0})
    assert r["value"] == 72.0


def test_alert_on_threshold(monitoring):
    monitoring.create_threshold({"vital_type": "heart_rate", "min_value": 60, "max_value": 100, "severity": "warning"})
    monitoring.record_reading({"patient_id": 1, "vital_type": "heart_rate", "value": 120.0})
    alerts = monitoring.list_alerts(patient_id=1)
    assert len(alerts) == 1


def test_acknowledge_alert_mon(monitoring):
    monitoring.create_threshold({"vital_type": "heart_rate", "min_value": 60, "max_value": 100})
    monitoring.record_reading({"patient_id": 1, "vital_type": "heart_rate", "value": 120.0})
    alerts = monitoring.list_alerts(patient_id=1)
    ack = monitoring.acknowledge_alert(alerts[0]["id"])
    assert ack["acknowledged"] is True


def test_latest_reading(monitoring):
    monitoring.record_reading({"patient_id": 1, "vital_type": "glucose", "value": 90.0})
    latest = monitoring.latest_reading(1, "glucose")
    assert latest["value"] == 90.0


def test_trend(monitoring):
    for i in range(5):
        monitoring.record_reading({"patient_id": 1, "vital_type": "glucose", "value": 80.0 + i})
    trend = monitoring.trend(1, "glucose", limit=3)
    assert len(trend) == 3


def test_unacknowledged_count(monitoring):
    monitoring.create_threshold({"vital_type": "heart_rate", "min_value": 60, "max_value": 100})
    monitoring.record_reading({"patient_id": 1, "vital_type": "heart_rate", "value": 120.0})
    count = monitoring.unacknowledged_count(patient_id=1)
    assert count == 1


def test_deactivate_device(monitoring):
    d = monitoring.register_device({"patient_id": 1, "device_type": "bp_cuff", "serial_number": "SN002"})
    deactivated = monitoring.deactivate_device(d["id"])
    assert deactivated["is_active"] is False
