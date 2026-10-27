export interface StaffProfile { id: number; user_id: number; department_id?: number | null; title?: string | null; specialty?: string | null; license_number?: string | null; phone?: string | null; is_active: boolean; hired_at?: string | null; }
export interface Shift { id: number; staff_id: number; department_id?: number | null; shift_type: string; start_time: string; end_time: string; notes?: string | null; }
export interface TimeOffRequest { id: number; staff_id: number; start_date: string; end_date: string; reason?: string | null; status: string; reviewed_by?: number | null; created_at?: string | null; }
export interface RosterEntry { id: number; department_id: number; date: string; staff_id: number; shift_type: string; }
export interface StaffProfileCreateInput { user_id: number; department_id?: number; title?: string; specialty?: string; license_number?: string; phone?: string; hired_at?: string; }
export interface StaffProfileUpdateInput { department_id?: number; title?: string; specialty?: string; license_number?: string; phone?: string; is_active?: boolean; }
export interface ShiftCreateInput { staff_id: number; department_id?: number; shift_type?: string; start_time: string; end_time: string; notes?: string; }
export interface TimeOffCreateInput { staff_id: number; start_date: string; end_date: string; reason?: string; }
export interface StaffListParams { page?: number; per_page?: number; department_id?: number; active_only?: boolean; }
export interface StaffListResponse { items: StaffProfile[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
