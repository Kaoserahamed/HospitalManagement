export interface Ophthalmology {
  id: number;
  patient_id?: number | null;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  category?: string | null;
  owner_id?: number | null;
  notes?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface OphthalmologyCreateInput {
  patient_id?: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  owner_id?: number;
  notes?: string;
  is_active?: boolean;
}

export interface OphthalmologyUpdateInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  owner_id?: number;
  notes?: string;
  is_active?: boolean;
}

export interface OphthalmologyListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  patient_id?: number;
}

export interface OphthalmologyListResponse {
  items: Ophthalmology[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
