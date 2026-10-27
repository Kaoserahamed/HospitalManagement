export interface SearchResult { id: string; score: number; metadata?: Record<string, any>; }
export interface SearchResponse { results: SearchResult[]; }
export interface SuggestResponse { suggestions: string[]; }
