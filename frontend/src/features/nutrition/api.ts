import axios from 'axios';
import type { Nutrition, NutritionCreateInput, NutritionUpdateInput, NutritionListParams, NutritionListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const nutritionApi = {
  list: async (params: NutritionListParams = {}): Promise<NutritionListResponse> => {
    const { data } = await api.get('/nutrition', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<Nutrition[]> => {
    const { data } = await api.get('/nutrition/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<Nutrition> => {
    const { data } = await api.get(`/nutrition/${id}`);
    return data;
  },
  create: async (payload: NutritionCreateInput): Promise<Nutrition> => {
    const { data } = await api.post('/nutrition', payload);
    return data;
  },
  update: async (id: number, payload: NutritionUpdateInput): Promise<Nutrition> => {
    const { data } = await api.put(`/nutrition/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/nutrition/${id}`);
  },
  search: async (q: string): Promise<Nutrition[]> => {
    const { data } = await api.get('/nutrition/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/nutrition/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/nutrition/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<Nutrition> => {
    const { data } = await api.post(`/nutrition/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<Nutrition> => {
    const { data } = await api.post(`/nutrition/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<Nutrition> => {
    const { data } = await api.post(`/nutrition/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<Nutrition> => {
    const { data } = await api.post(`/nutrition/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default nutritionApi;
