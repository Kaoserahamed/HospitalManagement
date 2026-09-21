from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt
from pwdlib import PasswordHash

from core.config import settings

pwd_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return pwd_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_hash.verify(plain_password, hashed_password)


def validate_password_strength(password: str) -> str | None:
    """Shared staff-password policy. Returns an error message or None.

    Policy: minimum 8 characters with at least one lowercase letter,
    one uppercase letter, and one digit.
    """
    if len(password) < 8:
        return "Password must be at least 8 characters"
    if not any(c.islower() for c in password):
        return "Password must contain a lowercase letter"
    if not any(c.isupper() for c in password):
        return "Password must contain an uppercase letter"
    if not any(c.isdigit() for c in password):
        return "Password must contain a digit"
    return None


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
