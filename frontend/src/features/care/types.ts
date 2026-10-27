export interface CareTeam { id: number; patient_id: number; name: string; created_at?: string | null; }
export interface CareTeamMember { id: number; care_team_id: number; user_id: number; role: string; joined_at?: string | null; }
export interface CareTask { id: number; patient_id: number; assigned_to?: number | null; title: string; description?: string | null; status: string; priority: string; due_date?: string | null; created_at?: string | null; completed_at?: string | null; }
export interface Handoff { id: number; patient_id: number; from_user: number; to_user: number; summary: string; status: string; created_at?: string | null; acknowledged_at?: string | null; }
export interface DischargePlan { id: number; patient_id: number; encounter_id?: number | null; summary: string; follow_up_appointments?: string | null; medications?: string | null; home_care_instructions?: string | null; created_at?: string | null; }
export interface CareTeamCreateInput { patient_id: number; name: string; }
export interface CareTaskCreateInput { patient_id: number; assigned_to?: number; title: string; description?: string; priority?: string; due_date?: string; }
export interface HandoffCreateInput { patient_id: number; from_user: number; to_user: number; summary: string; }
export interface DischargePlanCreateInput { patient_id: number; encounter_id?: number; summary: string; follow_up_appointments?: string; medications?: string; home_care_instructions?: string; }
