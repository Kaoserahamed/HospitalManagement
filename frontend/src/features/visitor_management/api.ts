import axios from 'axios';
import type { VisitorManagement, VisitorManagementCreateInput, VisitorManagementUpdateInput, VisitorManagementListParams, VisitorManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const visitor_managementApi = {
  list: async (params: VisitorManagementListParams = {}): Promise<VisitorManagementListResponse> => {
    const { data } = await api.get('/visitor_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<VisitorManagement[]> => {
    const { data } = await api.get('/visitor_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<VisitorManagement> => {
    const { data } = await api.get(`/visitor_management/${id}`);
    return data;
  },
  create: async (payload: VisitorManagementCreateInput): Promise<VisitorManagement> => {
    const { data } = await api.post('/visitor_management', payload);
    return data;
  },
  update: async (id: number, payload: VisitorManagementUpdateInput): Promise<VisitorManagement> => {
    const { data } = await api.put(`/visitor_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/visitor_management/${id}`);
  },
  search: async (q: string): Promise<VisitorManagement[]> => {
    const { data } = await api.get('/visitor_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/visitor_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/visitor_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<VisitorManagement> => {
    const { data } = await api.post(`/visitor_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<VisitorManagement> => {
    const { data } = await api.post(`/visitor_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<VisitorManagement> => {
    const { data } = await api.post(`/visitor_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<VisitorManagement> => {
    const { data } = await api.post(`/visitor_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default visitor_managementApi;
