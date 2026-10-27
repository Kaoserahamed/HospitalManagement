export interface VideoSession { id: number; visit_id: number; room_id: string; status: string; quality: string; started_at?: string | null; ended_at?: string | null; recording_path?: string | null; participant_count: number; created_at?: string | null; }
export interface SignalingMessage { id: number; session_id: number; sender_id: number; message_type: string; payload: string; created_at?: string | null; }
export interface SessionMetric { id: number; session_id: number; metric_name: string; metric_value: number; recorded_at?: string | null; }
export interface VideoSessionCreateInput { visit_id: number; room_id?: string; quality?: string; }
export interface VideoSessionListParams { page?: number; per_page?: number; status?: string; }
export interface VideoSessionListResponse { items: VideoSession[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
