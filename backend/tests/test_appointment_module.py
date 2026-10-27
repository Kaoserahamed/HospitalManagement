"""Tests for appointment module."""

import pytest
from datetime import datetime, timedelta

from backend.modules.appointment.repository import AppointmentRepository
from backend.modules.appointment.service import AppointmentService
from backend.shared.pagination import PageParams


@pytest.fixture
def service():
    return AppointmentService(repository=AppointmentRepository())


def dt(hour):
    return datetime(2024, 1, 1, hour, 0)


def test_create_appointment(service):
    data = {"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)}
    result = service.create(data)
    assert result["id"] == 1
    assert result["status"] == "scheduled"


def test_create_conflict(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    with pytest.raises(Exception):
        service.create({"patient_id": 2, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})


def test_get_appointment(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    result = service.get(1)
    assert result["doctor_id"] == 1


def test_get_not_found(service):
    with pytest.raises(Exception):
        service.get(999)


def test_cancel_appointment(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    result = service.cancel(1, "patient request")
    assert result["status"] == "cancelled"


def test_complete_appointment(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    result = service.complete(1)
    assert result["status"] == "completed"


def test_mark_no_show(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    result = service.mark_no_show(1)
    assert result["status"] == "no_show"


def test_reschedule(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    result = service.reschedule(1, dt(11), dt(12))
    assert result["start_time"] == dt(11)


def test_check_conflict(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    result = service.check_conflict({"doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    assert result["has_conflict"] is True


def test_available_slots(service):
    service.create_slot(1, dt(9), dt(10))
    slots = service.available_slots(1)
    assert len(slots) == 1


def test_book_slot(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    slot = service.create_slot(1, dt(11), dt(12))
    booked = service.book_slot(slot["id"], 1)
    assert booked["is_booked"] is True


def test_free_slot(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    slot = service.create_slot(1, dt(11), dt(12))
    service.book_slot(slot["id"], 1)
    freed = service.free_slot(slot["id"])
    assert freed["is_booked"] is False


def test_list_for_doctor(service):
    service.create({"patient_id": 1, "doctor_id": 2, "start_time": dt(9), "end_time": dt(10)})
    result = service.for_doctor(2, PageParams(page=1, per_page=10))
    assert result.total == 1


def test_list_for_patient(service):
    service.create({"patient_id": 3, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    result = service.for_patient(3, PageParams(page=1, per_page=10))
    assert result.total == 1


def test_upcoming(service):
    future = datetime.utcnow() + timedelta(days=1)
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": future, "end_time": future + timedelta(hours=1)})
    result = service.upcoming(1, PageParams(page=1, per_page=10))
    assert result.total >= 1


def test_create_invalid_times(service):
    with pytest.raises(Exception):
        service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(10), "end_time": dt(9)})


def test_create_slot_invalid(service):
    with pytest.raises(Exception):
        service.create_slot(1, dt(10), dt(9))


def test_delete_appointment(service):
    service.create({"patient_id": 1, "doctor_id": 1, "start_time": dt(9), "end_time": dt(10)})
    assert service.delete(1) is True
    with pytest.raises(Exception):
        service.get(1)
