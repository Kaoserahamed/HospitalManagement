import axios from 'axios';
import type { PopulationHealthExtra, PopulationHealthExtraCreateInput, PopulationHealthExtraUpdateInput, PopulationHealthExtraListParams, PopulationHealthExtraListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const population_health_extraApi = {
  list: async (params: PopulationHealthExtraListParams = {}): Promise<PopulationHealthExtraListResponse> => {
    const { data } = await api.get('/population_health_extra', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<PopulationHealthExtra[]> => {
    const { data } = await api.get('/population_health_extra/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<PopulationHealthExtra> => {
    const { data } = await api.get(`/population_health_extra/${id}`);
    return data;
  },
  create: async (payload: PopulationHealthExtraCreateInput): Promise<PopulationHealthExtra> => {
    const { data } = await api.post('/population_health_extra', payload);
    return data;
  },
  update: async (id: number, payload: PopulationHealthExtraUpdateInput): Promise<PopulationHealthExtra> => {
    const { data } = await api.put(`/population_health_extra/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/population_health_extra/${id}`);
  },
  search: async (q: string): Promise<PopulationHealthExtra[]> => {
    const { data } = await api.get('/population_health_extra/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/population_health_extra/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/population_health_extra/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<PopulationHealthExtra> => {
    const { data } = await api.post(`/population_health_extra/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<PopulationHealthExtra> => {
    const { data } = await api.post(`/population_health_extra/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<PopulationHealthExtra> => {
    const { data } = await api.post(`/population_health_extra/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<PopulationHealthExtra> => {
    const { data } = await api.post(`/population_health_extra/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default population_health_extraApi;
