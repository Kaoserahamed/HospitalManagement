"""Tests for integration, patient portal, performance, rules engine, security, workflow modules."""

import pytest
from datetime import datetime

from backend.modules.integration.repository import IntegrationRepository
from backend.modules.integration.service import IntegrationService
from backend.modules.patient_portal.repository import PatientPortalRepository
from backend.modules.patient_portal.service import PatientPortalService
from backend.modules.performance.repository import PerformanceRepository
from backend.modules.performance.service import PerformanceService
from backend.modules.rules_engine.repository import RulesEngineRepository
from backend.modules.rules_engine.service import RulesEngineService
from backend.modules.security.repository import SecurityRepository
from backend.modules.security.service import SecurityService
from backend.modules.workflow.repository import WorkflowRepository
from backend.modules.workflow.service import WorkflowService


@pytest.fixture
def integration():
    return IntegrationService(repository=IntegrationRepository())


@pytest.fixture
def portal():
    return PatientPortalService(repository=PatientPortalRepository())


@pytest.fixture
def perf():
    return PerformanceService(repository=PerformanceRepository())


@pytest.fixture
def rules():
    return RulesEngineService(repository=RulesEngineRepository())


@pytest.fixture
def security():
    return SecurityService(repository=SecurityRepository())


@pytest.fixture
def workflow():
    return WorkflowService(repository=WorkflowRepository())


# Integration
def test_create_adapter(integration):
    a = integration.create_adapter({"name": "FHIR", "adapter_type": "fhir", "endpoint": "https://fhir.example.com"})
    assert a["name"] == "FHIR"


def test_sync(integration):
    a = integration.create_adapter({"name": "Sync", "adapter_type": "fhir", "endpoint": "http://fhir"})
    log = integration.sync(a["id"])
    assert log["status"] == "completed"


def test_webhook(integration):
    w = integration.create_webhook({"name": "Hook", "url": "https://example.com", "events": "test"})
    delivery = integration.trigger_webhook(w["id"], "test", {"id": 1})
    assert delivery["response_status"] == 200


# Patient portal
def test_send_message(portal):
    msg = portal.send_message({"sender_id": 1, "recipient_id": 2, "body": "Hello"})
    assert msg["status"] == "sent"


def test_unread_count(portal):
    portal.send_message({"sender_id": 1, "recipient_id": 2, "body": "Msg"})
    assert portal.unread_count(2) == 1


def test_create_reminder(portal):
    r = portal.create_reminder({"patient_id": 1, "reminder_type": "appointment", "title": "Appt", "body": "Reminder", "scheduled_at": datetime(2024, 1, 1, 9)})
    assert r["status"] == "pending"


def test_portal_summary(portal):
    portal.send_message({"sender_id": 1, "recipient_id": 2, "body": "Hi"})
    summary = portal.portal_summary(2)
    assert "unread_messages" in summary


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


# Rules engine
def test_create_rule(rules):
    r = rules.create_rule({"name": "Age check", "rule_type": "validation", "condition": "age > 18", "action": "allow", "status": "active"})
    assert r["name"] == "Age check"


def test_evaluate_rule(rules):
    r = rules.create_rule({"name": "Age", "rule_type": "validation", "condition": "age > 18", "action": "allow", "status": "active"})
    result = rules.evaluate({"rule_id": r["id"], "input_data": {"age": 25}})
    assert result["result"] == "true"


def test_create_rule_set(rules):
    r1 = rules.create_rule({"name": "R1", "rule_type": "validation", "condition": "age > 18", "action": "allow", "status": "active"})
    rs = rules.create_rule_set({"name": "Set1", "rule_ids": str(r1["id"])})
    assert rs["name"] == "Set1"


# Security
def test_setup_mfa(security):
    result = security.setup_mfa(1, method="totp")
    assert "secret" in result


def test_verify_mfa(security):
    security.setup_mfa(1)
    result = security.verify_mfa({"user_id": 1, "code": "123456"})
    assert result["verified"] is True


def test_check_permission(security):
    result = security.check_permission({"user_id": 1, "role": "admin", "resource": "patients", "action": "read"})
    assert result["allowed"] is True


def test_hash_verify_password(security):
    hashed = security.hash_password("secret123")
    assert security.verify_password("secret123", hashed) is True


# Workflow
def test_create_definition(workflow):
    d = workflow.create_definition({"name": "Onboarding", "steps": '[{"name":"Step1"},{"name":"Step2"}]'})
    assert d["name"] == "Onboarding"


def test_start_instance(workflow):
    d = workflow.create_definition({"name": "Flow", "steps": '[{"name":"A"},{"name":"B"}]'})
    inst = workflow.start_instance({"definition_id": d["id"], "entity_type": "patient", "entity_id": 1})
    assert inst["status"] == "active"


def test_advance_workflow(workflow):
    d = workflow.create_definition({"name": "Flow2", "steps": '[{"name":"A"},{"name":"B"}]'})
    inst = workflow.start_instance({"definition_id": d["id"], "entity_type": "patient", "entity_id": 1})
    advanced = workflow.advance({"instance_id": inst["id"], "action": "next"})
    assert advanced["current_step"] == 1


def test_progress(workflow):
    d = workflow.create_definition({"name": "Flow5", "steps": '[{"name":"A"},{"name":"B"}]'})
    inst = workflow.start_instance({"definition_id": d["id"], "entity_type": "patient", "entity_id": 1})
    workflow.advance({"instance_id": inst["id"], "action": "next"})
    prog = workflow.progress(inst["id"])
    assert prog["progress_percent"] == 50.0
