import axios from 'axios';
import type { PatientEducation, PatientEducationCreateInput, PatientEducationUpdateInput, PatientEducationListParams, PatientEducationListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const patient_educationApi = {
  list: async (params: PatientEducationListParams = {}): Promise<PatientEducationListResponse> => {
    const { data } = await api.get('/patient_education', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<PatientEducation[]> => {
    const { data } = await api.get('/patient_education/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<PatientEducation> => {
    const { data } = await api.get(`/patient_education/${id}`);
    return data;
  },
  create: async (payload: PatientEducationCreateInput): Promise<PatientEducation> => {
    const { data } = await api.post('/patient_education', payload);
    return data;
  },
  update: async (id: number, payload: PatientEducationUpdateInput): Promise<PatientEducation> => {
    const { data } = await api.put(`/patient_education/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/patient_education/${id}`);
  },
  search: async (q: string): Promise<PatientEducation[]> => {
    const { data } = await api.get('/patient_education/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/patient_education/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/patient_education/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<PatientEducation> => {
    const { data } = await api.post(`/patient_education/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<PatientEducation> => {
    const { data } = await api.post(`/patient_education/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<PatientEducation> => {
    const { data } = await api.post(`/patient_education/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<PatientEducation> => {
    const { data } = await api.post(`/patient_education/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default patient_educationApi;
