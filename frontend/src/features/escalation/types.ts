export interface Escalation { id: number; source_type: string; source_id: number; patient_id: number; level: string; status: string; assigned_to?: number | null; notes?: string | null; created_at?: string | null; resolved_at?: string | null; }
export interface EscalationPolicy { id: number; name: string; description?: string | null; levels: string; is_active: boolean; created_at?: string | null; }
export interface EscalationCreateInput { source_type: string; source_id: number; patient_id: number; level?: string; assigned_to?: number; notes?: string; }
export interface EscalationUpdateInput { level?: string; status?: string; assigned_to?: number; notes?: string; }
export interface EscalationListParams { page?: number; per_page?: number; patient_id?: number; status?: string; level?: string; }
export interface EscalationListResponse { items: Escalation[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
