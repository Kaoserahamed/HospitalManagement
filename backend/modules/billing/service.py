"""Billing service."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Optional

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import BillingRepository
from .schemas import (
    ChargeCreate,
    ClaimCreate,
    InvoiceCreate,
    InvoiceUpdate,
    PaymentCreate,
)


class BillingService:
    def __init__(self, repository: BillingRepository | None = None) -> None:
        self.repository = repository or BillingRepository()

    def create_charge(self, data: ChargeCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if payload.get("unit_price", 0) < 0:
            raise ValidationError("unit_price cannot be negative")
        record = self.repository.create_charge(payload)
        default_bus.publish(DomainEvent(name="ChargeCreated", payload={"charge_id": record["id"]}))
        return record

    def list_charges(self, patient_id: int | None = None) -> list[dict]:
        return self.repository.list_charges(patient_id=patient_id)

    def create_invoice(self, data: InvoiceCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("invoice_number"):
            payload["invoice_number"] = f"INV-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        charge_ids = payload.pop("charge_ids", [])
        invoice = self.repository.create_invoice(payload)
        subtotal = 0.0
        for cid in charge_ids:
            charge = self.repository.get_charge(cid)
            if charge:
                item = self.repository.add_item({
                    "invoice_id": invoice["id"],
                    "charge_id": cid,
                    "description": charge["description"],
                    "quantity": charge["quantity"],
                    "unit_price": charge["unit_price"],
                })
                subtotal += item["total"]
        tax = invoice.get("tax", 0.0)
        total = subtotal + tax
        invoice = self.repository.update_invoice(invoice["id"], {"subtotal": subtotal, "total": total})
        default_bus.publish(DomainEvent(name="InvoiceGenerated", payload={"invoice_id": invoice["id"]}))
        return invoice

    def get_invoice(self, invoice_id: int) -> dict:
        record = self.repository.get_invoice(invoice_id)
        if record is None:
            raise NotFoundError("Invoice", invoice_id)
        record["items"] = self.repository.list_items(invoice_id)
        record["payments"] = self.repository.list_payments(invoice_id)
        return record

    def update_invoice(self, invoice_id: int, data: InvoiceUpdate | dict) -> dict:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        return self.repository.update_invoice(invoice_id, payload)

    def issue_invoice(self, invoice_id: int) -> dict:
        invoice = self.repository.update_invoice(invoice_id, {"status": "issued", "issued_at": datetime.utcnow()})
        default_bus.publish(DomainEvent(name="InvoiceIssued", payload={"invoice_id": invoice_id}))
        return invoice

    def cancel_invoice(self, invoice_id: int) -> dict:
        return self.repository.update_invoice(invoice_id, {"status": "cancelled"})

    def list_invoices(self, params: PageParams, patient_id: int | None = None, status: str | None = None) -> PageResult:
        return self.repository.list_invoices(params, patient_id=patient_id, status=status)

    def record_payment(self, data: PaymentCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        invoice = self.repository.get_invoice(payload["invoice_id"])
        if invoice is None:
            raise NotFoundError("Invoice", payload["invoice_id"])
        payment = self.repository.create_payment(payload)
        # update invoice status
        payments = self.repository.list_payments(payload["invoice_id"])
        paid = sum(p.get("amount", 0) for p in payments)
        total = invoice.get("total", 0)
        if paid >= total and total > 0:
            self.repository.update_invoice(payload["invoice_id"], {"status": "paid"})
        elif paid > 0:
            self.repository.update_invoice(payload["invoice_id"], {"status": "partially_paid"})
        default_bus.publish(DomainEvent(name="PaymentReceived", payload={"payment_id": payment["id"]}))
        return payment

    def list_payments(self, invoice_id: int) -> list[dict]:
        return self.repository.list_payments(invoice_id)

    def submit_claim(self, data: ClaimCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_invoice(payload["invoice_id"]) is None:
            raise NotFoundError("Invoice", payload["invoice_id"])
        record = self.repository.create_claim(payload)
        default_bus.publish(DomainEvent(name="ClaimSubmitted", payload={"claim_id": record["id"]}))
        return record

    def update_claim(self, claim_id: int, status: str, denial_reason: str | None = None) -> dict:
        payload = {"status": status}
        if status in ("denied", "rejected"):
            payload["denial_reason"] = denial_reason
            payload["resolved_at"] = datetime.utcnow()
        if status in ("paid", "approved"):
            payload["resolved_at"] = datetime.utcnow()
        return self.repository.update_claim(claim_id, payload)

    def list_claims(self, invoice_id: int | None = None) -> list[dict]:
        return self.repository.list_claims(invoice_id=invoice_id)

    def summary(self, patient_id: int | None = None) -> dict:
        invoices = self.repository.list_invoices(PageParams(page=1, per_page=100), patient_id=patient_id)
        total_invoiced = sum(i.get("total", 0) for i in invoices.items)
        paid = 0.0
        for inv in invoices.items:
            paid += sum(p.get("amount", 0) for p in self.repository.list_payments(inv["id"]))
        return {
            "total_invoiced": total_invoiced,
            "total_paid": paid,
            "total_outstanding": total_invoiced - paid,
            "invoice_count": invoices.total,
        }

    def overdue_invoices(self, days: int = 30) -> list[dict]:
        cutoff = datetime.utcnow() - timedelta(days=days)
        result = []
        for inv in self.repository.list_invoices(PageParams(page=1, per_page=100)).items:
            if inv.get("status") in ("issued", "partially_paid") and inv.get("due_date") and inv["due_date"] < cutoff:
                result.append(inv)
        return result
