export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  department_id?: number | null;
  start_time: string;
  end_time: string;
  status: string;
  appointment_type: string;
  notes?: string | null;
  duration_minutes: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AppointmentCreateInput {
  patient_id: number;
  doctor_id: number;
  department_id?: number;
  start_time: string;
  end_time: string;
  appointment_type?: string;
  notes?: string;
}

export interface AppointmentUpdateInput {
  start_time?: string;
  end_time?: string;
  status?: string;
  appointment_type?: string;
  notes?: string;
  doctor_id?: number;
  department_id?: number;
}

export interface AppointmentListParams {
  page?: number;
  per_page?: number;
  doctor_id?: number;
  patient_id?: number;
  status?: string;
}

export interface AppointmentListResponse {
  items: Appointment[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface Slot {
  id: number;
  doctor_id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  appointment_id?: number | null;
}
