import axios from 'axios';
import type { ReferralManagement, ReferralManagementCreateInput, ReferralManagementUpdateInput, ReferralManagementListParams, ReferralManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const referral_managementApi = {
  list: async (params: ReferralManagementListParams = {}): Promise<ReferralManagementListResponse> => {
    const { data } = await api.get('/referral_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<ReferralManagement[]> => {
    const { data } = await api.get('/referral_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<ReferralManagement> => {
    const { data } = await api.get(`/referral_management/${id}`);
    return data;
  },
  create: async (payload: ReferralManagementCreateInput): Promise<ReferralManagement> => {
    const { data } = await api.post('/referral_management', payload);
    return data;
  },
  update: async (id: number, payload: ReferralManagementUpdateInput): Promise<ReferralManagement> => {
    const { data } = await api.put(`/referral_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/referral_management/${id}`);
  },
  search: async (q: string): Promise<ReferralManagement[]> => {
    const { data } = await api.get('/referral_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/referral_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/referral_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<ReferralManagement> => {
    const { data } = await api.post(`/referral_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<ReferralManagement> => {
    const { data } = await api.post(`/referral_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<ReferralManagement> => {
    const { data } = await api.post(`/referral_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<ReferralManagement> => {
    const { data } = await api.post(`/referral_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default referral_managementApi;
