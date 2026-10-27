export interface Registry { id: number; name: string; description?: string | null; condition_code?: string | null; created_at?: string | null; }
export interface Outcome { id: number; patient_id: number; measure: string; value: number; recorded_at?: string | null; }
export interface QualityMeasure { id: number; name: string; measure_type: string; numerator: number; denominator: number; target: number; period_start?: string | null; period_end?: string | null; }
export interface Report { id: number; name: string; report_type: string; format: string; generated_at?: string | null; file_path?: string | null; created_at?: string | null; }
export interface ReadmissionRisk { id: number; patient_id: number; encounter_id?: number | null; score: number; risk_level: string; factors?: string | null; computed_at?: string | null; }
export interface DashboardSummary { total_patients: number; total_appointments: number; total_encounters: number; occupancy_rate: number; revenue: number; quality_score: number; }
export interface RegistryCreateInput { name: string; description?: string; condition_code?: string; }
export interface OutcomeCreateInput { patient_id: number; measure: string; value: number; }
export interface QualityMeasureCreateInput { name: string; measure_type?: string; numerator?: number; denominator?: number; target?: number; period_start?: string; period_end?: string; }
export interface ReportCreateInput { name: string; report_type: string; format?: string; parameters?: string; }
export interface ReadmissionRiskCreateInput { patient_id: number; encounter_id?: number; score: number; risk_level: string; factors?: string; }
export interface AnalyticsListParams { page?: number; per_page?: number; }
