export interface MDTMeeting { id: number; patient_id: number; title: string; scheduled_at: string; duration_minutes: number; status: string; location?: string | null; notes?: string | null; created_at?: string | null; attendees?: MDTAttendee[]; decisions?: MDTDecision[]; }
export interface MDTAttendee { id: number; meeting_id: number; user_id: number; role: string; attended: boolean; }
export interface MDTDecision { id: number; meeting_id: number; decision: string; owner_id?: number | null; due_date?: string | null; status: string; created_at?: string | null; }
export interface MDTMeetingCreateInput { patient_id: number; title: string; scheduled_at: string; duration_minutes?: number; location?: string; notes?: string; }
export interface MDTAttendeeCreateInput { meeting_id: number; user_id: number; role: string; }
export interface MDTDecisionCreateInput { meeting_id: number; decision: string; owner_id?: number; due_date?: string; }
export interface MDTListParams { page?: number; per_page?: number; patient_id?: number; status?: string; }
export interface MDTListResponse { items: MDTMeeting[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
