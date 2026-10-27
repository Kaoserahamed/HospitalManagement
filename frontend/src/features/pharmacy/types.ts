export interface Medication { id: number; name: string; generic_name?: string | null; form: string; strength?: string | null; manufacturer?: string | null; requires_prescription: boolean; }
export interface Stock { id: number; medication_id: number; quantity: number; reorder_point: number; location?: string | null; updated_at?: string | null; }
export interface Lot { id: number; medication_id: number; lot_number: string; quantity: number; expiry_date: string; received_at?: string | null; }
export interface Supplier { id: number; name: string; contact?: string | null; email?: string | null; phone?: string | null; }
export interface Dispense { id: number; prescription_id: number; medication_id: number; quantity: number; dispensed_by?: number | null; dispensed_at?: string | null; notes?: string | null; }
export interface MedicationCreateInput { name: string; generic_name?: string; form?: string; strength?: string; manufacturer?: string; requires_prescription?: boolean; }
export interface StockCreateInput { medication_id: number; quantity?: number; reorder_point?: number; location?: string; }
export interface DispenseCreateInput { prescription_id: number; medication_id: number; quantity: number; dispensed_by?: number; notes?: string; }
export interface MedicationListParams { page?: number; per_page?: number; search?: string; }
export interface MedicationListResponse { items: Medication[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
export interface InteractionCheck { medication_a: string; medication_b: string; }
export interface InteractionResult { has_interaction: boolean; interactions: any[]; }
