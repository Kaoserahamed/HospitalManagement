import axios from 'axios';
import type { Payroll, PayrollCreateInput, PayrollUpdateInput, PayrollListParams, PayrollListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const payrollApi = {
  list: async (params: PayrollListParams = {}): Promise<PayrollListResponse> => {
    const { data } = await api.get('/payroll', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Payroll[]> => {
    const { data } = await api.get('/payroll/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Payroll> => {
    const { data } = await api.get(`/payroll/${id}`);
    return data;
  },
  create: async (payload: PayrollCreateInput): Promise<Payroll> => {
    const { data } = await api.post('/payroll', payload);
    return data;
  },
  update: async (id: number, payload: PayrollUpdateInput): Promise<Payroll> => {
    const { data } = await api.put(`/payroll/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/payroll/${id}`);
  },
  search: async (q: string): Promise<Payroll[]> => {
    const { data } = await api.get('/payroll/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/payroll/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/payroll/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Payroll> => {
    const { data } = await api.post(`/payroll/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Payroll> => {
    const { data } = await api.post(`/payroll/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Payroll> => {
    const { data } = await api.post(`/payroll/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Payroll> => {
    const { data } = await api.post(`/payroll/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default payrollApi;
