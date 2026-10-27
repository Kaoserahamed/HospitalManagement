export interface RiskModel { id: number; name: string; version: string; description?: string | null; features: string; is_active: boolean; created_at?: string | null; }
export interface RiskPrediction { id: number; model_id: number; patient_id: number; encounter_id?: number | null; score: number; risk_level: string; factors?: string | null; predicted_at?: string | null; }
export interface RiskFactor { id: number; name: string; weight: number; category?: string | null; description?: string | null; }
export interface RiskModelCreateInput { name: string; version: string; description?: string; features: string; is_active?: boolean; }
export interface RiskFactorCreateInput { name: string; weight: number; category?: string; description?: string; }
export interface RiskEvaluationRequest { patient_id: number; encounter_id?: number; features: Record<string, any>; }
export interface RiskEvaluationResult { patient_id: number; score: number; risk_level: string; factors: Record<string, any>; model_version: string; }
export interface RiskListParams { page?: number; per_page?: number; }
export interface RiskListResponse { items: RiskPrediction[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
