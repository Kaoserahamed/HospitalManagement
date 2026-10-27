import axios from 'axios';
import type { PatientSatisfaction, PatientSatisfactionCreateInput, PatientSatisfactionUpdateInput, PatientSatisfactionListParams, PatientSatisfactionListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const patient_satisfactionApi = {
  list: async (params: PatientSatisfactionListParams = {}): Promise<PatientSatisfactionListResponse> => {
    const { data } = await api.get('/patient_satisfaction', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<PatientSatisfaction[]> => {
    const { data } = await api.get('/patient_satisfaction/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<PatientSatisfaction> => {
    const { data } = await api.get(`/patient_satisfaction/${id}`);
    return data;
  },
  create: async (payload: PatientSatisfactionCreateInput): Promise<PatientSatisfaction> => {
    const { data } = await api.post('/patient_satisfaction', payload);
    return data;
  },
  update: async (id: number, payload: PatientSatisfactionUpdateInput): Promise<PatientSatisfaction> => {
    const { data } = await api.put(`/patient_satisfaction/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/patient_satisfaction/${id}`);
  },
  search: async (q: string): Promise<PatientSatisfaction[]> => {
    const { data } = await api.get('/patient_satisfaction/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/patient_satisfaction/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/patient_satisfaction/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<PatientSatisfaction> => {
    const { data } = await api.post(`/patient_satisfaction/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<PatientSatisfaction> => {
    const { data } = await api.post(`/patient_satisfaction/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<PatientSatisfaction> => {
    const { data } = await api.post(`/patient_satisfaction/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<PatientSatisfaction> => {
    const { data } = await api.post(`/patient_satisfaction/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default patient_satisfactionApi;
