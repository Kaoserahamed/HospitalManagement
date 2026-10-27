import axios from 'axios';
import type { AllergyManagement, AllergyManagementCreateInput, AllergyManagementUpdateInput, AllergyManagementListParams, AllergyManagementListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const allergy_managementApi = {
  list: async (params: AllergyManagementListParams = {}): Promise<AllergyManagementListResponse> => {
    const { data } = await api.get('/allergy_management', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<AllergyManagement[]> => {
    const { data } = await api.get('/allergy_management/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<AllergyManagement> => {
    const { data } = await api.get(`/allergy_management/${id}`);
    return data;
  },
  create: async (payload: AllergyManagementCreateInput): Promise<AllergyManagement> => {
    const { data } = await api.post('/allergy_management', payload);
    return data;
  },
  update: async (id: number, payload: AllergyManagementUpdateInput): Promise<AllergyManagement> => {
    const { data } = await api.put(`/allergy_management/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/allergy_management/${id}`);
  },
  search: async (q: string): Promise<AllergyManagement[]> => {
    const { data } = await api.get('/allergy_management/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/allergy_management/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/allergy_management/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<AllergyManagement> => {
    const { data } = await api.post(`/allergy_management/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<AllergyManagement> => {
    const { data } = await api.post(`/allergy_management/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<AllergyManagement> => {
    const { data } = await api.post(`/allergy_management/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<AllergyManagement> => {
    const { data } = await api.post(`/allergy_management/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default allergy_managementApi;
