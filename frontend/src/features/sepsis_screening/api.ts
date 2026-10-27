import axios from 'axios';
import type { SepsisScreening, SepsisScreeningCreateInput, SepsisScreeningUpdateInput, SepsisScreeningListParams, SepsisScreeningListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const sepsis_screeningApi = {
  list: async (params: SepsisScreeningListParams = {}): Promise<SepsisScreeningListResponse> => {
    const { data } = await api.get('/sepsis_screening', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<SepsisScreening[]> => {
    const { data } = await api.get('/sepsis_screening/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<SepsisScreening> => {
    const { data } = await api.get(`/sepsis_screening/${id}`);
    return data;
  },
  create: async (payload: SepsisScreeningCreateInput): Promise<SepsisScreening> => {
    const { data } = await api.post('/sepsis_screening', payload);
    return data;
  },
  update: async (id: number, payload: SepsisScreeningUpdateInput): Promise<SepsisScreening> => {
    const { data } = await api.put(`/sepsis_screening/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/sepsis_screening/${id}`);
  },
  search: async (q: string): Promise<SepsisScreening[]> => {
    const { data } = await api.get('/sepsis_screening/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/sepsis_screening/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/sepsis_screening/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<SepsisScreening> => {
    const { data } = await api.post(`/sepsis_screening/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<SepsisScreening> => {
    const { data } = await api.post(`/sepsis_screening/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<SepsisScreening> => {
    const { data } = await api.post(`/sepsis_screening/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<SepsisScreening> => {
    const { data } = await api.post(`/sepsis_screening/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default sepsis_screeningApi;
