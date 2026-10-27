"""Tests for check-in and reporting modules."""

import pytest
from datetime import datetime

from backend.modules.checkin.repository import CheckInRepository
from backend.modules.checkin.service import CheckInService
from backend.modules.reporting.repository import ReportingRepository
from backend.modules.reporting.service import ReportingService
from backend.shared.pagination import PageParams


@pytest.fixture
def checkin():
    return CheckInService(repository=CheckInRepository())


@pytest.fixture
def reporting():
    return ReportingService(repository=ReportingRepository())


# Check-in
def test_checkin(checkin):
    c = checkin.check_in({"patient_id": 1, "department_id": 1, "priority": "normal"})
    assert c["status"] == "checked_in"


def test_call_patient(checkin):
    c = checkin.check_in({"patient_id": 1, "department_id": 1})
    called = checkin.call_patient(c["id"])
    assert called["status"] == "called"


def test_complete_checkin(checkin):
    c = checkin.check_in({"patient_id": 1, "department_id": 1})
    completed = checkin.complete(c["id"])
    assert completed["status"] == "completed"


def test_queue_position(checkin):
    c = checkin.check_in({"patient_id": 1, "department_id": 1})
    pos = checkin.queue_position(c["id"])
    assert "position" in pos


def test_next_patient(checkin):
    checkin.check_in({"patient_id": 1, "department_id": 1})
    nxt = checkin.next_patient(department_id=1)
    assert nxt is not None


def test_waiting_count(checkin):
    checkin.check_in({"patient_id": 1, "department_id": 1})
    assert checkin.waiting_count(department_id=1) >= 1


def test_queue_stats(checkin):
    checkin.check_in({"patient_id": 1, "department_id": 1})
    stats = checkin.queue_stats(department_id=1)
    assert stats["total_waiting"] >= 1


def test_kiosk_session(checkin):
    session = checkin.create_kiosk_session({"patient_id": 1})
    ended = checkin.end_kiosk_session(session["id"])
    assert ended["ended_at"] is not None


# Reporting
def test_create_definition(reporting):
    d = reporting.create_definition({"name": "Test Report", "query": "SELECT 1"})
    assert d["name"] == "Test Report"


def test_run_report(reporting):
    d = reporting.create_definition({"name": "Run Test", "query": "SELECT count(*)"})
    execution = reporting.run({"definition_id": d["id"]})
    assert execution["status"] == "completed"


def test_get_execution(reporting):
    d = reporting.create_definition({"name": "Exec Test", "query": "SELECT 1"})
    execution = reporting.run({"definition_id": d["id"]})
    fetched = reporting.get_execution(execution["id"])
    assert fetched["id"] == execution["id"]


def test_subscribe(reporting):
    d = reporting.create_definition({"name": "Sub Test", "query": "SELECT 1"})
    sub = reporting.subscribe({"definition_id": d["id"], "user_id": 1})
    assert sub["user_id"] == 1


def test_scheduled_reports(reporting):
    reporting.create_definition({"name": "Daily", "query": "SELECT 1", "schedule": "daily"})
    scheduled = reporting.scheduled_reports()
    assert len(scheduled) >= 1


def test_standard_definitions(reporting):
    defs = reporting.standard_definitions()
    assert len(defs) >= 4


def test_delete_definition(reporting):
    d = reporting.create_definition({"name": "Delete Me", "query": "SELECT 1"})
    assert reporting.delete_definition(d["id"]) is True
    with pytest.raises(Exception):
        reporting.get_definition(d["id"])
