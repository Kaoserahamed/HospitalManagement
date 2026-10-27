export interface CheckIn { id: number; patient_id: number; appointment_id?: number | null; department_id?: number | null; status: string; priority: string; checked_in_at?: string | null; called_at?: string | null; completed_at?: string | null; estimated_wait_minutes?: number | null; notes?: string | null; }
export interface QueueEntry { id: number; checkin_id: number; department_id?: number | null; position: number; priority: string; estimated_wait?: number | null; created_at?: string | null; }
export interface KioskSession { id: number; patient_id?: number | null; started_at?: string | null; ended_at?: string | null; actions?: string | null; }
export interface CheckInCreateInput { patient_id: number; appointment_id?: number; department_id?: number; priority?: string; notes?: string; }
export interface CheckInUpdateInput { status?: string; priority?: string; estimated_wait_minutes?: number; notes?: string; }
export interface QueueStats { total_waiting: number; avg_wait_minutes: number; longest_wait_minutes: number; }
export interface CheckInListParams { page?: number; per_page?: number; status?: string; department_id?: number; }
export interface CheckInListResponse { items: CheckIn[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
