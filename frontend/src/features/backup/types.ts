export interface Backup { id: number; backup_type: string; status: string; file_path?: string | null; size_bytes?: number | null; checksum?: string | null; started_at?: string | null; completed_at?: string | null; error?: string | null; created_at?: string | null; }
export interface Restore { id: number; backup_id: number; target: string; status: string; started_at?: string | null; completed_at?: string | null; error?: string | null; created_at?: string | null; }
export interface BackupSchedule { id: number; backup_type: string; cron_expression: string; retention_days: number; is_active: boolean; last_run?: string | null; next_run?: string | null; created_at?: string | null; }
export interface BackupCreateInput { backup_type?: string; }
export interface RestoreCreateInput { backup_id: number; target: string; }
export interface BackupScheduleCreateInput { backup_type?: string; cron_expression: string; retention_days?: number; is_active?: boolean; }
export interface BackupListParams { page?: number; per_page?: number; backup_type?: string; status?: string; }
export interface BackupListResponse { items: Backup[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
export interface BackupStats { total: number; completed: number; failed: number; total_size_bytes: number; }
