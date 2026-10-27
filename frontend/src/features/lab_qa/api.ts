import axios from 'axios';
import type { LabQa, LabQaCreateInput, LabQaUpdateInput, LabQaListParams, LabQaListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const lab_qaApi = {
  list: async (params: LabQaListParams = {}): Promise<LabQaListResponse> => {
    const { data } = await api.get('/lab_qa', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<LabQa[]> => {
    const { data } = await api.get('/lab_qa/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<LabQa> => {
    const { data } = await api.get(`/lab_qa/${id}`);
    return data;
  },
  create: async (payload: LabQaCreateInput): Promise<LabQa> => {
    const { data } = await api.post('/lab_qa', payload);
    return data;
  },
  update: async (id: number, payload: LabQaUpdateInput): Promise<LabQa> => {
    const { data } = await api.put(`/lab_qa/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/lab_qa/${id}`);
  },
  search: async (q: string): Promise<LabQa[]> => {
    const { data } = await api.get('/lab_qa/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/lab_qa/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/lab_qa/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<LabQa> => {
    const { data } = await api.post(`/lab_qa/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<LabQa> => {
    const { data } = await api.post(`/lab_qa/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<LabQa> => {
    const { data } = await api.post(`/lab_qa/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<LabQa> => {
    const { data } = await api.post(`/lab_qa/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default lab_qaApi;
