export interface VirtualVisit { id: number; patient_id: number; doctor_id: number; appointment_id?: number | null; status: string; scheduled_start: string; scheduled_end: string; actual_start?: string | null; actual_end?: string | null; session_quality?: string | null; recording_url?: string | null; notes?: string | null; }
export interface WaitingRoomEntry { id: number; visit_id: number; patient_id: number; entered_at?: string | null; position: number; is_admitted: boolean; }
export interface SessionMetric { id: number; visit_id: number; metric_name: string; metric_value: number; recorded_at?: string | null; }
export interface VirtualVisitCreateInput { patient_id: number; doctor_id: number; appointment_id?: number; scheduled_start: string; scheduled_end: string; notes?: string; }
export interface VisitSummary { total_visits: number; completed: number; cancelled: number; no_show: number; avg_duration_minutes: number; }
export interface VisitListParams { page?: number; per_page?: number; patient_id?: number; doctor_id?: number; status?: string; }
export interface VisitListResponse { items: VirtualVisit[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
