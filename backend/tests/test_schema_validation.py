"""Schema-level input validation contract tests."""

import pytest
from pydantic import ValidationError

from models.user import UserRole
from schemas.user import PasswordChange, UserCreate, UserLogin


def _user_payload(**overrides):
    payload = {
        "email": "reception@hospital.com",
        "password": "Welcome@123",
        "role": UserRole.RECEPTIONIST,
        "first_name": "Rita",
        "last_name": "Reception",
    }
    payload.update(overrides)
    return payload


class TestUserCreateValidation:
    def test_valid_payload_accepted(self):
        assert UserCreate(**_user_payload()).email == "reception@hospital.com"

    def test_invalid_email_rejected(self):
        with pytest.raises(ValidationError):
            UserCreate(**_user_payload(email="not-an-email"))

    def test_role_case_insensitive(self):
        assert UserCreate(**_user_payload(role="ADMIN")).role == UserRole.ADMIN


class TestUserUpdateValidation:
    def test_none_password_accepted(self):
        from schemas.user import UserUpdate

        assert UserUpdate(first_name="Rita").password is None

    def test_weak_password_rejected(self):
        from schemas.user import UserUpdate

        with pytest.raises(ValidationError):
            UserUpdate(password="weak")


class TestUserLoginValidation:
    def test_invalid_email_rejected(self):
        with pytest.raises(ValidationError):
            UserLogin(email="not-an-email", password="whatever")

    def test_valid_login_payload_accepted(self):
        payload = UserLogin(email="dr@hospital.com", password="Secret123")
        assert payload.email == "dr@hospital.com"


class TestPasswordChangeValidation:
    def test_weak_new_password_rejected(self):
        with pytest.raises(ValidationError):
            PasswordChange(current_password="old", new_password="weak")

    def test_strong_new_password_accepted(self):
        assert (
            PasswordChange(current_password="old", new_password="NewStrong1").new_password
            == "NewStrong1"
        )

    @pytest.mark.parametrize(
        "password", ["short1A", "alllowercase1", "ALLUPPERCASE1", "NoDigitsHere"]
    )
    def test_weak_passwords_rejected(self, password):
        with pytest.raises(ValidationError):
            UserCreate(**_user_payload(password=password))

    def test_strong_password_accepted(self):
        assert UserCreate(**_user_payload(password="StrongPass1")).password == "StrongPass1"
