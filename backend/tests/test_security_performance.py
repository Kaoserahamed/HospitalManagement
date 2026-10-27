"""Tests for security and performance modules."""

import pytest

from backend.modules.security.repository import SecurityRepository
from backend.modules.security.service import SecurityService
from backend.modules.performance.repository import PerformanceRepository
from backend.modules.performance.service import PerformanceService


@pytest.fixture
def security():
    return SecurityService(repository=SecurityRepository())


@pytest.fixture
def perf():
    return PerformanceService(repository=PerformanceRepository())


# Security
def test_setup_mfa(security):
    result = security.setup_mfa(1, method="totp")
    assert "secret" in result
    assert "backup_codes" in result


def test_verify_mfa(security):
    security.setup_mfa(1)
    result = security.verify_mfa({"user_id": 1, "code": "123456"})
    assert result["verified"] is True
    assert result["status"] == "enabled"


def test_mfa_status(security):
    security.setup_mfa(1)
    status = security.mfa_status(1)
    assert status["status"] == "pending"
    security.verify_mfa({"user_id": 1, "code": "123456"})
    status = security.mfa_status(1)
    assert status["status"] == "enabled"


def test_disable_mfa(security):
    security.setup_mfa(1)
    security.verify_mfa({"user_id": 1, "code": "123456"})
    result = security.disable_mfa(1)
    assert result["status"] == "disabled"


def test_link_sso(security):
    link = security.link_sso({"user_id": 1, "provider": "saml", "external_id": "ext-123"})
    assert link["provider"] == "saml"


def test_get_sso_links(security):
    security.link_sso({"user_id": 1, "provider": "oidc", "external_id": "ext-456"})
    links = security.get_sso_links(1)
    assert len(links) == 1


def test_unlink_sso(security):
    security.link_sso({"user_id": 1, "provider": "saml", "external_id": "ext-789"})
    assert security.unlink_sso(1, "saml") is True
    assert len(security.get_sso_links(1)) == 0


def test_record_security_event(security):
    event = security.record_event({"user_id": 1, "event_type": "login", "severity": "info"})
    assert event["event_type"] == "login"


def test_create_encryption_key(security):
    key = security.create_encryption_key({"key_id": "key-1", "algorithm": "AES-256", "purpose": "phi"})
    assert key["key_id"] == "key-1"


def test_get_active_key(security):
    security.create_encryption_key({"key_id": "key-2", "algorithm": "AES-256", "purpose": "general", "is_active": True})
    key = security.get_active_key("general")
    assert key["purpose"] == "general"


def test_check_permission(security):
    result = security.check_permission({"user_id": 1, "role": "admin", "resource": "patients", "action": "read"})
    assert result["allowed"] is True
    result = security.check_permission({"user_id": 2, "role": "patient", "resource": "patients", "action": "write"})
    assert result["allowed"] is False


def test_hash_verify_password(security):
    hashed = security.hash_password("secret123")
    assert security.verify_password("secret123", hashed) is True
    assert security.verify_password("wrong", hashed) is False


def test_generate_validate_token(security):
    token = security.generate_token(1, expiry_minutes=60)
    payload = security.validate_token(token)
    assert payload["sub"] == "1"


def test_encrypt_decrypt(security):
    encrypted = security.encrypt_field("hello", "key-1")
    decrypted = security.decrypt_field(encrypted, "key-1")
    assert decrypted == "hello"


def test_security_summary(security):
    security.setup_mfa(1)
    summary = security.security_summary()
    assert "mfa_enabled_users" in summary


# Performance
def test_record_metric(perf):
    m = perf.record_metric({"endpoint": "/api/patients", "method": "GET", "duration_ms": 120.5, "status_code": 200})
    assert m["endpoint"] == "/api/patients"


def test_summary(perf):
    perf.record_metric({"endpoint": "/api/patients", "method": "GET", "duration_ms": 100, "status_code": 200})
    perf.record_metric({"endpoint": "/api/patients", "method": "GET", "duration_ms": 200, "status_code": 200})
    summary = perf.summary()
    assert len(summary) == 1
    assert summary[0]["request_count"] == 2


def test_slowest_endpoints(perf):
    perf.record_metric({"endpoint": "/api/slow", "method": "GET", "duration_ms": 500, "status_code": 200})
    perf.record_metric({"endpoint": "/api/fast", "method": "GET", "duration_ms": 50, "status_code": 200})
    slowest = perf.slowest_endpoints(limit=1)
    assert slowest[0]["endpoint"] == "/api/slow"


def test_record_slow_query(perf):
    q = perf.record_slow_query({"query": "SELECT * FROM patients", "duration_ms": 1500.0})
    assert q["duration_ms"] == 1500.0


def test_top_slow_queries(perf):
    perf.record_slow_query({"query": "Q1", "duration_ms": 1000.0})
    perf.record_slow_query({"query": "Q2", "duration_ms": 2000.0})
    top = perf.top_slow_queries(limit=1)
    assert top[0]["duration_ms"] == 2000.0


def test_record_cache_stats(perf):
    cs = perf.record_cache_stats({"cache_name": "patient_cache", "hits": 80, "misses": 20, "evictions": 5})
    assert cs["hits"] == 80


def test_cache_hit_rate(perf):
    perf.record_cache_stats({"cache_name": "test_cache", "hits": 80, "misses": 20, "evictions": 0})
    rate = perf.cache_hit_rate("test_cache")
    assert rate == 0.8


def test_profile_function(perf):
    result = perf.profile_function("calculate", 10, 500.0)
    assert result["avg_time_ms"] == 50.0


def test_clear(perf):
    perf.record_metric({"endpoint": "/api/x", "method": "GET", "duration_ms": 10, "status_code": 200})
    perf.clear()
    summary = perf.summary()
    assert len(summary) == 0
