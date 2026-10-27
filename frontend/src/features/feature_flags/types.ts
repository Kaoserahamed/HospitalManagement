export interface FeatureFlag { id: number; key: string; name: string; description?: string | null; enabled: boolean; rollout_percentage: number; target_roles?: string | null; created_at?: string | null; updated_at?: string | null; }
export interface FlagOverride { id: number; flag_id: number; user_id: number; enabled: boolean; created_at?: string | null; }
export interface FlagEvaluation { key: string; enabled: boolean; reason: string; }
export interface FeatureFlagCreateInput { key: string; name: string; description?: string; enabled?: boolean; rollout_percentage?: number; target_roles?: string; }
export interface FeatureFlagUpdateInput { name?: string; description?: string; enabled?: boolean; rollout_percentage?: number; target_roles?: string; }
export interface FlagListParams { page?: number; per_page?: number; }
export interface FlagListResponse { items: FeatureFlag[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
