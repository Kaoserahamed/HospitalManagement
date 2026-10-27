import axios from 'axios';
import type { PainManagement, PainManagementCreateInput, PainManagementUpdateInput, PainManagementListParams, PainManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const pain_managementApi = {
  list: async (params: PainManagementListParams = {}): Promise<PainManagementListResponse> => {
    const { data } = await api.get('/pain_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<PainManagement[]> => {
    const { data } = await api.get('/pain_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<PainManagement> => {
    const { data } = await api.get(`/pain_management/${id}`);
    return data;
  },
  create: async (payload: PainManagementCreateInput): Promise<PainManagement> => {
    const { data } = await api.post('/pain_management', payload);
    return data;
  },
  update: async (id: number, payload: PainManagementUpdateInput): Promise<PainManagement> => {
    const { data } = await api.put(`/pain_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/pain_management/${id}`);
  },
  search: async (q: string): Promise<PainManagement[]> => {
    const { data } = await api.get('/pain_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/pain_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/pain_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<PainManagement> => {
    const { data } = await api.post(`/pain_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<PainManagement> => {
    const { data } = await api.post(`/pain_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<PainManagement> => {
    const { data } = await api.post(`/pain_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<PainManagement> => {
    const { data } = await api.post(`/pain_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default pain_managementApi;
