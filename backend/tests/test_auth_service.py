"""AuthService unit tests with in-memory repositories.

Covers the authentication business rules without a database: credential
checks, account state, duplicate prevention, password changes, and token
claims.
"""

import uuid
from datetime import date

import pytest
from fastapi import HTTPException

from core.security import decode_access_token, verify_password
from models.patient import Gender, Patient
from models.user import User, UserRole
from schemas.patient import PatientCreate
from schemas.user import PasswordChange, UserCreate
from services.auth_service import AuthService


class FakeUserRepository:
    def __init__(self):
        self.users: dict[str, User] = {}
        self.by_email: dict[str, User] = {}

    async def get_by_email(self, email):
        return self.by_email.get(email)

    async def get_by_id(self, user_id):
        return self.users.get(user_id)

    async def get_all(self, limit=None, offset=0):
        values = list(self.users.values())
        return values[offset : offset + limit] if limit else values[offset:]

    async def create(self, user):
        # Emulate SQLAlchemy column defaults applied at INSERT time.
        if user.id is None:
            user.id = str(uuid.uuid4())
        if user.is_active is None:
            user.is_active = True
        self.users[user.id] = user
        self.by_email[user.email] = user
        return user

    async def update(self, user):
        self.users[user.id] = user
        return user


class FakePatientRepository:
    def __init__(self):
        self.patients: dict[str, Patient] = {}

    async def get_by_id(self, patient_id):
        return self.patients.get(patient_id)

    async def get_by_nid(self, nid):
        return next((p for p in self.patients.values() if p.nid == nid), None)

    async def get_by_phone(self, phone):
        return next((p for p in self.patients.values() if p.phone == phone), None)

    async def create(self, patient):
        if patient.id is None:
            patient.id = str(uuid.uuid4())
        if patient.is_active is None:
            patient.is_active = True
        self.patients[patient.id] = patient
        return patient

    async def update(self, patient):
        self.patients[patient.id] = patient
        return patient


def _make_user(role=UserRole.DOCTOR, email="dr@hospital.com", is_active=True) -> User:
    return User(
        id=str(uuid.uuid4()),
        email=email,
        password_hash="$argon2id$fake",
        role=role,
        first_name="Ann",
        last_name="Doctor",
        is_active=is_active,
    )


def _make_service() -> AuthService:
    return AuthService(FakeUserRepository(), FakePatientRepository())


@pytest.fixture
def service():
    return _make_service()


class TestStaffLogin:
    async def test_login_returns_staff_token(self, service, monkeypatch):
        user = _make_user()
        user.password_hash = "stored-hash"
        await service.user_repo.create(user)
        monkeypatch.setattr("services.auth_service.verify_password", lambda p, h: p == "secret")
        token_response = await service.login("dr@hospital.com", "secret")
        payload = decode_access_token(token_response.access_token)
        assert payload["type"] == "staff"
        assert payload["role"] == "doctor"
        assert payload["sub"] == user.id

    async def test_unknown_email_rejected(self, service):
        with pytest.raises(HTTPException) as exc:
            await service.login("nobody@hospital.com", "pw")
        assert exc.value.status_code == 401

    async def test_wrong_password_rejected(self, service):
        await service.user_repo.create(_make_user())
        with pytest.raises(HTTPException) as exc:
            await service.login("dr@hospital.com", "wrong")
        assert exc.value.status_code == 401

    async def test_inactive_account_rejected(self, service, monkeypatch):
        await service.user_repo.create(_make_user(is_active=False))
        monkeypatch.setattr("services.auth_service.verify_password", lambda p, h: True)
        with pytest.raises(HTTPException) as exc:
            await service.login("dr@hospital.com", "whatever")
        assert exc.value.status_code == 403


class TestAdminUserCreation:
    async def test_creates_user_with_hashed_password(self, service):
        data = UserCreate(
            email="reception@hospital.com",
            password="Welcome@123",
            role=UserRole.RECEPTIONIST,
            first_name="Rita",
            last_name="Reception",
        )
        user = await service.create_user_by_admin(data)
        assert user.email == "reception@hospital.com"
        # Plaintext must never be stored.
        assert user.password_hash != "Welcome@123"
        assert verify_password("Welcome@123", user.password_hash)

    async def test_duplicate_email_rejected(self, service):
        data = UserCreate(
            email="reception@hospital.com",
            password="Welcome@123",
            role=UserRole.RECEPTIONIST,
            first_name="Rita",
            last_name="Reception",
        )
        await service.create_user_by_admin(data)
        with pytest.raises(HTTPException) as exc:
            await service.create_user_by_admin(data)
        assert exc.value.status_code == 400
        assert "Email already registered" in exc.value.detail


class TestPasswordChange:
    async def test_wrong_current_password_rejected(self, service, monkeypatch):
        user = _make_user()
        user.password_hash = "old-hash"
        await service.user_repo.create(user)
        monkeypatch.setattr("services.auth_service.verify_password", lambda p, h: False)
        with pytest.raises(HTTPException) as exc:
            await service.change_password(
                user, PasswordChange(current_password="bad", new_password="Newpass1")
            )
        assert exc.value.status_code == 400

    async def test_short_new_password_rejected(self, service, monkeypatch):
        user = _make_user()
        user.password_hash = "old-hash"
        await service.user_repo.create(user)
        monkeypatch.setattr("services.auth_service.verify_password", lambda p, h: True)
        with pytest.raises(HTTPException) as exc:
            await service.change_password(
                user, PasswordChange.model_construct(current_password="ok", new_password="12345")
            )
        assert exc.value.status_code == 400

    async def test_successful_change_updates_hash(self, service, monkeypatch):
        user = _make_user()
        user.password_hash = "old-hash"
        await service.user_repo.create(user)
        monkeypatch.setattr("services.auth_service.verify_password", lambda p, h: p == "current")
        await service.change_password(
            user, PasswordChange(current_password="current", new_password="BrandNew1")
        )
        stored = await service.user_repo.get_by_id(user.id)
        assert verify_password("BrandNew1", stored.password_hash)


class TestSelfDeletionGuard:
    async def test_admin_cannot_delete_own_account(self, service):
        admin = _make_user(role=UserRole.ADMIN)
        await service.user_repo.create(admin)
        with pytest.raises(HTTPException) as exc:
            await service.delete_user(admin.id, current_admin_id=admin.id)
        assert exc.value.status_code == 400

    async def test_other_users_soft_deleted(self, service):
        admin = _make_user(role=UserRole.ADMIN)
        other = _make_user(role=UserRole.DOCTOR, email="other@hospital.com")
        await service.user_repo.create(admin)
        await service.user_repo.create(other)
        await service.delete_user(other.id, current_admin_id=admin.id)
        stored = await service.user_repo.get_by_id(other.id)
        assert stored.is_active is False  # soft delete, not removal


class TestPatientRegistration:
    def _patient_data(self, nid="123456789", phone="01700000000"):
        return PatientCreate(
            nid=nid,
            phone=phone,
            first_name="Ash",
            last_name="Karim",
            date_of_birth=date(1990, 1, 1),
            gender=Gender.MALE,
        )

    async def test_registration_creates_patient(self, service):
        patient = await service.register_patient(self._patient_data())
        assert patient.nid == "123456789"
        assert patient.is_active is True

    async def test_duplicate_nid_rejected(self, service):
        await service.register_patient(self._patient_data())
        with pytest.raises(HTTPException) as exc:
            await service.register_patient(self._patient_data(nid="123456789", phone="01999999999"))
        assert exc.value.status_code == 400
        assert "NID already registered" in exc.value.detail

    async def test_duplicate_phone_rejected(self, service):
        await service.register_patient(self._patient_data())
        with pytest.raises(HTTPException) as exc:
            await service.register_patient(self._patient_data(nid="999999999", phone="01700000000"))
        assert exc.value.status_code == 400
        assert "Phone number already registered" in exc.value.detail


class TestPatientLogin:
    async def _seed(self, service):
        return await service.register_patient(
            PatientCreate(
                nid="123456789",
                phone="01700000000",
                first_name="Ash",
                last_name="Karim",
                date_of_birth=date(1990, 1, 1),
                gender=Gender.MALE,
            )
        )

    async def test_patient_login_returns_patient_token(self, service):
        patient = await self._seed(service)
        token_response = await service.patient_login("123456789", "01700000000")
        payload = decode_access_token(token_response.access_token)
        assert payload["type"] == "patient"
        assert payload["sub"] == patient.id

    async def test_wrong_phone_rejected(self, service):
        await self._seed(service)
        with pytest.raises(HTTPException) as exc:
            await service.patient_login("123456789", "01888888888")
        assert exc.value.status_code == 401

    async def test_unknown_nid_rejected(self, service):
        with pytest.raises(HTTPException) as exc:
            await service.patient_login("000000000", "01700000000")
        assert exc.value.status_code == 401

    async def test_inactive_patient_rejected(self, service):
        patient = await self._seed(service)
        patient.is_active = False
        await service.patient_repo.update(patient)
        with pytest.raises(HTTPException) as exc:
            await service.patient_login("123456789", "01700000000")
        assert exc.value.status_code == 403
