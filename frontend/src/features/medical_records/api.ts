import axios from 'axios';
import type { MedicalRecords, MedicalRecordsCreateInput, MedicalRecordsUpdateInput, MedicalRecordsListParams, MedicalRecordsListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const medical_recordsApi = {
  list: async (params: MedicalRecordsListParams = {}): Promise<MedicalRecordsListResponse> => {
    const { data } = await api.get('/medical_records', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<MedicalRecords[]> => {
    const { data } = await api.get('/medical_records/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<MedicalRecords> => {
    const { data } = await api.get(`/medical_records/${id}`);
    return data;
  },
  create: async (payload: MedicalRecordsCreateInput): Promise<MedicalRecords> => {
    const { data } = await api.post('/medical_records', payload);
    return data;
  },
  update: async (id: number, payload: MedicalRecordsUpdateInput): Promise<MedicalRecords> => {
    const { data } = await api.put(`/medical_records/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/medical_records/${id}`);
  },
  search: async (q: string): Promise<MedicalRecords[]> => {
    const { data } = await api.get('/medical_records/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/medical_records/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/medical_records/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<MedicalRecords> => {
    const { data } = await api.post(`/medical_records/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<MedicalRecords> => {
    const { data } = await api.post(`/medical_records/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<MedicalRecords> => {
    const { data } = await api.post(`/medical_records/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<MedicalRecords> => {
    const { data } = await api.post(`/medical_records/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default medical_recordsApi;
