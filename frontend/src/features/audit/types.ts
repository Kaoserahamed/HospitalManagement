export interface AuditLog { id: number; actor_id?: number | null; action: string; resource_type: string; resource_id?: number | null; severity: string; ip_address?: string | null; occurred_at?: string | null; }
export interface AuditQuery { actor_id?: number; action?: string; resource_type?: string; resource_id?: number; severity?: string; from_date?: string; to_date?: string; page?: number; per_page?: number; }
export interface AuditListParams { page?: number; per_page?: number; actor_id?: number; action?: string; resource_type?: string; resource_id?: number; severity?: string; }
export interface AuditListResponse { items: AuditLog[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
