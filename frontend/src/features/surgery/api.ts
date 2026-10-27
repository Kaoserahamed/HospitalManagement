import axios from 'axios';
import type { Surgery, SurgeryCreateInput, SurgeryUpdateInput, SurgeryListParams, SurgeryListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const surgeryApi = {
  list: async (params: SurgeryListParams = {}): Promise<SurgeryListResponse> => {
    const { data } = await api.get('/surgery', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Surgery[]> => {
    const { data } = await api.get('/surgery/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Surgery> => {
    const { data } = await api.get(`/surgery/${id}`);
    return data;
  },
  create: async (payload: SurgeryCreateInput): Promise<Surgery> => {
    const { data } = await api.post('/surgery', payload);
    return data;
  },
  update: async (id: number, payload: SurgeryUpdateInput): Promise<Surgery> => {
    const { data } = await api.put(`/surgery/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/surgery/${id}`);
  },
  search: async (q: string): Promise<Surgery[]> => {
    const { data } = await api.get('/surgery/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/surgery/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/surgery/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Surgery> => {
    const { data } = await api.post(`/surgery/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Surgery> => {
    const { data } = await api.post(`/surgery/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Surgery> => {
    const { data } = await api.post(`/surgery/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Surgery> => {
    const { data } = await api.post(`/surgery/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default surgeryApi;
