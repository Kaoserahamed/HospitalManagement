import axios from 'axios';
import type { BedManagement, BedManagementCreateInput, BedManagementUpdateInput, BedManagementListParams, BedManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const bed_managementApi = {
  list: async (params: BedManagementListParams = {}): Promise<BedManagementListResponse> => {
    const { data } = await api.get('/bed_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<BedManagement[]> => {
    const { data } = await api.get('/bed_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<BedManagement> => {
    const { data } = await api.get(`/bed_management/${id}`);
    return data;
  },
  create: async (payload: BedManagementCreateInput): Promise<BedManagement> => {
    const { data } = await api.post('/bed_management', payload);
    return data;
  },
  update: async (id: number, payload: BedManagementUpdateInput): Promise<BedManagement> => {
    const { data } = await api.put(`/bed_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/bed_management/${id}`);
  },
  search: async (q: string): Promise<BedManagement[]> => {
    const { data } = await api.get('/bed_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/bed_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/bed_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<BedManagement> => {
    const { data } = await api.post(`/bed_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<BedManagement> => {
    const { data } = await api.post(`/bed_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<BedManagement> => {
    const { data } = await api.post(`/bed_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<BedManagement> => {
    const { data } = await api.post(`/bed_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default bed_managementApi;
