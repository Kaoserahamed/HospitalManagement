export interface Rule { id: number; name: string; rule_type: string; condition: string; action: string; priority: number; status: string; version: string; created_at?: string | null; updated_at?: string | null; }
export interface RuleExecution { id: number; rule_id: number; input_data: string; output_data?: string | null; result: string; executed_at?: string | null; error?: string | null; }
export interface RuleSet { id: number; name: string; description?: string | null; rule_ids: string; is_active: boolean; created_at?: string | null; }
export interface RuleCreateInput { name: string; rule_type: string; condition: string; action: string; priority?: number; status?: string; version?: string; }
export interface RuleEvaluationRequest { rule_id: number; input_data: Record<string, any>; }
export interface RuleEvaluationResult { rule_id: number; result: string; output_data?: Record<string, any> | null; error?: string | null; }
export interface RuleListParams { page?: number; per_page?: number; }
export interface RuleListResponse { items: Rule[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
