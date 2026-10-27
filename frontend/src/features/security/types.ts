export interface MFAConfig { id: number; user_id: number; method: string; status: string; secret?: string | null; backup_codes?: string | null; created_at?: string | null; enabled_at?: string | null; }
export interface SSOLink { id: number; user_id: number; provider: string; external_id: string; idp_name?: string | null; linked_at?: string | null; }
export interface SecurityEvent { id: number; user_id?: number | null; event_type: string; severity: string; ip_address?: string | null; user_agent?: string | null; details?: string | null; occurred_at?: string | null; }
export interface EncryptionKey { id: number; key_id: string; algorithm: string; purpose: string; is_active: boolean; created_at?: string | null; rotated_at?: string | null; }
export interface MFASetupResponse { secret: string; qr_code_url: string; backup_codes: string[]; }
export interface PermissionResult { allowed: boolean; reason: string; }
export interface SecuritySummary { mfa_enabled_users: number; sso_links: number; active_keys: number; recent_events: number; }
export interface MFAConfigCreateInput { user_id: number; method?: string; status?: string; secret?: string; backup_codes?: string; }
export interface SSOLinkCreateInput { user_id: number; provider: string; external_id: string; idp_name?: string; }
export interface SecurityEventCreateInput { user_id?: number; event_type: string; severity?: string; ip_address?: string; user_agent?: string; details?: string; }
export interface EncryptionKeyCreateInput { key_id: string; algorithm: string; purpose: string; is_active?: boolean; }
export interface SecurityListParams { page?: number; per_page?: number; user_id?: number; event_type?: string; severity?: string; }
export interface SecurityListResponse { items: SecurityEvent[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
