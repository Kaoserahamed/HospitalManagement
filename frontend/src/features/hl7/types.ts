export interface HL7Message { id: number; message_type: string; event: string; raw_message: string; status: string; patient_id?: number | null; received_at?: string | null; processed_at?: string | null; error?: string | null; parsed_json?: string | null; }
export interface HL7ParseResult { message_type: string; event: string; segments: any[]; patient_id?: string | null; valid: boolean; error?: string | null; }
export interface HL7MessageCreateInput { message_type: string; event: string; raw_message: string; patient_id?: number; }
export interface HL7ListParams { page?: number; per_page?: number; message_type?: string; status?: string; }
export interface HL7ListResponse { items: HL7Message[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
