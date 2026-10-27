export interface LabOrder { id: number; patient_id: number; encounter_id?: number | null; ordering_provider: number; test_code: string; test_name: string; status: string; priority: string; ordered_at?: string | null; collected_at?: string | null; resulted_at?: string | null; notes?: string | null; results?: LabResult[]; }
export interface LabResult { id: number; order_id: number; value: string; unit?: string | null; reference_range?: string | null; abnormal: boolean; resulted_at?: string | null; }
export interface LabPanel { id: number; name: string; tests: string; }
export interface LabOrderCreateInput { patient_id: number; encounter_id?: number; ordering_provider: number; test_code: string; test_name: string; priority?: string; notes?: string; }
export interface LabResultCreateInput { order_id: number; value: string; unit?: string; reference_range?: string; abnormal?: boolean; }
export interface LabPanelCreateInput { name: string; tests: string; }
export interface LabOrderListParams { page?: number; per_page?: number; patient_id?: number; status?: string; }
export interface LabOrderListResponse { items: LabOrder[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
