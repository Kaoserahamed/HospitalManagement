"""Tests for pharmacy, billing, staff modules."""

import pytest
from datetime import datetime, date

from backend.modules.pharmacy.repository import PharmacyRepository
from backend.modules.pharmacy.service import PharmacyService
from backend.modules.billing.repository import BillingRepository
from backend.modules.billing.service import BillingService
from backend.modules.staff.repository import StaffRepository
from backend.modules.staff.service import StaffService
from backend.shared.pagination import PageParams


@pytest.fixture
def pharm():
    return PharmacyService(repository=PharmacyRepository())


@pytest.fixture
def billing():
    return BillingService(repository=BillingRepository())


@pytest.fixture
def staff():
    return StaffService(repository=StaffRepository())


# Pharmacy
def test_create_medication(pharm):
    m = pharm.create_medication({"name": "Amoxicillin", "form": "capsule"})
    assert m["name"] == "Amoxicillin"


def test_list_medications(pharm):
    pharm.create_medication({"name": "Drug1"})
    pharm.create_medication({"name": "Drug2"})
    result = pharm.list_medications(PageParams(page=1, per_page=10))
    assert result.total == 2


def test_create_stock(pharm):
    m = pharm.create_medication({"name": "Med"})
    s = pharm.create_stock({"medication_id": m["id"], "quantity": 100, "reorder_point": 10})
    assert s["quantity"] == 100


def test_low_stock(pharm):
    m = pharm.create_medication({"name": "Med2"})
    pharm.create_stock({"medication_id": m["id"], "quantity": 5, "reorder_point": 10})
    alerts = pharm.low_stock_alerts()
    assert len(alerts) == 1


def test_create_lot(pharm):
    m = pharm.create_medication({"name": "Med3"})
    lot = pharm.create_lot({"medication_id": m["id"], "lot_number": "L1", "quantity": 50, "expiry_date": date(2025, 12, 31)})
    assert lot["lot_number"] == "L1"


def test_expiring_lots(pharm):
    m = pharm.create_medication({"name": "Med4"})
    pharm.create_lot({"medication_id": m["id"], "lot_number": "L2", "quantity": 10, "expiry_date": date(2024, 1, 1)})
    lots = pharm.expiring_lots(days=3650)
    assert len(lots) >= 1


def test_create_supplier(pharm):
    s = pharm.create_supplier({"name": "Supplier A"})
    assert s["name"] == "Supplier A"


def test_dispense(pharm):
    m = pharm.create_medication({"name": "Med5"})
    pharm.create_stock({"medication_id": m["id"], "quantity": 100, "reorder_point": 10})
    disp = pharm.dispense({"prescription_id": 1, "medication_id": m["id"], "quantity": 5})
    assert disp["quantity"] == 5


def test_dispense_insufficient(pharm):
    m = pharm.create_medication({"name": "Med6"})
    pharm.create_stock({"medication_id": m["id"], "quantity": 2, "reorder_point": 10})
    with pytest.raises(Exception):
        pharm.dispense({"prescription_id": 1, "medication_id": m["id"], "quantity": 5})


def test_interaction_check(pharm):
    pharm.add_interaction("DrugA", "DrugB", "major", "Do not combine")
    result = pharm.check_interaction({"medication_a": "DrugA", "medication_b": "DrugB"})
    assert result["has_interaction"] is True


def test_allergy_conflict(pharm):
    result = pharm.check_allergy_conflict("Penicillin", ["penicillin", "aspirin"])
    assert result["has_conflict"] is True


# Billing
def test_create_charge(billing):
    c = billing.create_charge({"patient_id": 1, "code": "99213", "description": "Visit", "unit_price": 100.0})
    assert c["total"] == 100.0


def test_create_invoice(billing):
    c = billing.create_charge({"patient_id": 1, "code": "99213", "description": "Visit", "unit_price": 100.0})
    inv = billing.create_invoice({"patient_id": 1, "charge_ids": [c["id"]]})
    assert inv["subtotal"] == 100.0


def test_issue_invoice(billing):
    c = billing.create_charge({"patient_id": 1, "code": "99213", "description": "Visit", "unit_price": 50.0})
    inv = billing.create_invoice({"patient_id": 1, "charge_ids": [c["id"]]})
    issued = billing.issue_invoice(inv["id"])
    assert issued["status"] == "issued"


def test_record_payment(billing):
    c = billing.create_charge({"patient_id": 1, "code": "99213", "description": "Visit", "unit_price": 100.0})
    inv = billing.create_invoice({"patient_id": 1, "charge_ids": [c["id"]]})
    billing.issue_invoice(inv["id"])
    payment = billing.record_payment({"invoice_id": inv["id"], "amount": 100.0, "method": "cash"})
    assert payment["amount"] == 100.0


def test_invoice_paid_status(billing):
    c = billing.create_charge({"patient_id": 1, "code": "99213", "description": "Visit", "unit_price": 100.0})
    inv = billing.create_invoice({"patient_id": 1, "charge_ids": [c["id"]]})
    billing.issue_invoice(inv["id"])
    billing.record_payment({"invoice_id": inv["id"], "amount": 100.0, "method": "card"})
    updated = billing.get_invoice(inv["id"])
    assert updated["status"] == "paid"


def test_submit_claim(billing):
    c = billing.create_charge({"patient_id": 1, "code": "99213", "description": "Visit", "unit_price": 100.0})
    inv = billing.create_invoice({"patient_id": 1, "charge_ids": [c["id"]]})
    claim = billing.submit_claim({"invoice_id": inv["id"], "payer": "Acme Insurance", "amount_claimed": 100.0})
    assert claim["status"] == "submitted"


def test_billing_summary(billing):
    c = billing.create_charge({"patient_id": 1, "code": "99213", "description": "Visit", "unit_price": 100.0})
    billing.create_invoice({"patient_id": 1, "charge_ids": [c["id"]]})
    summary = billing.summary(patient_id=1)
    assert summary["invoice_count"] == 1


def test_overdue_invoices(billing):
    c = billing.create_charge({"patient_id": 1, "code": "99213", "description": "Visit", "unit_price": 100.0})
    inv = billing.create_invoice({"patient_id": 1, "charge_ids": [c["id"]]})
    billing.issue_invoice(inv["id"])
    overdue = billing.overdue_invoices(days=0)
    assert isinstance(overdue, list)


# Staff
def test_create_staff_profile(staff):
    p = staff.create_profile({"user_id": 1, "title": "Nurse"})
    assert p["title"] == "Nurse"


def test_duplicate_staff_profile(staff):
    staff.create_profile({"user_id": 1})
    with pytest.raises(Exception):
        staff.create_profile({"user_id": 1})


def test_create_shift(staff):
    staff.create_profile({"user_id": 1})
    shift = staff.create_shift({"staff_id": 1, "start_time": datetime(2024, 1, 1, 8), "end_time": datetime(2024, 1, 1, 16)})
    assert shift["staff_id"] == 1


def test_shift_conflict(staff):
    staff.create_profile({"user_id": 1})
    staff.create_shift({"staff_id": 1, "start_time": datetime(2024, 1, 1, 8), "end_time": datetime(2024, 1, 1, 16)})
    with pytest.raises(Exception):
        staff.create_shift({"staff_id": 1, "start_time": datetime(2024, 1, 1, 10), "end_time": datetime(2024, 1, 1, 12)})


def test_request_time_off(staff):
    staff.create_profile({"user_id": 1})
    req = staff.request_time_off({"staff_id": 1, "start_date": date(2024, 2, 1), "end_date": date(2024, 2, 5)})
    assert req["status"] == "pending"


def test_approve_time_off(staff):
    staff.create_profile({"user_id": 1})
    req = staff.request_time_off({"staff_id": 1, "start_date": date(2024, 2, 1), "end_date": date(2024, 2, 5)})
    approved = staff.approve_time_off(req["id"], 1)
    assert approved["status"] == "approved"


def test_list_shifts(staff):
    staff.create_profile({"user_id": 1})
    staff.create_shift({"staff_id": 1, "start_time": datetime(2024, 1, 1, 8), "end_time": datetime(2024, 1, 1, 16)})
    shifts = staff.list_shifts(staff_id=1)
    assert len(shifts) == 1


def test_coverage_gaps(staff):
    gaps = staff.coverage_gaps(1, date(2024, 1, 1))
    assert isinstance(gaps, list)


def test_staff_count(staff):
    staff.create_profile({"user_id": 1})
    assert staff.count() == 1
