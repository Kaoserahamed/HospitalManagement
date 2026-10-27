export interface CDSRule { id: number; name: string; rule_type: string; condition: string; action: string; priority: number; is_active: boolean; created_at?: string | null; }
export interface CDSAlert { id: number; patient_id: number; encounter_id?: number | null; rule_id?: number | null; alert_level: string; message: string; acknowledged: boolean; acknowledged_by?: number | null; created_at?: string | null; }
export interface DrugDoseRange { id: number; medication: string; min_dose: number; max_dose: number; unit: string; age_min?: number | null; age_max?: number | null; }
export interface CDSRuleCreateInput { name: string; rule_type: string; condition: string; action: string; priority?: number; is_active?: boolean; }
export interface CDSEvaluationRequest { patient_id: number; encounter_id?: number; medications?: string[]; allergies?: string[]; diagnoses?: string[]; age?: number; }
export interface CDSEvaluationResult { patient_id: number; alerts: any[]; alert_count: number; has_critical: boolean; }
export interface CDSListParams { page?: number; per_page?: number; }
export interface CDSListResponse { items: CDSRule[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
