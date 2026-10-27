export interface Department { id: number; name: string; description?: string | null; location?: string | null; head_doctor_id?: number | null; is_active: boolean; created_at?: string | null; updated_at?: string | null; }
export interface Room { id: number; department_id: number; name: string; capacity: number; equipment?: string | null; is_available: boolean; }
export interface DepartmentEquipment { id: number; department_id: number; name: string; quantity: number; status: string; }
export interface DepartmentCreateInput { name: string; description?: string; location?: string; head_doctor_id?: number; }
export interface DepartmentUpdateInput { name?: string; description?: string; location?: string; head_doctor_id?: number; is_active?: boolean; }
export interface DepartmentListParams { page?: number; per_page?: number; search?: string; active_only?: boolean; }
export interface DepartmentListResponse { items: Department[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
