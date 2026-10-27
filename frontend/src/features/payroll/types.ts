export interface Payroll {
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

export interface PayrollCreateInput {
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

export interface PayrollUpdateInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  owner_id?: number;
  notes?: string;
  is_active?: boolean;
}

export interface PayrollListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  patient_id?: number;
}

export interface PayrollListResponse {
  items: Payroll[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
