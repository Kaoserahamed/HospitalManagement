"""Tests for report builder and risk prediction modules."""

import pytest

from backend.modules.report_builder.repository import ReportBuilderRepository
from backend.modules.report_builder.service import ReportBuilderService
from backend.modules.risk_prediction.repository import RiskPredictionRepository
from backend.modules.risk_prediction.service import RiskPredictionService


@pytest.fixture
def rb():
    return ReportBuilderService(repository=ReportBuilderRepository())


@pytest.fixture
def risk():
    return RiskPredictionService(repository=RiskPredictionRepository())


# Report builder
def test_create_template(rb):
    t = rb.create_template({"name": "Test", "query": "SELECT 1"})
    assert t["name"] == "Test"


def test_run_report(rb):
    t = rb.create_template({"name": "Run", "query": "SELECT 1"})
    export = rb.run({"template_id": t["id"], "format": "csv"})
    assert export["status"] == "completed"


def test_export_report(rb):
    t = rb.create_template({"name": "Export", "query": "SELECT 1"})
    export = rb.export({"template_id": t["id"], "format": "json"})
    assert export["status"] == "completed"


def test_create_schedule(rb):
    t = rb.create_template({"name": "Sched", "query": "SELECT 1"})
    sched = rb.create_schedule({"template_id": t["id"], "cron_expression": "0 0 * * *", "recipients": "admin@example.com"})
    assert sched["cron_expression"] == "0 0 * * *"


def test_create_dashboard(rb):
    d = rb.create_dashboard({"name": "Main", "widgets": "[]"})
    assert d["name"] == "Main"


def test_standard_templates(rb):
    templates = rb.standard_templates()
    assert len(templates) >= 4


# Risk prediction
def test_create_model(risk):
    m = risk.create_model({"name": "Readmission", "version": "1.0", "features": "[]"})
    assert m["name"] == "Readmission"


def test_create_factor(risk):
    f = risk.create_factor({"name": "age", "weight": 0.2})
    assert f["name"] == "age"


def test_evaluate_risk(risk):
    risk.create_model({"name": "Model", "version": "1.0", "features": "[]", "is_active": True})
    risk.create_factor({"name": "age", "weight": 0.2})
    result = risk.evaluate({"patient_id": 1, "features": {"age": 70}})
    assert "score" in result
    assert "risk_level" in result


def test_predict_readmission(risk):
    risk.create_model({"name": "Model2", "version": "1.0", "features": "[]", "is_active": True})
    result = risk.predict_readmission(1, features={"age": 60})
    assert result["patient_id"] == 1


def test_high_risk_patients(risk):
    risk.create_model({"name": "Model3", "version": "1.0", "features": "[]", "is_active": True})
    risk.evaluate({"patient_id": 1, "features": {"age": 80}})
    high = risk.high_risk_patients(threshold=0.1)
    assert isinstance(high, list)


def test_feature_importance(risk):
    risk.create_factor({"name": "age", "weight": 0.3})
    risk.create_factor({"name": "prior_admissions", "weight": 0.5})
    importance = risk.feature_importance()
    assert importance[0]["name"] == "prior_admissions"


def test_risk_trend(risk):
    risk.create_model({"name": "Model4", "version": "1.0", "features": "[]", "is_active": True})
    risk.evaluate({"patient_id": 1, "features": {"age": 50}})
    trend = risk.risk_trend(1)
    assert len(trend) >= 1
