import axios from 'axios';
import type { WearableIntegration, WearableIntegrationCreateInput, WearableIntegrationUpdateInput, WearableIntegrationListParams, WearableIntegrationListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const wearable_integrationApi = {
  list: async (params: WearableIntegrationListParams = {}): Promise<WearableIntegrationListResponse> => {
    const { data } = await api.get('/wearable_integration', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<WearableIntegration[]> => {
    const { data } = await api.get('/wearable_integration/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<WearableIntegration> => {
    const { data } = await api.get(`/wearable_integration/${id}`);
    return data;
  },
  create: async (payload: WearableIntegrationCreateInput): Promise<WearableIntegration> => {
    const { data } = await api.post('/wearable_integration', payload);
    return data;
  },
  update: async (id: number, payload: WearableIntegrationUpdateInput): Promise<WearableIntegration> => {
    const { data } = await api.put(`/wearable_integration/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/wearable_integration/${id}`);
  },
  search: async (q: string): Promise<WearableIntegration[]> => {
    const { data } = await api.get('/wearable_integration/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/wearable_integration/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/wearable_integration/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<WearableIntegration> => {
    const { data } = await api.post(`/wearable_integration/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<WearableIntegration> => {
    const { data } = await api.post(`/wearable_integration/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<WearableIntegration> => {
    const { data } = await api.post(`/wearable_integration/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<WearableIntegration> => {
    const { data } = await api.post(`/wearable_integration/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default wearable_integrationApi;
