import axios from 'axios';
import type { LeaveManagement, LeaveManagementCreateInput, LeaveManagementUpdateInput, LeaveManagementListParams, LeaveManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const leave_managementApi = {
  list: async (params: LeaveManagementListParams = {}): Promise<LeaveManagementListResponse> => {
    const { data } = await api.get('/leave_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<LeaveManagement[]> => {
    const { data } = await api.get('/leave_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<LeaveManagement> => {
    const { data } = await api.get(`/leave_management/${id}`);
    return data;
  },
  create: async (payload: LeaveManagementCreateInput): Promise<LeaveManagement> => {
    const { data } = await api.post('/leave_management', payload);
    return data;
  },
  update: async (id: number, payload: LeaveManagementUpdateInput): Promise<LeaveManagement> => {
    const { data } = await api.put(`/leave_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/leave_management/${id}`);
  },
  search: async (q: string): Promise<LeaveManagement[]> => {
    const { data } = await api.get('/leave_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/leave_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/leave_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<LeaveManagement> => {
    const { data } = await api.post(`/leave_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<LeaveManagement> => {
    const { data } = await api.post(`/leave_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<LeaveManagement> => {
    const { data } = await api.post(`/leave_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<LeaveManagement> => {
    const { data } = await api.post(`/leave_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default leave_managementApi;
