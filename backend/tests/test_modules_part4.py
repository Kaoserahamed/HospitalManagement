"""Tests for video, report builder, risk prediction, scheduling, escalation modules."""

import pytest
from datetime import datetime, date, time

from backend.modules.video.repository import VideoRepository
from backend.modules.video.service import VideoService
from backend.modules.report_builder.repository import ReportBuilderRepository
from backend.modules.report_builder.service import ReportBuilderService
from backend.modules.risk_prediction.repository import RiskPredictionRepository
from backend.modules.risk_prediction.service import RiskPredictionService
from backend.modules.scheduling.repository import SchedulingRepository
from backend.modules.scheduling.service import SchedulingService
from backend.modules.escalation.repository import EscalationRepository
from backend.modules.escalation.service import EscalationService


@pytest.fixture
def video():
    return VideoService(repository=VideoRepository())


@pytest.fixture
def rb():
    return ReportBuilderService(repository=ReportBuilderRepository())


@pytest.fixture
def risk():
    return RiskPredictionService(repository=RiskPredictionRepository())


@pytest.fixture
def scheduling():
    return SchedulingService(repository=SchedulingRepository())


@pytest.fixture
def escalation():
    return EscalationService(repository=EscalationRepository())


# Video
def test_create_session(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-1"})
    assert s["status"] == "created"


def test_connect_session(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-2"})
    connected = video.connected(s["id"])
    assert connected["status"] == "connected"


def test_end_session(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-3"})
    video.connected(s["id"])
    ended = video.end_session(s["id"], recording_path="/recordings/1.mp4")
    assert ended["status"] == "ended"


def test_signaling(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-4"})
    msg = video.send_signaling({"session_id": s["id"], "sender_id": 1, "message_type": "offer", "payload": "{}"})
    assert msg["message_type"] == "offer"
    msgs = video.list_signaling(s["id"])
    assert len(msgs) == 1


def test_metrics(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-5"})
    video.record_metric({"session_id": s["id"], "metric_name": "bitrate", "metric_value": 1000.0})
    metrics = video.list_metrics(s["id"])
    assert len(metrics) == 1


def test_participants(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-6"})
    video.add_participant(s["id"])
    video.add_participant(s["id"])
    session = video.get_session(s["id"])
    assert session["participant_count"] == 2


def test_quality_update(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-7"})
    updated = video.update_quality(s["id"], "hd")
    assert updated["quality"] == "hd"


# Report builder
def test_create_template(rb):
    t = rb.create_template({"name": "Test", "query": "SELECT 1"})
    assert t["name"] == "Test"


def test_run_report(rb):
    t = rb.create_template({"name": "Run", "query": "SELECT 1"})
    export = rb.run({"template_id": t["id"], "format": "csv"})
    assert export["status"] == "completed"


def test_export_report(rb):
    t = rb.create_template({"name": "Export", "query": "SELECT 1"})
    export = rb.export({"template_id": t["id"], "format": "json"})
    assert export["status"] == "completed"


def test_create_schedule(rb):
    t = rb.create_template({"name": "Sched", "query": "SELECT 1"})
    sched = rb.create_schedule({"template_id": t["id"], "cron_expression": "0 0 * * *", "recipients": "admin@example.com"})
    assert sched["cron_expression"] == "0 0 * * *"


def test_create_dashboard(rb):
    d = rb.create_dashboard({"name": "Main", "widgets": "[]"})
    assert d["name"] == "Main"


def test_standard_templates(rb):
    templates = rb.standard_templates()
    assert len(templates) >= 4


# Risk prediction
def test_create_model(risk):
    m = risk.create_model({"name": "Readmission", "version": "1.0", "features": "[]"})
    assert m["name"] == "Readmission"


def test_create_factor(risk):
    f = risk.create_factor({"name": "age", "weight": 0.2})
    assert f["name"] == "age"


def test_evaluate_risk(risk):
    risk.create_model({"name": "Model", "version": "1.0", "features": "[]", "is_active": True})
    risk.create_factor({"name": "age", "weight": 0.2})
    result = risk.evaluate({"patient_id": 1, "features": {"age": 70}})
    assert "score" in result
    assert "risk_level" in result


def test_predict_readmission(risk):
    risk.create_model({"name": "Model2", "version": "1.0", "features": "[]", "is_active": True})
    result = risk.predict_readmission(1, features={"age": 60})
    assert result["patient_id"] == 1


def test_high_risk_patients(risk):
    risk.create_model({"name": "Model3", "version": "1.0", "features": "[]", "is_active": True})
    risk.evaluate({"patient_id": 1, "features": {"age": 80}})
    high = risk.high_risk_patients(threshold=0.1)
    assert isinstance(high, list)


# Scheduling
def test_request_swap(scheduling):
    swap = scheduling.request_swap({"requester_id": 1, "target_id": 2, "requester_shift_id": 1, "target_shift_id": 2, "reason": "personal"})
    assert swap["status"] == "pending"


def test_approve_swap(scheduling):
    swap = scheduling.request_swap({"requester_id": 1, "target_id": 2, "requester_shift_id": 1, "target_shift_id": 2})
    approved = scheduling.approve_swap(swap["id"], 1)
    assert approved["status"] == "approved"


def test_create_oncall(scheduling):
    oc = scheduling.create_oncall({"department_id": 1, "staff_id": 1, "start_time": datetime(2024, 1, 1, 18), "end_time": datetime(2024, 1, 2, 8)})
    assert oc["on_call_type"] == "primary"


def test_coverage_alert(scheduling):
    alert = scheduling.create_coverage_alert({"department_id": 1, "date": date(2024, 1, 1), "shift_type": "morning", "message": "Gap detected"})
    assert alert["status"] == "gap"


def test_shift_template(scheduling):
    tmpl = scheduling.create_shift_template({"name": "Weekday Morning", "department_id": 1, "shift_type": "morning", "start_time": time(8, 0), "end_time": time(16, 0), "days_of_week": "1,2,3,4,5"})
    assert tmpl["name"] == "Weekday Morning"


def test_availability(scheduling):
    avail = scheduling.set_availability({"staff_id": 1, "day_of_week": 1, "start_time": time(8, 0), "end_time": time(17, 0)})
    assert avail["is_available"] is True


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
