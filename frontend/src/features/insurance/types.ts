export interface InsurancePlan { id: number; name: string; payer_type: string; coverage_details?: string | null; created_at?: string | null; }
export interface PatientInsurance { id: number; patient_id: number; plan_id: number; policy_number: string; group_number?: string | null; effective_date?: string | null; expiry_date?: string | null; }
export interface Claim { id: number; invoice_id: number; plan_id: number; claim_number?: string | null; status: string; amount_claimed: number; amount_approved?: number | null; submitted_at?: string | null; resolved_at?: string | null; denial_reason?: string | null; }
export interface Appeal { id: number; claim_id: number; reason: string; status: string; submitted_at?: string | null; resolved_at?: string | null; }
export interface InsurancePlanCreateInput { name: string; payer_type?: string; coverage_details?: string; }
export interface ClaimCreateInput { invoice_id: number; plan_id: number; claim_number?: string; amount_claimed: number; }
export interface AppealCreateInput { claim_id: number; reason: string; }
export interface InsuranceListParams { page?: number; per_page?: number; }
export interface InsuranceListResponse { items: InsurancePlan[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
