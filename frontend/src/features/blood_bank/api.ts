import axios from 'axios';
import type { BloodBank, BloodBankCreateInput, BloodBankUpdateInput, BloodBankListParams, BloodBankListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const blood_bankApi = {
  list: async (params: BloodBankListParams = {}): Promise<BloodBankListResponse> => {
    const { data } = await api.get('/blood_bank', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<BloodBank[]> => {
    const { data } = await api.get('/blood_bank/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<BloodBank> => {
    const { data } = await api.get(`/blood_bank/${id}`);
    return data;
  },
  create: async (payload: BloodBankCreateInput): Promise<BloodBank> => {
    const { data } = await api.post('/blood_bank', payload);
    return data;
  },
  update: async (id: number, payload: BloodBankUpdateInput): Promise<BloodBank> => {
    const { data } = await api.put(`/blood_bank/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/blood_bank/${id}`);
  },
  search: async (q: string): Promise<BloodBank[]> => {
    const { data } = await api.get('/blood_bank/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/blood_bank/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/blood_bank/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<BloodBank> => {
    const { data } = await api.post(`/blood_bank/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<BloodBank> => {
    const { data } = await api.post(`/blood_bank/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<BloodBank> => {
    const { data } = await api.post(`/blood_bank/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<BloodBank> => {
    const { data } = await api.post(`/blood_bank/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default blood_bankApi;
