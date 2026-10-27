import axios from 'axios';
import type { VitalSigns, VitalSignsCreateInput, VitalSignsUpdateInput, VitalSignsListParams, VitalSignsListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const vital_signsApi = {
  list: async (params: VitalSignsListParams = {}): Promise<VitalSignsListResponse> => {
    const { data } = await api.get('/vital_signs', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<VitalSigns[]> => {
    const { data } = await api.get('/vital_signs/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<VitalSigns> => {
    const { data } = await api.get(`/vital_signs/${id}`);
    return data;
  },
  create: async (payload: VitalSignsCreateInput): Promise<VitalSigns> => {
    const { data } = await api.post('/vital_signs', payload);
    return data;
  },
  update: async (id: number, payload: VitalSignsUpdateInput): Promise<VitalSigns> => {
    const { data } = await api.put(`/vital_signs/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/vital_signs/${id}`);
  },
  search: async (q: string): Promise<VitalSigns[]> => {
    const { data } = await api.get('/vital_signs/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/vital_signs/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/vital_signs/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<VitalSigns> => {
    const { data } = await api.post(`/vital_signs/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<VitalSigns> => {
    const { data } = await api.post(`/vital_signs/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<VitalSigns> => {
    const { data } = await api.post(`/vital_signs/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<VitalSigns> => {
    const { data } = await api.post(`/vital_signs/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default vital_signsApi;
