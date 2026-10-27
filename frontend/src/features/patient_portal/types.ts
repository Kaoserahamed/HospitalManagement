export interface PortalMessage { id: number; sender_id: number; recipient_id: number; subject?: string | null; body: string; message_type: string; status: string; is_read: boolean; created_at?: string | null; read_at?: string | null; }
export interface PortalReminder { id: number; patient_id: number; reminder_type: string; title: string; body: string; scheduled_at: string; status: string; sent_at?: string | null; acknowledged_at?: string | null; created_at?: string | null; }
export interface PrescriptionDownload { id: number; prescription_id: number; patient_id: number; downloaded_at?: string | null; format: string; ip_address?: string | null; }
export interface Conversation { participant_id: number; last_message?: string | null; unread_count: number; last_activity?: string | null; }
export interface PortalSummary { unread_messages: number; pending_reminders: number; recent_downloads: number; }
export interface MessageCreateInput { sender_id: number; recipient_id: number; subject?: string; body: string; message_type?: string; }
export interface ReminderCreateInput { patient_id: number; reminder_type: string; title: string; body: string; scheduled_at: string; reference_id?: number; }
export interface PortalListParams { page?: number; per_page?: number; recipient_id?: number; sender_id?: number; unread_only?: boolean; }
export interface PortalListResponse { items: PortalMessage[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
