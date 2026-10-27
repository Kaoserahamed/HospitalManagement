import axios from 'axios';
import type { Recruitment, RecruitmentCreateInput, RecruitmentUpdateInput, RecruitmentListParams, RecruitmentListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const recruitmentApi = {
  list: async (params: RecruitmentListParams = {}): Promise<RecruitmentListResponse> => {
    const { data } = await api.get('/recruitment', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Recruitment[]> => {
    const { data } = await api.get('/recruitment/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Recruitment> => {
    const { data } = await api.get(`/recruitment/${id}`);
    return data;
  },
  create: async (payload: RecruitmentCreateInput): Promise<Recruitment> => {
    const { data } = await api.post('/recruitment', payload);
    return data;
  },
  update: async (id: number, payload: RecruitmentUpdateInput): Promise<Recruitment> => {
    const { data } = await api.put(`/recruitment/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/recruitment/${id}`);
  },
  search: async (q: string): Promise<Recruitment[]> => {
    const { data } = await api.get('/recruitment/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/recruitment/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/recruitment/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Recruitment> => {
    const { data } = await api.post(`/recruitment/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Recruitment> => {
    const { data } = await api.post(`/recruitment/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Recruitment> => {
    const { data } = await api.post(`/recruitment/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Recruitment> => {
    const { data } = await api.post(`/recruitment/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default recruitmentApi;
