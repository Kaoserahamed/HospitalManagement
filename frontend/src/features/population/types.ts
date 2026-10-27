export interface PopulationRegistry { id: number; name: string; registry_type: string; condition_code?: string | null; description?: string | null; created_at?: string | null; }
export interface RegistryMember { id: number; registry_id: number; patient_id: number; status: string; enrolled_at?: string | null; }
export interface PopulationMeasure { id: number; registry_id: number; name: string; numerator: number; denominator: number; period: string; period_start?: string | null; period_end?: string | null; }
export interface PopulationOutcome { id: number; patient_id: number; registry_id?: number | null; outcome: string; value: number; recorded_at?: string | null; }
export interface RegistryCreateInput { name: string; registry_type?: string; condition_code?: string; description?: string; }
export interface OutcomeCreateInput { patient_id: number; registry_id?: number; outcome: string; value: number; }
export interface PopulationSummary { total_registries: number; total_members: number; average_measure_rate: number; }
export interface PopulationListParams { page?: number; per_page?: number; }
export interface PopulationListResponse { items: PopulationRegistry[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
