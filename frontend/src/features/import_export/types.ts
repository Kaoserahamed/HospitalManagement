export interface ImportJob { id: number; entity_type: string; file_name: string; file_path?: string | null; status: string; total_rows: number; processed_rows: number; error_rows: number; errors?: string | null; created_at?: string | null; completed_at?: string | null; }
export interface ExportJob { id: number; entity_type: string; format: string; filters?: string | null; file_path?: string | null; row_count: number; status: string; error?: string | null; created_at?: string | null; completed_at?: string | null; }
export interface ImportJobCreateInput { entity_type: string; file_name: string; file_path: string; }
export interface ExportJobCreateInput { entity_type: string; format?: string; filters?: string; }
export interface ImportExportListParams { page?: number; per_page?: number; entity_type?: string; status?: string; }
export interface ImportExportListResponse { items: ImportJob[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
