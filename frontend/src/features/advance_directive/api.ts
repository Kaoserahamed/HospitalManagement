import axios from 'axios';
import type { AdvanceDirective, AdvanceDirectiveCreateInput, AdvanceDirectiveUpdateInput, AdvanceDirectiveListParams, AdvanceDirectiveListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const advance_directiveApi = {
  list: async (params: AdvanceDirectiveListParams = {}): Promise<AdvanceDirectiveListResponse> => {
    const { data } = await api.get('/advance_directive', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<AdvanceDirective[]> => {
    const { data } = await api.get('/advance_directive/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<AdvanceDirective> => {
    const { data } = await api.get(`/advance_directive/${id}`);
    return data;
  },
  create: async (payload: AdvanceDirectiveCreateInput): Promise<AdvanceDirective> => {
    const { data } = await api.post('/advance_directive', payload);
    return data;
  },
  update: async (id: number, payload: AdvanceDirectiveUpdateInput): Promise<AdvanceDirective> => {
    const { data } = await api.put(`/advance_directive/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/advance_directive/${id}`);
  },
  search: async (q: string): Promise<AdvanceDirective[]> => {
    const { data } = await api.get('/advance_directive/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/advance_directive/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/advance_directive/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<AdvanceDirective> => {
    const { data } = await api.post(`/advance_directive/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<AdvanceDirective> => {
    const { data } = await api.post(`/advance_directive/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<AdvanceDirective> => {
    const { data } = await api.post(`/advance_directive/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<AdvanceDirective> => {
    const { data } = await api.post(`/advance_directive/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default advance_directiveApi;
