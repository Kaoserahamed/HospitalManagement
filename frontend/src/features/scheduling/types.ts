export interface ShiftSwap { id: number; requester_id: number; target_id: number; requester_shift_id: number; target_shift_id: number; status: string; reason?: string | null; created_at?: string | null; resolved_at?: string | null; }
export interface OnCallSchedule { id: number; department_id: number; staff_id: number; on_call_type: string; start_time: string; end_time: string; is_active: boolean; created_at?: string | null; }
export interface CoverageAlert { id: number; department_id: number; date: string; shift_type: string; status: string; message: string; acknowledged: boolean; created_at?: string | null; }
export interface ShiftTemplate { id: number; name: string; department_id: number; shift_type: string; start_time: string; end_time: string; days_of_week: string; is_active: boolean; }
export interface StaffAvailability { id: number; staff_id: number; day_of_week: number; start_time: string; end_time: string; is_available: boolean; }
export interface ScheduleSummary { department_id: number; date: string; total_shifts: number; covered_shifts: number; gaps: number; coverage_rate: number; }
export interface ShiftSwapCreateInput { requester_id: number; target_id: number; requester_shift_id: number; target_shift_id: number; reason?: string; }
export interface OnCallCreateInput { department_id: number; staff_id: number; on_call_type?: string; start_time: string; end_time: string; }
export interface CoverageAlertCreateInput { department_id: number; date: string; shift_type: string; status?: string; message: string; }
export interface ShiftTemplateCreateInput { name: string; department_id: number; shift_type: string; start_time: string; end_time: string; days_of_week: string; is_active?: boolean; }
export interface AvailabilityCreateInput { staff_id: number; day_of_week: number; start_time: string; end_time: string; is_available?: boolean; }
