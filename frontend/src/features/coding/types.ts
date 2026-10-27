export interface MedicalCode { id: number; system: string; code: string; description: string; category?: string | null; is_billable: boolean; created_at?: string | null; }
export interface CodeMapping { id: number; source_system: string; source_code: string; target_system: string; target_code: string; confidence: number; }
export interface EncounterCode { id: number; encounter_id: number; system: string; code: string; description?: string | null; is_primary: boolean; added_at?: string | null; }
export interface CodeValidationResult { code: string; system: string; valid: boolean; description?: string | null; }
export interface CodeSearchRequest { system?: string; query: string; limit?: number; }
export interface MedicalCodeCreateInput { system: string; code: string; description: string; category?: string; is_billable?: boolean; }
export interface CodeMappingCreateInput { source_system: string; source_code: string; target_system: string; target_code: string; confidence?: number; }
export interface EncounterCodeCreateInput { encounter_id: number; system: string; code: string; description?: string; is_primary?: boolean; }
