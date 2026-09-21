"""DoctorScheduleService unit tests."""

from datetime import date, time

import pytest
from fastapi import HTTPException

from models.appointment import AppointmentStatus
from models.doctor_schedule import DayOfWeek, DoctorSchedule
from models.user import User, UserRole
from schemas.doctor_schedule import DoctorScheduleCreate, DoctorScheduleUpdate
from services.doctor_schedule_service import DoctorScheduleService


class FakeUserRepository:
    def __init__(self, user=None):
        self.user = user

    async def get_by_id(self, user_id):
        return self.user if self.user and self.user.id == user_id else None


def _doctor(doctor_id="d-1", role=UserRole.DOCTOR):
    return User(
        id=doctor_id,
        email="doc@h.com",
        password_hash="h",
        role=role,
        first_name="Dan",
        last_name="Doc",
        is_active=True,
    )


def _schedule(schedule_id="s-1", doctor_id="d-1"):
    return DoctorSchedule(
        id=schedule_id,
        doctor_id=doctor_id,
        day_of_week=DayOfWeek.MONDAY,
        start_time=time(9, 0),
        end_time=time(10, 0),
        slot_duration=30,
        is_active=True,
    )


class FakeScheduleRepository:
    def __init__(self, schedules=None):
        self.items = {s.id: s for s in (schedules or [])}
        self.day_items = []

    async def create(self, schedule):
        if schedule.id is None:
            schedule.id = f"s-{len(self.items) + 1}"
        self.items[schedule.id] = schedule
        return schedule

    async def get_by_id(self, schedule_id):
        return self.items.get(schedule_id)

    async def update(self, schedule):
        self.items[schedule.id] = schedule
        return schedule

    async def get_by_doctor(self, doctor_id, active_only=True):
        return [s for s in self.items.values() if s.doctor_id == doctor_id]

    async def get_all(self, limit=None, offset=0):
        items = list(self.items.values())[offset:]
        return items[:limit] if limit is not None else items

    async def delete(self, schedule_id):
        return self.items.pop(schedule_id, None) is not None

    async def get_by_doctor_and_day(self, doctor_id, day):
        return [s for s in self.day_items if s.doctor_id == doctor_id]


class FakeAppointment:
    def __init__(self, appointment_date, appointment_time, status):
        self.appointment_date = appointment_date
        self.appointment_time = appointment_time
        self.status = status


class FakeAppointmentRepository:
    def __init__(self, appointments=None):
        self.appointments = appointments or []

    async def get_by_doctor(self, doctor_id):
        return self.appointments


def _create_payload(doctor_id="d-1"):
    return DoctorScheduleCreate(
        doctor_id=doctor_id,
        day_of_week=DayOfWeek.MONDAY,
        start_time=time(9, 0),
        end_time=time(10, 0),
        slot_duration=30,
    )


def _service(schedules=None, user=None, appointments=None, day_items=None):
    repo = FakeScheduleRepository(schedules)
    repo.day_items = day_items or []
    return DoctorScheduleService(
        repo, FakeUserRepository(user), FakeAppointmentRepository(appointments)
    )


class TestDoctorScheduleService:
    async def test_create_schedule_for_doctor(self):
        service = _service(user=_doctor())
        schedule = await service.create_schedule(_create_payload())
        assert schedule.doctor_id == "d-1"

    async def test_create_rejects_non_doctor(self):
        service = _service(user=_doctor(role=UserRole.RECEPTIONIST))
        with pytest.raises(HTTPException) as exc:
            await service.create_schedule(_create_payload())
        assert exc.value.status_code == 404

    async def test_create_rejects_unknown_user(self):
        service = _service(user=None)
        with pytest.raises(HTTPException) as exc:
            await service.create_schedule(_create_payload(doctor_id="ghost"))
        assert exc.value.status_code == 404

    async def test_update_schedule(self):
        service = _service(schedules=[_schedule()])
        updated = await service.update_schedule("s-1", DoctorScheduleUpdate(slot_duration=15))
        assert updated.slot_duration == 15

    async def test_update_missing_schedule(self):
        service = _service()
        with pytest.raises(HTTPException) as exc:
            await service.update_schedule("ghost", DoctorScheduleUpdate(slot_duration=15))
        assert exc.value.status_code == 404

    async def test_update_rejects_end_before_start(self):
        service = _service(schedules=[_schedule()])
        with pytest.raises(HTTPException) as exc:
            await service.update_schedule("s-1", DoctorScheduleUpdate(start_time=time(11, 0)))
        assert exc.value.status_code == 400

    async def test_get_doctor_schedules(self):
        service = _service(schedules=[_schedule("s-1", "d-1"), _schedule("s-2", "d-2")])
        assert [s.id for s in await service.get_doctor_schedules("d-1")] == ["s-1"]

    async def test_get_all_schedules_bounded(self):
        service = _service(schedules=[_schedule("s-1"), _schedule("s-2")])
        assert len(await service.get_all_schedules(limit=1)) == 1

    async def test_delete_schedule(self):
        service = _service(schedules=[_schedule()])
        assert await service.delete_schedule("s-1") is True

    async def test_available_slots_empty_without_schedule(self):
        service = _service()
        assert await service.get_available_slots("d-1", date(2026, 9, 21)) == []

    async def test_available_slots_exclude_booked(self):
        monday = date(2026, 9, 21)
        appointments = [
            FakeAppointment(monday, time(9, 0), AppointmentStatus.SCHEDULED),
            FakeAppointment(monday, time(9, 30), AppointmentStatus.CANCELLED),
        ]
        service = _service(appointments=appointments, day_items=[_schedule(doctor_id="d-1")])
        slots = await service.get_available_slots("d-1", monday)
        assert {s.time: s.available for s in slots} == {time(9, 0): False, time(9, 30): True}

    async def test_generate_time_slots(self):
        service = _service()
        assert service._generate_time_slots(time(9, 0), time(10, 0), 30) == [
            time(9, 0),
            time(9, 30),
        ]
