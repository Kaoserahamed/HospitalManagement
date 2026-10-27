import axios from 'axios';
import type { OccupationalHealth, OccupationalHealthCreateInput, OccupationalHealthUpdateInput, OccupationalHealthListParams, OccupationalHealthListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const occupational_healthApi = {
  list: async (params: OccupationalHealthListParams = {}): Promise<OccupationalHealthListResponse> => {
    const { data } = await api.get('/occupational_health', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<OccupationalHealth[]> => {
    const { data } = await api.get('/occupational_health/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<OccupationalHealth> => {
    const { data } = await api.get(`/occupational_health/${id}`);
    return data;
  },
  create: async (payload: OccupationalHealthCreateInput): Promise<OccupationalHealth> => {
    const { data } = await api.post('/occupational_health', payload);
    return data;
  },
  update: async (id: number, payload: OccupationalHealthUpdateInput): Promise<OccupationalHealth> => {
    const { data } = await api.put(`/occupational_health/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/occupational_health/${id}`);
  },
  search: async (q: string): Promise<OccupationalHealth[]> => {
    const { data } = await api.get('/occupational_health/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/occupational_health/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/occupational_health/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<OccupationalHealth> => {
    const { data } = await api.post(`/occupational_health/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<OccupationalHealth> => {
    const { data } = await api.post(`/occupational_health/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<OccupationalHealth> => {
    const { data } = await api.post(`/occupational_health/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<OccupationalHealth> => {
    const { data } = await api.post(`/occupational_health/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default occupational_healthApi;
