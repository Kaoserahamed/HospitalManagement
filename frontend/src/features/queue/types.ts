export interface Task { id: number; name: string; payload?: string | null; status: string; priority: string; attempts: number; max_attempts: number; error?: string | null; created_at?: string | null; started_at?: string | null; completed_at?: string | null; }
export interface TaskCreateInput { name: string; payload?: string; priority?: string; max_attempts?: number; }
export interface QueueStats { total: number; queued: number; running: number; completed: number; failed: number; cancelled: number; }
export interface TaskListParams { page?: number; per_page?: number; status?: string; priority?: string; }
export interface TaskListResponse { items: Task[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
