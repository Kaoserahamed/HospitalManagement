"""Tests for remaining modules."""

import pytest
from datetime import datetime, date

from backend.modules.telemedicine.repository import TelemedicineRepository
from backend.modules.telemedicine.service import TelemedicineService
from backend.modules.analytics.repository import AnalyticsRepository
from backend.modules.analytics.service import AnalyticsService
from backend.modules.insurance.repository import InsuranceRepository
from backend.modules.insurance.service import InsuranceService
from backend.modules.audit.repository import AuditRepository
from backend.modules.audit.service import AuditService
from backend.modules.notification.repository import NotificationRepository
from backend.modules.notification.service import NotificationService
from backend.modules.queue.repository import QueueRepository
from backend.modules.queue.service import QueueService
from backend.modules.cache.repository import CacheRepository
from backend.modules.cache.service import CacheService
from backend.modules.search.service import SearchService
from backend.modules.monitoring.repository import MonitoringRepository
from backend.modules.monitoring.service import MonitoringService
from backend.modules.coding.repository import CodingRepository
from backend.modules.coding.service import CodingService
from backend.shared.pagination import PageParams


# Telemedicine
@pytest.fixture
def tele():
    return TelemedicineService(repository=TelemedicineRepository())


def test_schedule_visit(tele):
    v = tele.schedule_visit({"patient_id": 1, "doctor_id": 1, "scheduled_start": datetime(2024, 1, 1, 10), "scheduled_end": datetime(2024, 1, 1, 11)})
    assert v["status"] == "scheduled"


def test_start_end_visit(tele):
    v = tele.schedule_visit({"patient_id": 1, "doctor_id": 1, "scheduled_start": datetime(2024, 1, 1, 10), "scheduled_end": datetime(2024, 1, 1, 11)})
    tele.start_visit(v["id"])
    ended = tele.end_visit(v["id"], quality="good")
    assert ended["status"] == "completed"


def test_cancel_visit(tele):
    v = tele.schedule_visit({"patient_id": 1, "doctor_id": 1, "scheduled_start": datetime(2024, 1, 1, 10), "scheduled_end": datetime(2024, 1, 1, 11)})
    cancelled = tele.cancel_visit(v["id"])
    assert cancelled["status"] == "cancelled"


def test_waiting_room(tele):
    v = tele.schedule_visit({"patient_id": 1, "doctor_id": 1, "scheduled_start": datetime(2024, 1, 1, 10), "scheduled_end": datetime(2024, 1, 1, 11)})
    entry = tele.enter_waiting_room({"visit_id": v["id"], "patient_id": 1})
    assert entry["is_admitted"] is False
    admitted = tele.admit_patient(entry["id"])
    assert admitted["is_admitted"] is True


def test_visit_summary(tele):
    tele.schedule_visit({"patient_id": 1, "doctor_id": 1, "scheduled_start": datetime(2024, 1, 1, 10), "scheduled_end": datetime(2024, 1, 1, 11)})
    summary = tele.summary()
    assert summary["total_visits"] == 1


# Analytics
@pytest.fixture
def analytics():
    return AnalyticsService(repository=AnalyticsRepository())


def test_create_registry(analytics):
    r = analytics.create_registry({"name": "Diabetes Registry"})
    assert r["name"] == "Diabetes Registry"


def test_record_outcome(analytics):
    o = analytics.record_outcome({"patient_id": 1, "measure": "a1c", "value": 7.2})
    assert o["value"] == 7.2


def test_create_measure(analytics):
    m = analytics.create_measure({"name": "BP Control", "numerator": 80, "denominator": 100})
    assert m["numerator"] == 80


def test_compute_risk(analytics):
    r = analytics.compute_readmission_risk(1, factors={"age": 70, "prior_admissions": 2})
    assert r["risk_level"] in ("low", "medium", "high")


def test_create_report(analytics):
    r = analytics.create_report({"name": "Monthly", "report_type": "summary"})
    assert r["name"] == "Monthly"


def test_standard_reports(analytics):
    reports = analytics.standard_reports()
    assert len(reports) >= 10


# Insurance
@pytest.fixture
def insurance():
    return InsuranceService(repository=InsuranceRepository())


def test_create_plan(insurance):
    p = insurance.create_plan({"name": "Gold Plan", "payer_type": "private"})
    assert p["name"] == "Gold Plan"


def test_enroll_patient(insurance):
    p = insurance.create_plan({"name": "Silver"})
    enrolled = insurance.enroll_patient({"patient_id": 1, "plan_id": p["id"], "policy_number": "POL123"})
    assert enrolled["policy_number"] == "POL123"


def test_submit_claim(insurance):
    p = insurance.create_plan({"name": "Bronze"})
    claim = insurance.submit_claim({"invoice_id": 1, "plan_id": p["id"], "amount_claimed": 100.0})
    assert claim["status"] == "submitted"


def test_approve_claim(insurance):
    p = insurance.create_plan({"name": "Platinum"})
    claim = insurance.submit_claim({"invoice_id": 1, "plan_id": p["id"], "amount_claimed": 100.0})
    approved = insurance.approve_claim(claim["id"], 90.0)
    assert approved["status"] == "approved"


def test_file_appeal(insurance):
    p = insurance.create_plan({"name": "Basic"})
    claim = insurance.submit_claim({"invoice_id": 1, "plan_id": p["id"], "amount_claimed": 100.0})
    appeal = insurance.file_appeal({"claim_id": claim["id"], "reason": "Incorrect denial"})
    assert appeal["status"] == "pending"


# Audit
@pytest.fixture
def audit():
    return AuditService(repository=AuditRepository())


def test_record_audit(audit):
    log = audit.record({"actor_id": 1, "action": "create", "resource_type": "patient", "resource_id": 1})
    assert log["id"] == 1


def test_audit_recent(audit):
    audit.log_create(1, "patient", 1)
    audit.log_update(1, "patient", 1)
    recent = audit.recent(limit=10)
    assert len(recent) == 2


def test_audit_count(audit):
    audit.log_login(1)
    assert audit.count() == 1


# Notification
@pytest.fixture
def notif():
    return NotificationService(repository=NotificationRepository())


def test_send_notification(notif):
    n = notif.send({"recipient_id": 1, "body": "Hello"})
    assert n["status"] == "pending"


def test_send_bulk(notif):
    results = notif.send_bulk({"recipient_ids": [1, 2, 3], "body": "Bulk msg"})
    assert len(results) == 3


def test_mark_read(notif):
    n = notif.send({"recipient_id": 1, "body": "Msg"})
    read = notif.mark_read(n["id"])
    assert read["is_read"] is True


def test_unread_count(notif):
    notif.send({"recipient_id": 1, "body": "Msg1"})
    notif.send({"recipient_id": 1, "body": "Msg2"})
    assert notif.unread_count(1) == 2


def test_create_template(notif):
    t = notif.create_template({"name": "welcome", "body_template": "Hello {{name}}"})
    assert t["name"] == "welcome"


def test_render_template(notif):
    notif.create_template({"name": "greet", "body_template": "Hi {{name}}"})
    rendered = notif.render_template("greet", {"name": "Alice"})
    assert rendered["body"] == "Hi Alice"


# Queue
@pytest.fixture
def queue():
    return QueueService(repository=QueueRepository())


def test_enqueue(queue):
    t = queue.enqueue({"name": "job1"})
    assert t["status"] == "queued"


def test_dequeue(queue):
    queue.enqueue({"name": "job2"})
    task = queue.dequeue()
    assert task["status"] == "running"


def test_complete_task(queue):
    t = queue.enqueue({"name": "job3"})
    queue.dequeue()
    completed = queue.complete(t["id"])
    assert completed["status"] == "completed"


def test_fail_retry(queue):
    t = queue.enqueue({"name": "job4", "max_attempts": 2})
    queue.dequeue()
    failed = queue.fail(t["id"], "error")
    assert failed["status"] == "queued"  # retry since attempts < max
    retried = queue.retry(t["id"])
    assert retried["status"] == "queued"


def test_queue_stats(queue):
    queue.enqueue({"name": "j"})
    stats = queue.stats()
    assert stats["total"] == 1


# Cache
@pytest.fixture
def cache():
    return CacheService(repository=CacheRepository())


def test_cache_set_get(cache):
    cache.set("key1", "value1", ttl=60)
    assert cache.get("key1") == "value1"


def test_cache_delete(cache):
    cache.set("key2", "value2")
    assert cache.delete("key2") is True
    assert cache.get("key2") is None


def test_cache_increment(cache):
    assert cache.increment("counter", 1) == 1
    assert cache.increment("counter", 2) == 3


def test_cache_get_or_set(cache):
    result = cache.get_or_set("computed", lambda: 42, ttl=60)
    assert result == 42
    assert cache.get("computed") == 42


def test_cache_clear(cache):
    cache.set("a", 1)
    cache.clear()
    assert cache.size() == 0


# Search
@pytest.fixture
def search():
    return SearchService()


def test_index_and_search(search):
    search.index_document("doc1", "patient appointment scheduling")
    results = search.search("appointment")
    assert len(results) == 1


def test_search_empty(search):
    assert search.search("") == []


def test_rebuild(search):
    search.index_document("old", "old content")
    count = search.rebuild([{"id": "new1", "content": "new content"}])
    assert count == 1
    assert search.count() == 1


def test_suggest(search):
    search.index_document("doc1", "patient portal")
    suggestions = search.suggest("pat")
    assert "patient" in suggestions


# Monitoring
@pytest.fixture
def monitoring():
    return MonitoringService(repository=MonitoringRepository())


def test_register_device(monitoring):
    d = monitoring.register_device({"patient_id": 1, "device_type": "bp_cuff", "serial_number": "SN123"})
    assert d["serial_number"] == "SN123"


def test_record_reading(monitoring):
    monitoring.create_threshold({"vital_type": "heart_rate", "min_value": 60, "max_value": 100, "severity": "warning"})
    r = monitoring.record_reading({"patient_id": 1, "vital_type": "heart_rate", "value": 72.0})
    assert r["value"] == 72.0


def test_alert_on_threshold(monitoring):
    monitoring.create_threshold({"vital_type": "heart_rate", "min_value": 60, "max_value": 100, "severity": "warning"})
    monitoring.record_reading({"patient_id": 1, "vital_type": "heart_rate", "value": 120.0})
    alerts = monitoring.list_alerts(patient_id=1)
    assert len(alerts) == 1


def test_acknowledge_alert(monitoring):
    monitoring.create_threshold({"vital_type": "heart_rate", "min_value": 60, "max_value": 100})
    monitoring.record_reading({"patient_id": 1, "vital_type": "heart_rate", "value": 120.0})
    alerts = monitoring.list_alerts(patient_id=1)
    ack = monitoring.acknowledge_alert(alerts[0]["id"])
    assert ack["acknowledged"] is True


def test_latest_reading(monitoring):
    monitoring.record_reading({"patient_id": 1, "vital_type": "glucose", "value": 90.0})
    latest = monitoring.latest_reading(1, "glucose")
    assert latest["value"] == 90.0


# Coding
@pytest.fixture
def coding():
    return CodingService(repository=CodingRepository())


def test_add_code(coding):
    c = coding.add_code({"system": "icd10", "code": "I10", "description": "Hypertension"})
    assert c["code"] == "I10"


def test_lookup_code(coding):
    coding.add_code({"system": "icd10", "code": "E11.9", "description": "Diabetes"})
    result = coding.lookup("icd10", "E11.9")
    assert result["description"] == "Diabetes"


def test_validate_code(coding):
    coding.add_code({"system": "cpt", "code": "99213", "description": "Visit"})
    result = coding.validate_code("cpt", "99213")
    assert result["valid"] is True


def test_search_codes(coding):
    coding.add_code({"system": "icd10", "code": "J06.9", "description": "URI"})
    results = coding.search({"query": "URI"})
    assert len(results) >= 1


def test_add_mapping(coding):
    coding.add_code({"system": "icd10", "code": "I10", "description": "HTN"})
    mapping = coding.add_mapping({"source_system": "icd10", "source_code": "I10", "target_system": "cpt", "target_code": "99213"})
    assert mapping["target_code"] == "99213"


def test_add_encounter_code(coding):
    ec = coding.add_encounter_code({"encounter_id": 1, "system": "icd10", "code": "I10"})
    assert ec["encounter_id"] == 1


def test_list_encounter_codes(coding):
    coding.add_encounter_code({"encounter_id": 2, "system": "icd10", "code": "E11.9"})
    codes = coding.list_encounter_codes(2)
    assert len(codes) == 1


def test_common_codes(coding):
    icd = coding.common_icd10()
    cpt = coding.common_cpt()
    assert len(icd) >= 5
    assert len(cpt) >= 5
