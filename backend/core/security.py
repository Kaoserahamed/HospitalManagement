from datetime import UTC, datetime, timedelta
from uuid import uuid4

import jwt
from jwt import InvalidTokenError
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
    """Mint a signed access token with standard claim binding.

    Every token carries ``iat``/``exp``/``iss``/``aud``/``jti`` so that
    decode-side verification can reject tokens from other issuers or
    audiences even when signed with the same key, and so tokens are
    individually identifiable (foundation for future revocation).
    """
    to_encode = data.copy()
    now = datetime.now(UTC)
    to_encode.update(
        {
            "iat": now,
            "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
            "iss": settings.JWT_ISSUER,
            "aud": settings.JWT_AUDIENCE,
            "jti": uuid4().hex,
        }
    )
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Verify and decode a token; returns None for any invalid token.

    Verification is pinned to the configured issuer, audience, and algorithm
    (which settings validation restricts to HS256/384/512), so expired,
    foreign-issuer, wrong-audience, and unsigned/none-algorithm tokens are
    all rejected here.
    """
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            issuer=settings.JWT_ISSUER,
            audience=settings.JWT_AUDIENCE,
        )
    except InvalidTokenError:
        return None
