"""Billing repository."""

from __future__ import annotations

from backend.shared.pagination import PageParams, PageResult, paginate


class BillingRepository:
    def __init__(self) -> None:
        self._charges: dict[int, dict] = {}
        self._invoices: dict[int, dict] = {}
        self._items: dict[int, dict] = {}
        self._payments: dict[int, dict] = {}
        self._claims: dict[int, dict] = {}
        self._counters = {"charge": 0, "invoice": 0, "item": 0, "payment": 0, "claim": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    # Charges
    def create_charge(self, data: dict) -> dict:
        cid = self._next("charge")
        record = {
            "id": cid,
            **data,
            "quantity": data.get("quantity", 1),
            "total": data.get("quantity", 1) * data.get("unit_price", 0.0),
        }
        self._charges[cid] = record
        return dict(record)

    def get_charge(self, charge_id: int) -> dict | None:
        record = self._charges.get(charge_id)
        return dict(record) if record else None

    def list_charges(self, patient_id: int | None = None) -> list[dict]:
        items = list(self._charges.values())
        if patient_id is not None:
            items = [c for c in items if c.get("patient_id") == patient_id]
        return [dict(c) for c in items]

    # Invoices
    def create_invoice(self, data: dict) -> dict:
        iid = self._next("invoice")
        record = {
            "id": iid,
            **data,
            "status": data.get("status", "draft"),
            "subtotal": 0.0,
            "total": 0.0,
        }
        self._invoices[iid] = record
        return dict(record)

    def get_invoice(self, invoice_id: int) -> dict | None:
        record = self._invoices.get(invoice_id)
        return dict(record) if record else None

    def update_invoice(self, invoice_id: int, data: dict) -> dict:
        record = self._invoices.get(invoice_id)
        if record is None:
            raise KeyError(f"Invoice {invoice_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._invoices[invoice_id] = record
        return dict(record)

    def list_invoices(
        self, params: PageParams, patient_id: int | None = None, status: str | None = None
    ) -> PageResult:
        items = list(self._invoices.values())
        if patient_id is not None:
            items = [i for i in items if i.get("patient_id") == patient_id]
        if status is not None:
            items = [i for i in items if i.get("status") == status]
        total = len(items)
        page_items = items[params.offset : params.offset + params.limit]
        return paginate(page_items, params, total)

    # Invoice items
    def add_item(self, data: dict) -> dict:
        iid = self._next("item")
        record = {"id": iid, **data, "total": data.get("quantity", 1) * data.get("unit_price", 0.0)}
        self._items[iid] = record
        return dict(record)

    def list_items(self, invoice_id: int) -> list[dict]:
        return [dict(i) for i in self._items.values() if i.get("invoice_id") == invoice_id]

    # Payments
    def create_payment(self, data: dict) -> dict:
        pid = self._next("payment")
        record = {"id": pid, **data}
        self._payments[pid] = record
        return dict(record)

    def list_payments(self, invoice_id: int) -> list[dict]:
        return [dict(p) for p in self._payments.values() if p.get("invoice_id") == invoice_id]

    # Claims
    def create_claim(self, data: dict) -> dict:
        cid = self._next("claim")
        record = {"id": cid, **data, "status": data.get("status", "submitted")}
        self._claims[cid] = record
        return dict(record)

    def get_claim(self, claim_id: int) -> dict | None:
        record = self._claims.get(claim_id)
        return dict(record) if record else None

    def update_claim(self, claim_id: int, data: dict) -> dict:
        record = self._claims.get(claim_id)
        if record is None:
            raise KeyError(f"Claim {claim_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._claims[claim_id] = record
        return dict(record)

    def list_claims(self, invoice_id: int | None = None) -> list[dict]:
        items = list(self._claims.values())
        if invoice_id is not None:
            items = [c for c in items if c.get("invoice_id") == invoice_id]
        return [dict(c) for c in items]

    def count_invoices(self) -> int:
        return len(self._invoices)

    def clear(self) -> None:
        self._charges.clear()
        self._invoices.clear()
        self._items.clear()
        self._payments.clear()
        self._claims.clear()
        for k in self._counters:
            self._counters[k] = 0
