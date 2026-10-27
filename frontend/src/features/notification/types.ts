export interface Notification { id: number; recipient_id: number; channel: string; subject?: string | null; body: string; status: string; is_read: boolean; created_at?: string | null; sent_at?: string | null; read_at?: string | null; }
export interface NotificationTemplate { id: number; name: string; channel: string; subject?: string | null; body_template: string; is_active: boolean; }
export interface NotificationCreateInput { recipient_id: number; channel?: string; subject?: string; body: string; }
export interface BulkNotificationCreateInput { recipient_ids: number[]; channel?: string; subject?: string; body: string; }
export interface NotificationListParams { page?: number; per_page?: number; recipient_id?: number; status?: string; unread_only?: boolean; }
export interface NotificationListResponse { items: Notification[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
