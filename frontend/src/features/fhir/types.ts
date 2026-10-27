export interface FHIRResource { id: number; resource_type: string; resource_id: string; version: number; payload: string; last_updated?: string | null; source_system?: string | null; }
export interface FHIRBundle { id: number; bundle_type: string; total: number; payload: string; created_at?: string | null; }
export interface FHIRSubscription { id: number; resource_type: string; criteria: string; channel_type: string; endpoint: string; is_active: boolean; created_at?: string | null; }
export interface FHIRResourceCreateInput { resource_type: string; resource_id: string; payload: string; source_system?: string; }
export interface FHIRBundleCreateInput { bundle_type: string; payload: string; }
export interface FHIRSubscriptionCreateInput { resource_type: string; criteria: string; channel_type: string; endpoint: string; }
export interface FHIRSearchRequest { resource_type?: string; query?: string; page?: number; per_page?: number; }
export interface FHIRListParams { page?: number; per_page?: number; resource_type?: string; }
export interface FHIRListResponse { items: FHIRResource[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
