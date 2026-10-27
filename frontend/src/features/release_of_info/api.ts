import axios from 'axios';
import type { ReleaseOfInfo, ReleaseOfInfoCreateInput, ReleaseOfInfoUpdateInput, ReleaseOfInfoListParams, ReleaseOfInfoListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const release_of_infoApi = {
  list: async (params: ReleaseOfInfoListParams = {}): Promise<ReleaseOfInfoListResponse> => {
    const { data } = await api.get('/release_of_info', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<ReleaseOfInfo[]> => {
    const { data } = await api.get('/release_of_info/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<ReleaseOfInfo> => {
    const { data } = await api.get(`/release_of_info/${id}`);
    return data;
  },
  create: async (payload: ReleaseOfInfoCreateInput): Promise<ReleaseOfInfo> => {
    const { data } = await api.post('/release_of_info', payload);
    return data;
  },
  update: async (id: number, payload: ReleaseOfInfoUpdateInput): Promise<ReleaseOfInfo> => {
    const { data } = await api.put(`/release_of_info/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/release_of_info/${id}`);
  },
  search: async (q: string): Promise<ReleaseOfInfo[]> => {
    const { data } = await api.get('/release_of_info/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/release_of_info/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/release_of_info/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<ReleaseOfInfo> => {
    const { data } = await api.post(`/release_of_info/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<ReleaseOfInfo> => {
    const { data } = await api.post(`/release_of_info/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<ReleaseOfInfo> => {
    const { data } = await api.post(`/release_of_info/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<ReleaseOfInfo> => {
    const { data } = await api.post(`/release_of_info/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default release_of_infoApi;
