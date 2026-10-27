export interface Encounter {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number | null;
  encounter_type: string;
  status: string;
  chief_complaint?: string | null;
  subjective?: string | null;
  objective?: string | null;
  assessment?: string | null;
  plan?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  finalized_at?: string | null;
}

export interface Vital {
  id: number;
  encounter_id: number;
  blood_pressure_systolic?: number | null;
  blood_pressure_diastolic?: number | null;
  heart_rate?: number | null;
  temperature_c?: number | null;
  respiratory_rate?: number | null;
  oxygen_saturation?: number | null;
  weight_kg?: number | null;
  height_cm?: number | null;
  recorded_at?: string | null;
}

export interface Diagnosis {
  id: number;
  encounter_id: number;
  code: string;
  description: string;
  is_primary: boolean;
  noted_at?: string | null;
}

export interface LabResult {
  id: number;
  encounter_id: number;
  test_name: string;
  value: string;
  unit?: string | null;
  reference_range?: string | null;
  abnormal: boolean;
  resulted_at?: string | null;
}

export interface Prescription {
  id: number;
  encounter_id: number;
  patient_id: number;
  doctor_id: number;
  medication: string;
  dosage: string;
  frequency: string;
  duration?: string | null;
  instructions?: string | null;
  issued_at?: string | null;
}

export interface EncounterCreateInput {
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  encounter_type?: string;
  chief_complaint?: string;
}
