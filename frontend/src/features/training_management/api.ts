import axios from 'axios';
import type { TrainingManagement, TrainingManagementCreateInput, TrainingManagementUpdateInput, TrainingManagementListParams, TrainingManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const training_managementApi = {
  list: async (params: TrainingManagementListParams = {}): Promise<TrainingManagementListResponse> => {
    const { data } = await api.get('/training_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<TrainingManagement[]> => {
    const { data } = await api.get('/training_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<TrainingManagement> => {
    const { data } = await api.get(`/training_management/${id}`);
    return data;
  },
  create: async (payload: TrainingManagementCreateInput): Promise<TrainingManagement> => {
    const { data } = await api.post('/training_management', payload);
    return data;
  },
  update: async (id: number, payload: TrainingManagementUpdateInput): Promise<TrainingManagement> => {
    const { data } = await api.put(`/training_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/training_management/${id}`);
  },
  search: async (q: string): Promise<TrainingManagement[]> => {
    const { data } = await api.get('/training_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/training_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/training_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<TrainingManagement> => {
    const { data } = await api.post(`/training_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<TrainingManagement> => {
    const { data } = await api.post(`/training_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<TrainingManagement> => {
    const { data } = await api.post(`/training_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<TrainingManagement> => {
    const { data } = await api.post(`/training_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default training_managementApi;
