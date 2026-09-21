"""AppointmentService unit tests with in-memory repositories.

Covers booking validation (patient/doctor/department state, doctor-department
consistency, schedule availability, slot conflicts), reschedule rules,
status transitions, and cancellation guards.
"""

from datetime import date, time
from uuid import uuid4

import pytest
from fastapi import HTTPException

from models.appointment import Appointment, AppointmentStatus
from models.user import User, UserRole
from schemas.schemas import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentUpdate,
)
from services.appointment_service import AppointmentService


class FakeAppointmentRepository:
    def __init__(self):
        self.items: dict[str, Appointment] = {}
        self.conflict: Appointment | None = None

    async def get_by_id(self, appointment_id):
        return self.items.get(appointment_id)

    async def check_conflict(
        self,
        doctor_id,
        appointment_date,
        appointment_time,
        exclude_appointment_id=None,
    ):
        if self.conflict and self.conflict.id != exclude_appointment_id:
            return self.conflict
        for apt in self.items.values():
            if apt.id == exclude_appointment_id:
                continue
            if (
                apt.doctor_id == doctor_id
                and apt.appointment_date == appointment_date
                and apt.appointment_time == appointment_time
                and apt.status in (AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED)
            ):
                return apt
        return None

    async def create(self, appointment):
        if appointment.id is None:
            appointment.id = str(uuid4())
        self.items[appointment.id] = appointment
        return appointment

    async def update(self, appointment):
        self.items[appointment.id] = appointment
        return appointment


class FakeUserRepository:
    def __init__(self, user: User | None):
        self.user = user

    async def get_by_id(self, user_id):
        return self.user if self.user and self.user.id == user_id else None


class FakeDepartmentRepository:
    def __init__(self, department):
        self.department = department

    async def get_by_id(self, department_id):
        return self.department if self.department and self.department.id == department_id else None


class FakeDoctorRepository:
    def __init__(self, profile):
        self.profile = profile

    async def get_by_user_id(self, user_id):
        return self.profile


class FakeScheduleRepository:
    def __init__(self, schedules=None):
        self.schedules = schedules or []

    async def get_by_doctor_and_day(self, doctor_id, day_of_week):
        return self.schedules


class FakePatientRepository:
    def __init__(self, patient=None):
        self.patient = patient

    async def get_by_id(self, patient_id):
        return self.patient


def _build_service(
    patient=None,
    doctor=None,
    department=None,
    doctor_profile=None,
    schedules=None,
    repo=None,
):
    return AppointmentService(
        appointment_repo=repo or FakeAppointmentRepository(),
        user_repo=FakeUserRepository(doctor),
        department_repo=FakeDepartmentRepository(department),
        doctor_repo=FakeDoctorRepository(doctor_profile),
        schedule_repo=FakeScheduleRepository(schedules),
        patient_repo=FakePatientRepository(patient),
    )


def _patient(patient_id="p-1"):
    from models.patient import Gender, Patient

    return Patient(
        id=patient_id,
        nid="123456789",
        phone="01700000000",
        first_name="Ash",
        last_name="Karim",
        date_of_birth=date(1990, 1, 1),
        gender=Gender.MALE,
    )


def _doctor(doctor_id="d-1", is_active=True, role=UserRole.DOCTOR):
    return User(
        id=doctor_id,
        email="dr@hospital.com",
        password_hash="h",
        role=role,
        first_name="Ann",
        last_name="Doctor",
        is_active=is_active,
    )


def _department(department_id="dept-1", is_active=True):
    from models.department import Department

    return Department(id=department_id, name="Cardiology", is_active=is_active)


def _booking_data(doctor_id="d-1", department_id="dept-1"):
    return AppointmentCreate(
        doctor_id=doctor_id,
        department_id=department_id,
        appointment_date=date(2030, 5, 1),
        appointment_time=time(10, 0),
        reason="Chest pain",
    )


class TestBookingValidation:
    async def test_books_happy_path(self):
        schedule = type("S", (), {"start_time": time(9, 0), "end_time": time(17, 0)})()
        service = _build_service(
            patient=_patient(),
            doctor=_doctor(),
            department=_department(),
            schedules=[schedule],
        )
        appointment = await service.create_appointment("p-1", _booking_data())
        assert appointment.status == AppointmentStatus.SCHEDULED
        assert appointment.patient_id == "p-1"
        assert appointment.reason == "Chest pain"

    async def test_unknown_patient_rejected(self):
        service = _build_service(doctor=_doctor(), department=_department())
        with pytest.raises(HTTPException) as exc:
            await service.create_appointment("ghost", _booking_data())
        assert exc.value.status_code == 404

    async def test_doctor_role_enforced(self):
        # An admin account passed as doctor_id must not be bookable.
        impostor = _doctor(doctor_id="d-1", role=UserRole.ADMIN)
        service = _build_service(patient=_patient(), doctor=impostor, department=_department())
        with pytest.raises(HTTPException) as exc:
            await service.create_appointment("p-1", _booking_data())
        assert exc.value.status_code == 404

    async def test_inactive_doctor_rejected(self):
        service = _build_service(
            patient=_patient(),
            doctor=_doctor(is_active=False),
            department=_department(),
        )
        with pytest.raises(HTTPException) as exc:
            await service.create_appointment("p-1", _booking_data())
        assert exc.value.status_code == 400
        assert "not active" in exc.value.detail

    async def test_inactive_department_rejected(self):
        service = _build_service(
            patient=_patient(),
            doctor=_doctor(),
            department=_department(is_active=False),
        )
        with pytest.raises(HTTPException) as exc:
            await service.create_appointment("p-1", _booking_data())
        assert exc.value.status_code == 400
        assert "not active" in exc.value.detail

    async def test_doctor_department_mismatch_rejected(self):
        # A doctor registered under Cardiology cannot be booked in Neurology.
        from models.doctor import DoctorProfile

        profile = DoctorProfile(user_id="d-1", department_id="other-dept")
        service = _build_service(
            patient=_patient(),
            doctor=_doctor(),
            department=_department(),
            doctor_profile=profile,
        )
        with pytest.raises(HTTPException) as exc:
            await service.create_appointment("p-1", _booking_data())
        assert exc.value.status_code == 400
        assert "does not belong" in exc.value.detail

    async def test_outside_working_hours_rejected(self):
        schedules = [type("S", (), {"start_time": time(14, 0), "end_time": time(18, 0)})()]
        service = _build_service(
            patient=_patient(),
            doctor=_doctor(),
            department=_department(),
            schedules=schedules,
        )
        with pytest.raises(HTTPException) as exc:
            await service.create_appointment("p-1", _booking_data())
        assert exc.value.status_code == 400
        assert "working hours" in exc.value.detail

    async def test_double_booking_rejected(self):
        repo = FakeAppointmentRepository()
        repo.conflict = Appointment(
            id="a-conflict",
            doctor_id="d-1",
            appointment_date=date(2030, 5, 1),
            appointment_time=time(10, 0),
            status=AppointmentStatus.SCHEDULED,
        )
        schedule = type("S", (), {"start_time": time(9, 0), "end_time": time(17, 0)})()
        service = _build_service(
            patient=_patient(),
            doctor=_doctor(),
            department=_department(),
            schedules=[schedule],
            repo=repo,
        )
        with pytest.raises(HTTPException) as exc:
            await service.create_appointment("p-1", _booking_data())
        assert exc.value.status_code == 409
        assert "already booked" in exc.value.detail


class TestUpdateRules:
    async def _seed(self, status=AppointmentStatus.SCHEDULED):
        appointment = Appointment(
            id="a-1",
            patient_id="p-1",
            doctor_id="d-1",
            department_id="dept-1",
            appointment_date=date(2030, 5, 1),
            appointment_time=time(10, 0),
            status=status,
        )
        repo = FakeAppointmentRepository()
        repo.items["a-1"] = appointment
        return _build_service(repo=repo), repo

    async def test_completed_appointment_frozen(self):
        service, _ = await self._seed(AppointmentStatus.COMPLETED)
        with pytest.raises(HTTPException) as exc:
            await service.update_appointment("a-1", AppointmentUpdate(notes="x"))
        assert exc.value.status_code == 400
        assert "completed" in exc.value.detail

    async def test_cancelled_appointment_frozen(self):
        service, _ = await self._seed(AppointmentStatus.CANCELLED)
        with pytest.raises(HTTPException) as exc:
            await service.update_appointment("a-1", AppointmentUpdate(notes="x"))
        assert exc.value.status_code == 400

    async def test_reschedule_checks_conflicts(self):
        service, repo = await self._seed()
        repo.conflict = Appointment(
            doctor_id="d-1",
            appointment_date=date(2030, 6, 1),
            appointment_time=time(11, 0),
            status=AppointmentStatus.SCHEDULED,
        )
        with pytest.raises(HTTPException) as exc:
            await service.update_appointment(
                "a-1",
                AppointmentUpdate(appointment_date=date(2030, 6, 1), appointment_time=time(11, 0)),
            )
        assert exc.value.status_code == 409

    async def test_notes_update_allowed(self):
        service, _ = await self._seed()
        updated = await service.update_appointment("a-1", AppointmentUpdate(notes="bring reports"))
        assert updated.notes == "bring reports"

    async def test_unknown_appointment_rejected(self):
        service = _build_service()
        with pytest.raises(HTTPException) as exc:
            await service.update_appointment("ghost", AppointmentUpdate())
        assert exc.value.status_code == 404


class TestStatusAndCancellation:
    async def _seed(self, status=AppointmentStatus.SCHEDULED):
        appointment = Appointment(
            id="a-1",
            patient_id="p-1",
            doctor_id="d-1",
            department_id="dept-1",
            appointment_date=date(2030, 5, 1),
            appointment_time=time(10, 0),
            status=status,
        )
        repo = FakeAppointmentRepository()
        repo.items["a-1"] = appointment
        return _build_service(repo=repo), repo

    async def test_status_transition(self):
        service, _ = await self._seed()
        updated = await service.update_status(
            "a-1", AppointmentStatusUpdate(status=AppointmentStatus.CONFIRMED)
        )
        assert updated.status == AppointmentStatus.CONFIRMED

    async def test_completed_appointment_cannot_be_cancelled(self):
        service, _ = await self._seed(AppointmentStatus.COMPLETED)
        with pytest.raises(HTTPException) as exc:
            await service.cancel_appointment("a-1", "p-1", "patient")
        assert exc.value.status_code == 400
        assert "Cannot cancel completed" in exc.value.detail

    async def test_scheduled_appointment_can_be_cancelled(self):
        service, _ = await self._seed()
        cancelled = await service.cancel_appointment("a-1", "p-1", "patient")
        assert cancelled.status == AppointmentStatus.CANCELLED

    async def test_cancel_unknown_rejected(self):
        service = _build_service()
        with pytest.raises(HTTPException) as exc:
            await service.cancel_appointment("ghost", "p-1", "patient")
        assert exc.value.status_code == 404
