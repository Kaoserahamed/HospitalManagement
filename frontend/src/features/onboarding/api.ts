import axios from 'axios';
import type { Onboarding, OnboardingCreateInput, OnboardingUpdateInput, OnboardingListParams, OnboardingListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const onboardingApi = {
  list: async (params: OnboardingListParams = {}): Promise<OnboardingListResponse> => {
    const { data } = await api.get('/onboarding', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Onboarding[]> => {
    const { data } = await api.get('/onboarding/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Onboarding> => {
    const { data } = await api.get(`/onboarding/${id}`);
    return data;
  },
  create: async (payload: OnboardingCreateInput): Promise<Onboarding> => {
    const { data } = await api.post('/onboarding', payload);
    return data;
  },
  update: async (id: number, payload: OnboardingUpdateInput): Promise<Onboarding> => {
    const { data } = await api.put(`/onboarding/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/onboarding/${id}`);
  },
  search: async (q: string): Promise<Onboarding[]> => {
    const { data } = await api.get('/onboarding/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/onboarding/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/onboarding/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Onboarding> => {
    const { data } = await api.post(`/onboarding/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Onboarding> => {
    const { data } = await api.post(`/onboarding/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Onboarding> => {
    const { data } = await api.post(`/onboarding/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Onboarding> => {
    const { data } = await api.post(`/onboarding/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default onboardingApi;
