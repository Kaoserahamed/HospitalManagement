export interface Patient {
  id: number;
  user_id?: number | null;
  first_name: string;
  last_name: string;
  full_name?: string;
  dob: string;
  gender: string;
  phone?: string | null;
  address?: string | null;
  insurance_provider?: string | null;
  insurance_number?: string | null;
  status: string;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PatientCreateInput {
  first_name: string;
  last_name: string;
  dob: string;
  gender?: string;
  phone?: string;
  address?: string;
  insurance_provider?: string;
  insurance_number?: string;
  user_id?: number;
}

export interface PatientUpdateInput {
  first_name?: string;
  last_name?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  address?: string;
  insurance_provider?: string;
  insurance_number?: string;
  status?: string;
}

export interface PatientListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  gender?: string;
}

export interface PatientListResponse {
  items: Patient[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface Allergy {
  id: number;
  patient_id: number;
  substance: string;
  reaction?: string | null;
  severity?: string | null;
  recorded_at?: string | null;
}

export interface Insurance {
  id: number;
  patient_id: number;
  provider: string;
  policy_number: string;
  group_number?: string | null;
  effective_date?: string | null;
  expiry_date?: string | null;
}
