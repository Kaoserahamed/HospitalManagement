"""DepartmentService unit tests."""

import pytest
from fastapi import HTTPException

from models.department import Department
from models.doctor import DoctorProfile
from models.user import User, UserRole
from schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
    DoctorAssignmentRequest,
)
from services.department_service import DepartmentService


class FakeDepartmentRepository:
    def __init__(self, departments=None):
        self.items = {d.id: d for d in (departments or [])}

    async def get_by_id(self, department_id):
        return self.items.get(department_id)

    async def get_by_name(self, name):
        return next((d for d in self.items.values() if d.name == name), None)

    async def get_all(self, active_only=False):
        items = list(self.items.values())
        return [d for d in items if d.is_active] if active_only else items

    async def create(self, department):
        if department.id is None:
            department.id = f"dept-{len(self.items) + 1}"
        self.items[department.id] = department
        return department

    async def update(self, department):
        self.items[department.id] = department
        return department


class FakeDoctorRepository:
    def __init__(self, profile=None):
        self.profile = profile

    async def get_by_user_id(self, user_id):
        return self.profile

    async def update(self, profile):
        return profile

    async def create(self, profile):
        profile.id = "profile-new"
        return profile

    async def get_all_doctors(self):
        return []


class FakeUserRepository:
    def __init__(self, user=None):
        self.user = user

    async def get_by_id(self, user_id):
        return self.user if self.user and self.user.id == user_id else None


def _dept(dept_id="dept-1", name="Cardiology", is_active=True):
    return Department(id=dept_id, name=name, is_active=is_active)


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


def _department_service(departments=None, profile=None, user=None):
    return DepartmentService(
        FakeDepartmentRepository(departments),
        FakeDoctorRepository(profile),
        FakeUserRepository(user),
    )


class TestDepartmentService:
    async def test_create_department(self):
        service = _department_service()
        dept = await service.create_department(
            DepartmentCreate(name="Neurology", description="Nervous system")
        )
        assert dept.name == "Neurology"
        assert dept.is_active is True

    async def test_duplicate_name_rejected(self):
        service = _department_service(departments=[_dept(name="Cardiology")])
        with pytest.raises(HTTPException) as exc:
            await service.create_department(DepartmentCreate(name="Cardiology"))
        assert exc.value.status_code == 400

    async def test_update_department(self):
        service = _department_service(departments=[_dept()])
        updated = await service.update_department(
            "dept-1", DepartmentUpdate(description="Heart care", is_active=False)
        )
        assert updated.description == "Heart care"
        assert updated.is_active is False

    async def test_assign_doctor_updates_existing_profile(self):
        profile = DoctorProfile(user_id="d-1", department_id=None)
        service = _department_service(departments=[_dept()], profile=profile, user=_doctor())
        assigned = await service.assign_doctor_to_department(
            DoctorAssignmentRequest(
                user_id="d-1", department_id="dept-1", specialization="Interventional"
            )
        )
        assert assigned.department_id == "dept-1"
        assert assigned.specialization == "Interventional"

    async def test_assign_non_doctor_rejected(self):
        service = _department_service(
            departments=[_dept()], user=_doctor(role=UserRole.RECEPTIONIST)
        )
        with pytest.raises(HTTPException) as exc:
            await service.assign_doctor_to_department(
                DoctorAssignmentRequest(user_id="d-1", department_id="dept-1")
            )
        assert exc.value.status_code == 400
        assert "not a doctor" in exc.value.detail

    async def test_assign_unknown_user_rejected(self):
        service = _department_service(departments=[_dept()])
        with pytest.raises(HTTPException) as exc:
            await service.assign_doctor_to_department(
                DoctorAssignmentRequest(user_id="ghost", department_id="dept-1")
            )
        assert exc.value.status_code == 404

    async def test_assign_to_inactive_department_rejected(self):
        service = _department_service(departments=[_dept(is_active=False)], user=_doctor())
        with pytest.raises(HTTPException) as exc:
            await service.assign_doctor_to_department(
                DoctorAssignmentRequest(user_id="d-1", department_id="dept-1")
            )
        assert exc.value.status_code == 400
        assert "inactive department" in exc.value.detail

    async def test_remove_doctor_from_department(self):
        profile = DoctorProfile(user_id="d-1", department_id="dept-1")
        service = _department_service(profile=profile)
        removed = await service.remove_doctor_from_department("d-1")
        assert removed.department_id is None

    async def test_remove_unknown_profile_rejected(self):
        service = _department_service(profile=None)
        with pytest.raises(HTTPException) as exc:
            await service.remove_doctor_from_department("ghost")
        assert exc.value.status_code == 404

    async def test_doctor_department_lookup_none_when_unassigned(self):
        service = _department_service(profile=DoctorProfile(user_id="d-1"))
        assert await service.get_doctor_department("d-1") is None

    async def test_doctor_department_resolves_assigned(self):
        service = _department_service(
            departments=[_dept()],
            profile=DoctorProfile(user_id="d-1", department_id="dept-1"),
        )
        assert (await service.get_doctor_department("d-1")).name == "Cardiology"

    async def test_update_to_taken_name_rejected(self):
        service = _department_service(
            departments=[_dept("dept-1", "Cardiology"), _dept("dept-2", "Neurology")]
        )
        with pytest.raises(HTTPException) as exc:
            await service.update_department("dept-1", DepartmentUpdate(name="Neurology"))
        assert exc.value.status_code == 400

    async def test_unknown_department_rejected(self):
        service = _department_service()
        with pytest.raises(HTTPException) as exc:
            await service.update_department("ghost", DepartmentUpdate(name="X"))
        assert exc.value.status_code == 404

    async def test_get_unknown_department_rejected(self):
        service = _department_service()
        with pytest.raises(HTTPException) as exc:
            await service.get_department("ghost")
        assert exc.value.status_code == 404
