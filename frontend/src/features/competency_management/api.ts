import axios from 'axios';
import type { CompetencyManagement, CompetencyManagementCreateInput, CompetencyManagementUpdateInput, CompetencyManagementListParams, CompetencyManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const competency_managementApi = {
  list: async (params: CompetencyManagementListParams = {}): Promise<CompetencyManagementListResponse> => {
    const { data } = await api.get('/competency_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<CompetencyManagement[]> => {
    const { data } = await api.get('/competency_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<CompetencyManagement> => {
    const { data } = await api.get(`/competency_management/${id}`);
    return data;
  },
  create: async (payload: CompetencyManagementCreateInput): Promise<CompetencyManagement> => {
    const { data } = await api.post('/competency_management', payload);
    return data;
  },
  update: async (id: number, payload: CompetencyManagementUpdateInput): Promise<CompetencyManagement> => {
    const { data } = await api.put(`/competency_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/competency_management/${id}`);
  },
  search: async (q: string): Promise<CompetencyManagement[]> => {
    const { data } = await api.get('/competency_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/competency_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/competency_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<CompetencyManagement> => {
    const { data } = await api.post(`/competency_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<CompetencyManagement> => {
    const { data } = await api.post(`/competency_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<CompetencyManagement> => {
    const { data } = await api.post(`/competency_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<CompetencyManagement> => {
    const { data } = await api.post(`/competency_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default competency_managementApi;
