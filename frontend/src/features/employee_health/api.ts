import axios from 'axios';
import type { EmployeeHealth, EmployeeHealthCreateInput, EmployeeHealthUpdateInput, EmployeeHealthListParams, EmployeeHealthListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const employee_healthApi = {
  list: async (params: EmployeeHealthListParams = {}): Promise<EmployeeHealthListResponse> => {
    const { data } = await api.get('/employee_health', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<EmployeeHealth[]> => {
    const { data } = await api.get('/employee_health/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<EmployeeHealth> => {
    const { data } = await api.get(`/employee_health/${id}`);
    return data;
  },
  create: async (payload: EmployeeHealthCreateInput): Promise<EmployeeHealth> => {
    const { data } = await api.post('/employee_health', payload);
    return data;
  },
  update: async (id: number, payload: EmployeeHealthUpdateInput): Promise<EmployeeHealth> => {
    const { data } = await api.put(`/employee_health/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/employee_health/${id}`);
  },
  search: async (q: string): Promise<EmployeeHealth[]> => {
    const { data } = await api.get('/employee_health/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/employee_health/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/employee_health/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<EmployeeHealth> => {
    const { data } = await api.post(`/employee_health/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<EmployeeHealth> => {
    const { data } = await api.post(`/employee_health/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<EmployeeHealth> => {
    const { data } = await api.post(`/employee_health/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<EmployeeHealth> => {
    const { data } = await api.post(`/employee_health/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default employee_healthApi;
