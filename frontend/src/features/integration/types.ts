export interface IntegrationAdapter { id: number; name: string; adapter_type: string; endpoint: string; status: string; last_sync?: string | null; error_message?: string | null; created_at?: string | null; }
export interface SyncLog { id: number; adapter_id: number; status: string; records_processed: number; records_failed: number; error?: string | null; started_at?: string | null; completed_at?: string | null; }
export interface Webhook { id: number; name: string; url: string; events: string; is_active: boolean; created_at?: string | null; }
export interface WebhookDelivery { id: number; webhook_id: number; event: string; payload: string; response_status?: number | null; response_body?: string | null; delivered_at?: string | null; }
export interface AdapterCreateInput { name: string; adapter_type: string; endpoint: string; credentials?: string; status?: string; }
export interface WebhookCreateInput { name: string; url: string; events: string; secret?: string; is_active?: boolean; }
export interface IntegrationListParams { page?: number; per_page?: number; }
export interface IntegrationListResponse { items: IntegrationAdapter[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
