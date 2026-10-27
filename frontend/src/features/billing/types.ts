export interface Charge { id: number; patient_id: number; encounter_id?: number | null; code: string; description: string; quantity: number; unit_price: number; total: number; created_at?: string | null; }
export interface Invoice { id: number; patient_id: number; invoice_number: string; status: string; subtotal: number; tax: number; total: number; issued_at?: string | null; due_date?: string | null; created_at?: string | null; items?: InvoiceItem[]; payments?: Payment[]; }
export interface InvoiceItem { id: number; invoice_id: number; charge_id?: number | null; description: string; quantity: number; unit_price: number; total: number; }
export interface Payment { id: number; invoice_id: number; amount: number; method: string; reference?: string | null; paid_at?: string | null; }
export interface Claim { id: number; invoice_id: number; payer: string; claim_number?: string | null; status: string; submitted_at?: string | null; resolved_at?: string | null; denial_reason?: string | null; }
export interface ChargeCreateInput { patient_id: number; encounter_id?: number; code: string; description: string; quantity?: number; unit_price: number; }
export interface InvoiceCreateInput { patient_id: number; invoice_number?: string; tax?: number; due_date?: string; charge_ids?: number[]; }
export interface PaymentCreateInput { invoice_id: number; amount: number; method?: string; reference?: string; }
export interface ClaimCreateInput { invoice_id: number; payer: string; claim_number?: string; }
export interface BillingSummary { total_invoiced: number; total_paid: number; total_outstanding: number; invoice_count: number; }
export interface InvoiceListParams { page?: number; per_page?: number; patient_id?: number; status?: string; }
export interface InvoiceListResponse { items: Invoice[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
