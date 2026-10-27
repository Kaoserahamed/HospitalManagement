export interface PerformanceMetric { id: number; endpoint: string; method: string; duration_ms: number; status_code: number; recorded_at?: string | null; }
export interface SlowQuery { id: number; query: string; duration_ms: number; params?: string | null; recorded_at?: string | null; }
export interface CacheStats { id: number; cache_name: string; hits: number; misses: number; evictions: number; recorded_at?: string | null; }
export interface PerformanceSummary { endpoint: string; request_count: number; avg_duration_ms: number; p95_duration_ms: number; error_rate: number; }
export interface PerformanceMetricCreateInput { endpoint: string; method: string; duration_ms: number; status_code: number; }
export interface SlowQueryCreateInput { query: string; duration_ms: number; params?: string; }
export interface CacheStatsCreateInput { cache_name: string; hits?: number; misses?: number; evictions?: number; }
export interface PerformanceListParams { page?: number; per_page?: number; endpoint?: string; }
export interface PerformanceListResponse { items: PerformanceMetric[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
