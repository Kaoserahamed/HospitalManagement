import axios from 'axios';
import type { Credentialing, CredentialingCreateInput, CredentialingUpdateInput, CredentialingListParams, CredentialingListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const credentialingApi = {
  list: async (params: CredentialingListParams = {}): Promise<CredentialingListResponse> => {
    const { data } = await api.get('/credentialing', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Credentialing[]> => {
    const { data } = await api.get('/credentialing/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Credentialing> => {
    const { data } = await api.get(`/credentialing/${id}`);
    return data;
  },
  create: async (payload: CredentialingCreateInput): Promise<Credentialing> => {
    const { data } = await api.post('/credentialing', payload);
    return data;
  },
  update: async (id: number, payload: CredentialingUpdateInput): Promise<Credentialing> => {
    const { data } = await api.put(`/credentialing/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/credentialing/${id}`);
  },
  search: async (q: string): Promise<Credentialing[]> => {
    const { data } = await api.get('/credentialing/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/credentialing/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/credentialing/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Credentialing> => {
    const { data } = await api.post(`/credentialing/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Credentialing> => {
    const { data } = await api.post(`/credentialing/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Credentialing> => {
    const { data } = await api.post(`/credentialing/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Credentialing> => {
    const { data } = await api.post(`/credentialing/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default credentialingApi;
