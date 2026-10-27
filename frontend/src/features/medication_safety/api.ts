import axios from 'axios';
import type { MedicationSafety, MedicationSafetyCreateInput, MedicationSafetyUpdateInput, MedicationSafetyListParams, MedicationSafetyListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const medication_safetyApi = {
  list: async (params: MedicationSafetyListParams = {}): Promise<MedicationSafetyListResponse> => {
    const { data } = await api.get('/medication_safety', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<MedicationSafety[]> => {
    const { data } = await api.get('/medication_safety/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<MedicationSafety> => {
    const { data } = await api.get(`/medication_safety/${id}`);
    return data;
  },
  create: async (payload: MedicationSafetyCreateInput): Promise<MedicationSafety> => {
    const { data } = await api.post('/medication_safety', payload);
    return data;
  },
  update: async (id: number, payload: MedicationSafetyUpdateInput): Promise<MedicationSafety> => {
    const { data } = await api.put(`/medication_safety/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/medication_safety/${id}`);
  },
  search: async (q: string): Promise<MedicationSafety[]> => {
    const { data } = await api.get('/medication_safety/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/medication_safety/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/medication_safety/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<MedicationSafety> => {
    const { data } = await api.post(`/medication_safety/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<MedicationSafety> => {
    const { data } = await api.post(`/medication_safety/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<MedicationSafety> => {
    const { data } = await api.post(`/medication_safety/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<MedicationSafety> => {
    const { data } = await api.post(`/medication_safety/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default medication_safetyApi;
