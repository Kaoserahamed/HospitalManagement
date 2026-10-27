"""Tests for workflow, rules engine, import/export, backup modules."""

import pytest
from datetime import datetime

from backend.modules.workflow.repository import WorkflowRepository
from backend.modules.workflow.service import WorkflowService
from backend.modules.rules_engine.repository import RulesEngineRepository
from backend.modules.rules_engine.service import RulesEngineService
from backend.modules.import_export.repository import ImportExportRepository
from backend.modules.import_export.service import ImportExportService
from backend.modules.backup.repository import BackupRepository
from backend.modules.backup.service import BackupService


@pytest.fixture
def workflow():
    return WorkflowService(repository=WorkflowRepository())


@pytest.fixture
def rules():
    return RulesEngineService(repository=RulesEngineRepository())


@pytest.fixture
def impexp():
    return ImportExportService(repository=ImportExportRepository())


@pytest.fixture
def backup():
    return BackupService(repository=BackupRepository())


# Workflow
def test_create_definition(workflow):
    d = workflow.create_definition({"name": "Onboarding", "steps": '[{"name":"Step1"},{"name":"Step2"}]'})
    assert d["name"] == "Onboarding"


def test_start_instance(workflow):
    d = workflow.create_definition({"name": "Flow", "steps": '[{"name":"A"},{"name":"B"}]'})
    inst = workflow.start_instance({"definition_id": d["id"], "entity_type": "patient", "entity_id": 1})
    assert inst["status"] == "active"
    assert len(inst["steps"]) == 2


def test_advance_workflow(workflow):
    d = workflow.create_definition({"name": "Flow2", "steps": '[{"name":"A"},{"name":"B"}]'})
    inst = workflow.start_instance({"definition_id": d["id"], "entity_type": "patient", "entity_id": 1})
    advanced = workflow.advance({"instance_id": inst["id"], "action": "next"})
    assert advanced["current_step"] == 1


def test_complete_workflow(workflow):
    d = workflow.create_definition({"name": "Flow3", "steps": '[{"name":"A"}]'})
    inst = workflow.start_instance({"definition_id": d["id"], "entity_type": "patient", "entity_id": 1})
    completed = workflow.advance({"instance_id": inst["id"], "action": "next"})
    assert completed["status"] == "completed"


def test_pause_resume(workflow):
    d = workflow.create_definition({"name": "Flow4", "steps": '[{"name":"A"},{"name":"B"}]'})
    inst = workflow.start_instance({"definition_id": d["id"], "entity_type": "patient", "entity_id": 1})
    workflow.pause(inst["id"])
    assert workflow.get_instance(inst["id"])["status"] == "paused"
    workflow.resume(inst["id"])
    assert workflow.get_instance(inst["id"])["status"] == "active"


def test_progress(workflow):
    d = workflow.create_definition({"name": "Flow5", "steps": '[{"name":"A"},{"name":"B"}]'})
    inst = workflow.start_instance({"definition_id": d["id"], "entity_type": "patient", "entity_id": 1})
    workflow.advance({"instance_id": inst["id"], "action": "next"})
    prog = workflow.progress(inst["id"])
    assert prog["progress_percent"] == 50.0


# Rules engine
def test_create_rule(rules):
    r = rules.create_rule({"name": "Age check", "rule_type": "validation", "condition": "age > 18", "action": "allow"})
    assert r["name"] == "Age check"


def test_evaluate_rule_true(rules):
    r = rules.create_rule({"name": "Age", "rule_type": "validation", "condition": "age > 18", "action": "allow", "status": "active"})
    result = rules.evaluate({"rule_id": r["id"], "input_data": {"age": 25}})
    assert result["result"] == "true"


def test_evaluate_rule_false(rules):
    r = rules.create_rule({"name": "Age2", "rule_type": "validation", "condition": "age > 18", "action": "allow", "status": "active"})
    result = rules.evaluate({"rule_id": r["id"], "input_data": {"age": 10}})
    assert result["result"] == "false"


def test_create_rule_set(rules):
    r1 = rules.create_rule({"name": "R1", "rule_type": "validation", "condition": "age > 18", "action": "allow", "status": "active"})
    r2 = rules.create_rule({"name": "R2", "rule_type": "validation", "condition": "age < 65", "action": "allow", "status": "active"})
    rs = rules.create_rule_set({"name": "Set1", "rule_ids": f"{r1['id']},{r2['id']}"})
    assert rs["name"] == "Set1"


def test_execute_rule_set(rules):
    r1 = rules.create_rule({"name": "R3", "rule_type": "validation", "condition": "age > 18", "action": "allow", "status": "active"})
    rs = rules.create_rule_set({"name": "Set2", "rule_ids": str(r1["id"])})
    results = rules.execute_rule_set(rs["id"], {"age": 25})
    assert len(results) == 1
    assert results[0]["result"] == "true"


def test_active_rules(rules):
    rules.create_rule({"name": "Active", "rule_type": "validation", "condition": "x > 0", "action": "allow", "status": "active"})
    active = rules.active_rules()
    assert len(active) >= 1


# Import/Export
def test_create_import_job(impexp):
    job = impexp.create_import_job({"entity_type": "patients", "file_name": "patients.csv"})
    assert job["status"] == "pending"


def test_process_import(impexp):
    job = impexp.create_import_job({"entity_type": "patients", "file_name": "patients.csv"})
    processed = impexp.process_import(job["id"])
    assert processed["status"] == "completed"


def test_create_export_job(impexp):
    job = impexp.create_export_job({"entity_type": "patients", "format": "csv"})
    assert job["status"] == "pending"


def test_process_export(impexp):
    job = impexp.create_export_job({"entity_type": "patients", "format": "csv"})
    processed = impexp.process_export(job["id"])
    assert processed["status"] == "completed"


def test_validate_import(impexp):
    result = impexp.validate_import("patients", [{"first_name": "John"}, {}])
    assert result["valid"] is False


def test_transform_row(impexp):
    result = impexp.transform_row("patients", {"name": "John"}, {"name": "first_name"})
    assert result["first_name"] == "John"


def test_supported_entities(impexp):
    entities = impexp.supported_entities()
    assert "patients" in entities


def test_generate_template(impexp):
    tmpl = impexp.generate_template("patients")
    assert "first_name" in tmpl


# Backup
def test_create_backup(backup):
    b = backup.create_backup({"backup_type": "full"})
    assert b["status"] == "pending"


def test_run_backup(backup):
    b = backup.create_backup({"backup_type": "full"})
    completed = backup.run_backup(b["id"])
    assert completed["status"] == "completed"
    assert completed["checksum"] is not None


def test_create_restore(backup):
    b = backup.create_backup({"backup_type": "full"})
    backup.run_backup(b["id"])
    r = backup.create_restore({"backup_id": b["id"], "target": "staging"})
    assert r["status"] == "pending"


def test_run_restore(backup):
    b = backup.create_backup({"backup_type": "full"})
    backup.run_backup(b["id"])
    r = backup.create_restore({"backup_id": b["id"], "target": "staging"})
    completed = backup.run_restore(r["id"])
    assert completed["status"] == "completed"


def test_create_schedule(backup):
    s = backup.create_schedule({"backup_type": "full", "cron_expression": "0 2 * * *", "retention_days": 30})
    assert s["cron_expression"] == "0 2 * * *"


def test_backup_stats(backup):
    b = backup.create_backup({"backup_type": "full"})
    backup.run_backup(b["id"])
    stats = backup.backup_stats()
    assert stats["completed"] == 1


def test_latest_backup(backup):
    b = backup.create_backup({"backup_type": "full"})
    backup.run_backup(b["id"])
    latest = backup.latest_backup()
    assert latest is not None
