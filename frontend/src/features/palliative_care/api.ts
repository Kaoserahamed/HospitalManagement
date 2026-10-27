import axios from 'axios';
import type { PalliativeCare, PalliativeCareCreateInput, PalliativeCareUpdateInput, PalliativeCareListParams, PalliativeCareListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const palliative_careApi = {
  list: async (params: PalliativeCareListParams = {}): Promise<PalliativeCareListResponse> => {
    const { data } = await api.get('/palliative_care', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<PalliativeCare[]> => {
    const { data } = await api.get('/palliative_care/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<PalliativeCare> => {
    const { data } = await api.get(`/palliative_care/${id}`);
    return data;
  },
  create: async (payload: PalliativeCareCreateInput): Promise<PalliativeCare> => {
    const { data } = await api.post('/palliative_care', payload);
    return data;
  },
  update: async (id: number, payload: PalliativeCareUpdateInput): Promise<PalliativeCare> => {
    const { data } = await api.put(`/palliative_care/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/palliative_care/${id}`);
  },
  search: async (q: string): Promise<PalliativeCare[]> => {
    const { data } = await api.get('/palliative_care/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/palliative_care/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/palliative_care/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<PalliativeCare> => {
    const { data } = await api.post(`/palliative_care/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<PalliativeCare> => {
    const { data } = await api.post(`/palliative_care/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<PalliativeCare> => {
    const { data } = await api.post(`/palliative_care/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<PalliativeCare> => {
    const { data } = await api.post(`/palliative_care/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default palliative_careApi;
