export interface QualityMeasure { id: number; name: string; category: string; description?: string | null; numerator: number; denominator: number; target: number; created_at?: string | null; }
export interface QualityResult { id: number; measure_id: number; patient_id: number; numerator_met: boolean; recorded_at?: string | null; }
export interface Benchmark { id: number; measure_id: number; benchmark_value: number; source?: string | null; effective_date?: string | null; }
export interface QualitySummary { measure_id: number; name: string; rate: number; target: number; gap: number; status: string; benchmark?: number | null; }
export interface QualityMeasureCreateInput { name: string; category?: string; description?: string; numerator?: number; denominator?: number; target?: number; }
export interface QualityResultCreateInput { measure_id: number; patient_id: number; numerator_met: boolean; }
export interface QualityListParams { page?: number; per_page?: number; }
export interface QualityListResponse { items: QualityMeasure[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
