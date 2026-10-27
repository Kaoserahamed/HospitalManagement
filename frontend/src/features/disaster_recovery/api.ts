import axios from 'axios';
import type { DisasterRecovery, DisasterRecoveryCreateInput, DisasterRecoveryUpdateInput, DisasterRecoveryListParams, DisasterRecoveryListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const disaster_recoveryApi = {
  list: async (params: DisasterRecoveryListParams = {}): Promise<DisasterRecoveryListResponse> => {
    const { data } = await api.get('/disaster_recovery', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<DisasterRecovery[]> => {
    const { data } = await api.get('/disaster_recovery/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<DisasterRecovery> => {
    const { data } = await api.get(`/disaster_recovery/${id}`);
    return data;
  },
  create: async (payload: DisasterRecoveryCreateInput): Promise<DisasterRecovery> => {
    const { data } = await api.post('/disaster_recovery', payload);
    return data;
  },
  update: async (id: number, payload: DisasterRecoveryUpdateInput): Promise<DisasterRecovery> => {
    const { data } = await api.put(`/disaster_recovery/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/disaster_recovery/${id}`);
  },
  search: async (q: string): Promise<DisasterRecovery[]> => {
    const { data } = await api.get('/disaster_recovery/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/disaster_recovery/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/disaster_recovery/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<DisasterRecovery> => {
    const { data } = await api.post(`/disaster_recovery/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<DisasterRecovery> => {
    const { data } = await api.post(`/disaster_recovery/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<DisasterRecovery> => {
    const { data } = await api.post(`/disaster_recovery/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<DisasterRecovery> => {
    const { data } = await api.post(`/disaster_recovery/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default disaster_recoveryApi;
