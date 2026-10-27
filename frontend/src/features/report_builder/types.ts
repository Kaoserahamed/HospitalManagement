export interface ReportTemplate { id: number; name: string; description?: string | null; report_type: string; query: string; parameters?: string | null; columns?: string | null; is_active: boolean; created_at?: string | null; updated_at?: string | null; }
export interface ReportSchedule { id: number; template_id: number; cron_expression: string; export_format: string; delivery_channel: string; recipients: string; is_active: boolean; last_run?: string | null; next_run?: string | null; created_at?: string | null; }
export interface ReportExport { id: number; template_id: number; schedule_id?: number | null; format: string; file_path?: string | null; row_count: number; status: string; error?: string | null; started_at?: string | null; completed_at?: string | null; created_at?: string | null; }
export interface ReportDashboard { id: number; name: string; description?: string | null; widgets: string; is_default: boolean; created_at?: string | null; }
export interface ReportTemplateCreateInput { name: string; description?: string; report_type?: string; query: string; parameters?: string; columns?: string; is_active?: boolean; }
export interface ReportScheduleCreateInput { template_id: number; cron_expression: string; export_format?: string; delivery_channel?: string; recipients: string; is_active?: boolean; }
export interface ReportExportCreateInput { template_id: number; format?: string; schedule_id?: number; }
export interface ReportRunRequest { template_id: number; parameters?: Record<string, any>; format?: string; }
export interface ReportListParams { page?: number; per_page?: number; }
export interface ReportListResponse { items: ReportTemplate[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
