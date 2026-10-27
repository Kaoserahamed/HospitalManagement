import axios from 'axios';
import type { ConsentManagement, ConsentManagementCreateInput, ConsentManagementUpdateInput, ConsentManagementListParams, ConsentManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const consent_managementApi = {
  list: async (params: ConsentManagementListParams = {}): Promise<ConsentManagementListResponse> => {
    const { data } = await api.get('/consent_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<ConsentManagement[]> => {
    const { data } = await api.get('/consent_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<ConsentManagement> => {
    const { data } = await api.get(`/consent_management/${id}`);
    return data;
  },
  create: async (payload: ConsentManagementCreateInput): Promise<ConsentManagement> => {
    const { data } = await api.post('/consent_management', payload);
    return data;
  },
  update: async (id: number, payload: ConsentManagementUpdateInput): Promise<ConsentManagement> => {
    const { data } = await api.put(`/consent_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/consent_management/${id}`);
  },
  search: async (q: string): Promise<ConsentManagement[]> => {
    const { data } = await api.get('/consent_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/consent_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/consent_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<ConsentManagement> => {
    const { data } = await api.post(`/consent_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<ConsentManagement> => {
    const { data } = await api.post(`/consent_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<ConsentManagement> => {
    const { data } = await api.post(`/consent_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<ConsentManagement> => {
    const { data } = await api.post(`/consent_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default consent_managementApi;
