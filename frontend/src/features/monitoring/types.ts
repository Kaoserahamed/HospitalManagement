export interface MonitoringDevice { id: number; patient_id: number; device_type: string; serial_number: string; is_active: boolean; registered_at?: string | null; }
export interface VitalReading { id: number; patient_id: number; device_id?: number | null; vital_type: string; value: number; unit?: string | null; recorded_at?: string | null; }
export interface MonitoringThreshold { id: number; vital_type: string; min_value?: number | null; max_value?: number | null; severity: string; }
export interface MonitoringAlert { id: number; patient_id: number; vital_type: string; value: number; severity: string; message: string; acknowledged: boolean; created_at?: string | null; }
export interface DeviceCreateInput { patient_id: number; device_type: string; serial_number: string; }
export interface ReadingCreateInput { patient_id: number; device_id?: number; vital_type: string; value: number; unit?: string; }
export interface ThresholdCreateInput { vital_type: string; min_value?: number; max_value?: number; severity?: string; }
export interface AlertListParams { patient_id?: number; acknowledged?: boolean; }
export interface AlertListResponse { items: MonitoringAlert[]; page: number; per_page: number; total: number; total_pages: number; has_next: boolean; has_prev: boolean; }
