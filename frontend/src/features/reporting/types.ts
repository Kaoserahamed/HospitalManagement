export interface ReportDefinition { id: number; name: string; description?: string | null; query: string; parameters?: string | null; format: string; schedule: string; is_active: boolean; created_at?: string | null; }
export interface ReportExecution { id: number; definition_id: number; status: string; row_count: number; file_path?: string | null; error?: string | null; started_at?: string | null; completed_at?: string | null; created_at?: string | null; }
export interface ReportSubscription { id: number; definition_id: number; user_id: number; delivery_channel: string; is_active: boolean; }
export interface ReportDefinitionCreateInput { name: string; description?: string; query: string; parameters?: string; format?: string; schedule?: string; is_active?: boolean; }
export interface ReportRunRequest { definition_id: number; parameters?: Record<string, any>; }
export interface ReportListParams { page?: number; per_page?: number; }
export interface ReportListResponse { items: ReportDefinition[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
