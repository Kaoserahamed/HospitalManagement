"""Authentication/authorization guard tests.

``get_current_user`` / ``get_current_patient`` are exercised directly with
real signed tokens and fake repositories, proving the token contract:
token-type separation, identity lookup, and account-state checks.
"""

from uuid import uuid4

import pytest
from fastapi import HTTPException

from core.security import create_access_token
from dependencies.auth import (
    get_current_patient,
    get_current_user,
    require_staff_or_patient,
)
from models.user import User, UserRole


class FakeUserRepository:
    def __init__(self, user: User | None = None):
        self.user = user

    async def get_by_id(self, user_id):
        return self.user if self.user and self.user.id == user_id else None


class FakePatientRepository:
    def __init__(self, patient=None):
        self.patient = patient

    async def get_by_id(self, patient_id):
        return self.patient if self.patient and self.patient.id == patient_id else None


def _make_user(user_id="u-1", is_active=True, role=UserRole.DOCTOR) -> User:
    return User(
        id=user_id,
        email="doc@hospital.com",
        password_hash="h",
        role=role,
        first_name="Dan",
        last_name="Doc",
        is_active=is_active,
    )


def _make_patient(patient_id="p-1", is_active=True):
    from datetime import date

    from models.patient import Gender, Patient

    return Patient(
        id=patient_id,
        nid="123456789",
        phone="01700000000",
        first_name="Ash",
        last_name="Karim",
        date_of_birth=date(1990, 1, 1),
        gender=Gender.MALE,
        is_active=is_active,
    )


class TestStaffGuard:
    async def test_valid_staff_token_returns_user(self):
        user = _make_user()
        token = create_access_token({"sub": user.id, "role": "doctor", "type": "staff"})
        result = await get_current_user(token, FakeUserRepository(user))
        assert result is user

    async def test_garbage_token_rejected(self):
        with pytest.raises(HTTPException) as exc:
            await get_current_user("not-a-jwt", FakeUserRepository())
        assert exc.value.status_code == 401

    async def test_expired_token_rejected(self):
        from datetime import UTC, datetime, timedelta

        from jose import jwt

        from core.config import settings

        token = jwt.encode(
            {
                "sub": "u-1",
                "role": "doctor",
                "type": "staff",
                "exp": datetime.now(UTC) - timedelta(hours=1),
            },
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        with pytest.raises(HTTPException) as exc:
            await get_current_user(token, FakeUserRepository(_make_user()))
        assert exc.value.status_code == 401

    async def test_token_without_subject_rejected(self):
        token = create_access_token({"type": "staff"})
        with pytest.raises(HTTPException) as exc:
            await get_current_user(token, FakeUserRepository())
        assert exc.value.status_code == 401

    async def test_patient_token_on_staff_guard_forbidden(self):
        # A patient token must never grant staff endpoints (privilege
        # escalation guard).
        token = create_access_token({"sub": "p-1", "type": "patient"})
        with pytest.raises(HTTPException) as exc:
            await get_current_user(token, FakeUserRepository())
        assert exc.value.status_code == 403

    async def test_unknown_user_rejected(self):
        token = create_access_token({"sub": "ghost", "role": "doctor", "type": "staff"})
        with pytest.raises(HTTPException) as exc:
            await get_current_user(token, FakeUserRepository(None))
        assert exc.value.status_code == 401

    async def test_inactive_user_forbidden(self):
        user = _make_user(is_active=False)
        token = create_access_token({"sub": user.id, "role": "doctor", "type": "staff"})
        with pytest.raises(HTTPException) as exc:
            await get_current_user(token, FakeUserRepository(user))
        assert exc.value.status_code == 403


class TestPatientGuard:
    async def test_valid_patient_token_returns_patient(self):
        patient = _make_patient()
        token = create_access_token({"sub": patient.id, "type": "patient"})
        result = await get_current_patient(token, FakePatientRepository(patient))
        assert result is patient

    async def test_staff_token_on_patient_guard_forbidden(self):
        # A staff token must never grant patient endpoints.
        token = create_access_token({"sub": "u-1", "role": "admin", "type": "staff"})
        with pytest.raises(HTTPException) as exc:
            await get_current_patient(token, FakePatientRepository())
        assert exc.value.status_code == 403

    async def test_garbage_token_rejected(self):
        with pytest.raises(HTTPException) as exc:
            await get_current_patient("junk", FakePatientRepository())
        assert exc.value.status_code == 401

    async def test_unknown_patient_rejected(self):
        token = create_access_token({"sub": "ghost", "type": "patient"})
        with pytest.raises(HTTPException) as exc:
            await get_current_patient(token, FakePatientRepository(None))
        assert exc.value.status_code == 401

    async def test_inactive_patient_forbidden(self):
        patient = _make_patient(is_active=False)
        token = create_access_token({"sub": patient.id, "type": "patient"})
        with pytest.raises(HTTPException) as exc:
            await get_current_patient(token, FakePatientRepository(patient))
        assert exc.value.status_code == 403


class TestStaffOrPatientGuard:
    async def test_staff_identity_accepted(self):
        user = _make_user()
        token = create_access_token({"sub": user.id, "role": "doctor", "type": "staff"})
        identity = await require_staff_or_patient(
            token, FakeUserRepository(user), FakePatientRepository()
        )
        assert identity is user

    async def test_patient_identity_accepted(self):
        patient = _make_patient()
        token = create_access_token({"sub": patient.id, "type": "patient"})
        identity = await require_staff_or_patient(
            token, FakeUserRepository(), FakePatientRepository(patient)
        )
        assert identity is patient

    async def test_invalid_token_rejected(self):
        with pytest.raises(HTTPException) as exc:
            await require_staff_or_patient("junk", FakeUserRepository(), FakePatientRepository())
        assert exc.value.status_code == 401

    async def test_deleted_identity_rejected(self):
        # A valid signed token for a since-removed account must not grant
        # access (no dangling identity acceptance).
        token = create_access_token({"sub": str(uuid4()), "type": "patient"})
        with pytest.raises(HTTPException) as exc:
            await require_staff_or_patient(token, FakeUserRepository(), FakePatientRepository(None))
        assert exc.value.status_code == 401

    async def test_inactive_identity_rejected(self):
        user = _make_user(is_active=False)
        token = create_access_token({"sub": user.id, "role": "doctor", "type": "staff"})
        with pytest.raises(HTTPException) as exc:
            await require_staff_or_patient(token, FakeUserRepository(user), FakePatientRepository())
        assert exc.value.status_code == 401
