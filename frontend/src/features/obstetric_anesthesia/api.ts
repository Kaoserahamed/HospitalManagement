import axios from 'axios';
import type { ObstetricAnesthesia, ObstetricAnesthesiaCreateInput, ObstetricAnesthesiaUpdateInput, ObstetricAnesthesiaListParams, ObstetricAnesthesiaListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const obstetric_anesthesiaApi = {
  list: async (params: ObstetricAnesthesiaListParams = {}): Promise<ObstetricAnesthesiaListResponse> => {
    const { data } = await api.get('/obstetric_anesthesia', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<ObstetricAnesthesia[]> => {
    const { data } = await api.get('/obstetric_anesthesia/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<ObstetricAnesthesia> => {
    const { data } = await api.get(`/obstetric_anesthesia/${id}`);
    return data;
  },
  create: async (payload: ObstetricAnesthesiaCreateInput): Promise<ObstetricAnesthesia> => {
    const { data } = await api.post('/obstetric_anesthesia', payload);
    return data;
  },
  update: async (id: number, payload: ObstetricAnesthesiaUpdateInput): Promise<ObstetricAnesthesia> => {
    const { data } = await api.put(`/obstetric_anesthesia/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/obstetric_anesthesia/${id}`);
  },
  search: async (q: string): Promise<ObstetricAnesthesia[]> => {
    const { data } = await api.get('/obstetric_anesthesia/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/obstetric_anesthesia/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/obstetric_anesthesia/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<ObstetricAnesthesia> => {
    const { data } = await api.post(`/obstetric_anesthesia/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<ObstetricAnesthesia> => {
    const { data } = await api.post(`/obstetric_anesthesia/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<ObstetricAnesthesia> => {
    const { data } = await api.post(`/obstetric_anesthesia/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<ObstetricAnesthesia> => {
    const { data } = await api.post(`/obstetric_anesthesia/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default obstetric_anesthesiaApi;
