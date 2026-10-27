"""Tests for scheduling and patient portal modules."""

import pytest
from datetime import datetime, date, time, timedelta

from backend.modules.scheduling.repository import SchedulingRepository
from backend.modules.scheduling.service import SchedulingService
from backend.modules.patient_portal.repository import PatientPortalRepository
from backend.modules.patient_portal.service import PatientPortalService


@pytest.fixture
def scheduling():
    return SchedulingService(repository=SchedulingRepository())


@pytest.fixture
def portal():
    return PatientPortalService(repository=PatientPortalRepository())


# Scheduling
def test_request_swap(scheduling):
    swap = scheduling.request_swap({"requester_id": 1, "target_id": 2, "requester_shift_id": 1, "target_shift_id": 2, "reason": "personal"})
    assert swap["status"] == "pending"


def test_approve_swap(scheduling):
    swap = scheduling.request_swap({"requester_id": 1, "target_id": 2, "requester_shift_id": 1, "target_shift_id": 2})
    approved = scheduling.approve_swap(swap["id"], 1)
    assert approved["status"] == "approved"


def test_reject_swap(scheduling):
    swap = scheduling.request_swap({"requester_id": 1, "target_id": 2, "requester_shift_id": 1, "target_shift_id": 2})
    rejected = scheduling.reject_swap(swap["id"], 1)
    assert rejected["status"] == "rejected"


def test_create_oncall(scheduling):
    oc = scheduling.create_oncall({"department_id": 1, "staff_id": 1, "start_time": datetime(2024, 1, 1, 18), "end_time": datetime(2024, 1, 2, 8)})
    assert oc["on_call_type"] == "primary"


def test_oncall_for_department(scheduling):
    scheduling.create_oncall({"department_id": 1, "staff_id": 1, "start_time": datetime(2024, 1, 1, 0), "end_time": datetime(2024, 1, 2, 0)})
    result = scheduling.oncall_for_department(1, at_time=datetime(2024, 1, 1, 12))
    assert len(result) == 1


def test_coverage_alert(scheduling):
    alert = scheduling.create_coverage_alert({"department_id": 1, "date": date(2024, 1, 1), "shift_type": "morning", "message": "Gap detected"})
    assert alert["status"] == "gap"


def test_acknowledge_alert(scheduling):
    alert = scheduling.create_coverage_alert({"department_id": 1, "date": date(2024, 1, 1), "shift_type": "morning", "message": "Gap"})
    ack = scheduling.acknowledge_coverage_alert(alert["id"])
    assert ack["acknowledged"] is True


def test_shift_template(scheduling):
    tmpl = scheduling.create_shift_template({"name": "Weekday Morning", "department_id": 1, "shift_type": "morning", "start_time": time(8, 0), "end_time": time(16, 0), "days_of_week": "1,2,3,4,5"})
    assert tmpl["name"] == "Weekday Morning"


def test_apply_template(scheduling):
    tmpl = scheduling.create_shift_template({"name": "T", "department_id": 1, "shift_type": "morning", "start_time": time(8, 0), "end_time": time(16, 0), "days_of_week": "1,2"})
    result = scheduling.apply_template(tmpl["id"], date(2024, 1, 1), weeks=1)
    assert len(result) == 2


def test_availability(scheduling):
    avail = scheduling.set_availability({"staff_id": 1, "day_of_week": 1, "start_time": time(8, 0), "end_time": time(17, 0)})
    assert avail["is_available"] is True
    result = scheduling.get_availability(1)
    assert len(result) == 1


def test_find_available_staff(scheduling):
    scheduling.set_availability({"staff_id": 1, "day_of_week": 1, "start_time": time(8, 0), "end_time": time(17, 0)})
    staff = scheduling.find_available_staff(1, 1, time(9, 0), time(12, 0))
    assert 1 in staff


def test_generate_schedule(scheduling):
    schedule = scheduling.generate_schedule(1, date(2024, 1, 1), days=3)
    assert len(schedule) == 3


def test_staff_workload(scheduling):
    wl = scheduling.staff_workload(1)
    assert "shifts_this_week" in wl


# Patient portal
def test_send_message(portal):
    msg = portal.send_message({"sender_id": 1, "recipient_id": 2, "body": "Hello"})
    assert msg["status"] == "sent"


def test_send_message_self(portal):
    with pytest.raises(Exception):
        portal.send_message({"sender_id": 1, "recipient_id": 1, "body": "Self"})


def test_mark_read(portal):
    msg = portal.send_message({"sender_id": 1, "recipient_id": 2, "body": "Hi"})
    read = portal.mark_read(msg["id"])
    assert read["is_read"] is True


def test_unread_count(portal):
    portal.send_message({"sender_id": 1, "recipient_id": 2, "body": "Msg1"})
    portal.send_message({"sender_id": 1, "recipient_id": 2, "body": "Msg2"})
    assert portal.unread_count(2) == 2


def test_conversations(portal):
    portal.send_message({"sender_id": 1, "recipient_id": 2, "body": "Hello"})
    convos = portal.conversations(1)
    assert len(convos) == 1


def test_record_download(portal):
    dl = portal.record_download({"prescription_id": 1, "patient_id": 1, "format": "pdf"})
    assert dl["format"] == "pdf"


def test_create_reminder(portal):
    r = portal.create_reminder({"patient_id": 1, "reminder_type": "appointment", "title": "Appt", "body": "Reminder", "scheduled_at": datetime(2024, 1, 1, 9)})
    assert r["status"] == "pending"


def test_acknowledge_reminder(portal):
    r = portal.create_reminder({"patient_id": 1, "reminder_type": "medication", "title": "Med", "body": "Take meds", "scheduled_at": datetime(2024, 1, 1, 9)})
    ack = portal.acknowledge_reminder(r["id"])
    assert ack["status"] == "acknowledged"


def test_portal_summary(portal):
    portal.send_message({"sender_id": 1, "recipient_id": 2, "body": "Hi"})
    summary = portal.portal_summary(2)
    assert "unread_messages" in summary


def test_send_appointment_reminder(portal):
    r = portal.send_appointment_reminder(1, 5, datetime(2024, 1, 2, 9))
    assert r["reminder_type"] == "appointment"


def test_cancel_reminder(portal):
    r = portal.create_reminder({"patient_id": 1, "reminder_type": "follow_up", "title": "FU", "body": "Follow up", "scheduled_at": datetime(2024, 1, 1, 9)})
    cancelled = portal.cancel_reminder(r["id"])
    assert cancelled["status"] == "cancelled"
