export interface WorkflowDefinition { id: number; name: string; description?: string | null; version: string; steps: string; is_active: boolean; created_at?: string | null; }
export interface WorkflowInstance { id: number; definition_id: number; entity_type: string; entity_id: number; status: string; current_step: number; started_at?: string | null; completed_at?: string | null; created_at?: string | null; steps?: WorkflowStep[]; transitions?: WorkflowTransition[]; }
export interface WorkflowStep { id: number; instance_id: number; step_index: number; name: string; status: string; assigned_to?: number | null; started_at?: string | null; completed_at?: string | null; notes?: string | null; }
export interface WorkflowTransition { id: number; instance_id: number; from_step: number; to_step: number; action: string; performed_by?: number | null; performed_at?: string | null; notes?: string | null; }
export interface WorkflowDefinitionCreateInput { name: string; description?: string; version?: string; steps: string; is_active?: boolean; }
export interface WorkflowInstanceCreateInput { definition_id: number; entity_type: string; entity_id: number; }
export interface WorkflowActionRequest { instance_id: number; action: string; performed_by?: number; notes?: string; }
export interface WorkflowListParams { page?: number; per_page?: number; entity_type?: string; status?: string; }
export interface WorkflowListResponse { items: WorkflowInstance[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
export interface WorkflowProgress { instance_id: number; total_steps: number; completed_steps: number; progress_percent: number; }
