import axios from 'axios';
import type { Maintenance, MaintenanceCreateInput, MaintenanceUpdateInput, MaintenanceListParams, MaintenanceListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const maintenanceApi = {
  list: async (params: MaintenanceListParams = {}): Promise<MaintenanceListResponse> => {
    const { data } = await api.get('/maintenance', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Maintenance[]> => {
    const { data } = await api.get('/maintenance/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Maintenance> => {
    const { data } = await api.get(`/maintenance/${id}`);
    return data;
  },
  create: async (payload: MaintenanceCreateInput): Promise<Maintenance> => {
    const { data } = await api.post('/maintenance', payload);
    return data;
  },
  update: async (id: number, payload: MaintenanceUpdateInput): Promise<Maintenance> => {
    const { data } = await api.put(`/maintenance/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/maintenance/${id}`);
  },
  search: async (q: string): Promise<Maintenance[]> => {
    const { data } = await api.get('/maintenance/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/maintenance/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/maintenance/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Maintenance> => {
    const { data } = await api.post(`/maintenance/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Maintenance> => {
    const { data } = await api.post(`/maintenance/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Maintenance> => {
    const { data } = await api.post(`/maintenance/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Maintenance> => {
    const { data } = await api.post(`/maintenance/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default maintenanceApi;
