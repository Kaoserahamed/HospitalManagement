"""JWT security contract tests.

Verifies the token contract end to end: standard claim binding at issue,
issuer/audience pinning at verification, and rejection of the classic
abuse cases (expired, wrong key, foreign issuer, wrong audience, unsigned
``none`` algorithm, algorithm-confusion attempt).
"""

from datetime import UTC, datetime, timedelta

import jwt
import pytest

from core.config import settings
from core.security import create_access_token, decode_access_token


def _claims(**extra):
    claims = {
        "sub": "u-1",
        "role": "doctor",
        "type": "staff",
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
    }
    claims.update(extra)
    return claims


class TestTokenIssuance:
    def test_token_carries_standard_claims(self):
        before = datetime.now(UTC)
        token = create_access_token({"sub": "u-1", "type": "staff"})
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            issuer=settings.JWT_ISSUER,
            audience=settings.JWT_AUDIENCE,
        )
        assert payload["sub"] == "u-1"
        assert payload["iss"] == settings.JWT_ISSUER
        assert payload["aud"] == settings.JWT_AUDIENCE
        assert isinstance(payload["jti"], str) and len(payload["jti"]) == 32
        issued_at = datetime.fromtimestamp(payload["iat"], tz=UTC)
        expires = datetime.fromtimestamp(payload["exp"], tz=UTC)
        assert issued_at >= before.replace(microsecond=0) - timedelta(seconds=1)
        expected_lifetime = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        assert abs((expires - issued_at) - expected_lifetime) < timedelta(seconds=1)

    def test_tokens_are_individually_identifiable(self):
        first = create_access_token({"sub": "u-1", "type": "staff"})
        second = create_access_token({"sub": "u-1", "type": "staff"})
        assert first != second  # distinct jti -> no token replay equivalence


class TestTokenVerification:
    def test_valid_token_decodes(self):
        token = create_access_token({"sub": "u-1", "role": "doctor", "type": "staff"})
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["type"] == "staff"

    def test_wrong_signing_key_rejected(self):
        token = jwt.encode(
            _claims(exp=datetime.now(UTC) + timedelta(minutes=10)),
            "a-completely-different-secret-key",
            algorithm=settings.ALGORITHM,
        )
        assert decode_access_token(token) is None

    def test_expired_token_rejected(self):
        token = jwt.encode(
            _claims(exp=datetime.now(UTC) - timedelta(hours=1)),
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        assert decode_access_token(token) is None

    def test_foreign_issuer_rejected(self):
        token = jwt.encode(
            _claims(iss="https://evil.example.com"),
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        assert decode_access_token(token) is None

    def test_wrong_audience_rejected(self):
        token = jwt.encode(
            _claims(aud="another-system"),
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        assert decode_access_token(token) is None

    def test_unsigned_none_algorithm_rejected(self):
        token = jwt.encode(
            _claims(exp=datetime.now(UTC) + timedelta(minutes=10)),
            key="",
            algorithm="none",
        )
        assert decode_access_token(token) is None

    def test_algorithm_confusion_rejected(self):
        # Hand-crafted confusion attack: header claims RS256 while the
        # signature is HMAC-SHA256 with the shared secret — exactly what an
        # attacker does to turn an HMAC-verifier into an RSA public-key check.
        import base64
        import hashlib
        import hmac
        import json

        payload = _claims(exp=int((datetime.now(UTC) + timedelta(minutes=10)).timestamp()))

        def b64(obj: dict) -> bytes:
            return base64.urlsafe_b64encode(json.dumps(obj).encode()).rstrip(b"=")

        signing_input = b64({"alg": "RS256", "typ": "JWT"}) + b"." + b64(payload)
        signature = base64.urlsafe_b64encode(
            hmac.new(settings.SECRET_KEY.encode(), signing_input, hashlib.sha256).digest()
        ).rstrip(b"=")
        token = (signing_input + b"." + signature).decode()
        assert decode_access_token(token) is None

    def test_garbage_token_rejected(self):
        assert decode_access_token("not-a-jwt") is None
        assert decode_access_token("") is None

    @pytest.mark.parametrize("header", [{"alg": "HS384"}, {"alg": "HS512"}])
    def test_algorithm_header_mismatch_rejected(self, header):
        token = jwt.encode(
            _claims(exp=datetime.now(UTC) + timedelta(minutes=10)),
            settings.SECRET_KEY,
            algorithm=header["alg"],
            headers=header,
        )
        assert decode_access_token(token) is None
