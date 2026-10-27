export interface DicomStudy { id: number; study_instance_uid: string; patient_id: number; modality?: string | null; study_date?: string | null; description?: string | null; storage_path?: string | null; created_at?: string | null; }
export interface DicomSeries { id: number; study_id: number; series_instance_uid: string; modality?: string | null; series_number?: number | null; instance_count: number; }
export interface DicomInstance { id: number; series_id: number; sop_instance_uid: string; instance_number?: number | null; storage_path?: string | null; file_size?: number | null; }
export interface DicomStudyCreateInput { study_instance_uid: string; patient_id: number; modality?: string; study_date?: string; description?: string; storage_path?: string; }
export interface DicomSeriesCreateInput { study_id: number; series_instance_uid: string; modality?: string; series_number?: number; instance_count?: number; }
export interface DicomInstanceCreateInput { series_id: number; sop_instance_uid: string; instance_number?: number; storage_path?: string; file_size?: number; }
export interface DicomStudySummary { study_id: number; modality?: string | null; series_count: number; instance_count: number; }
