import axios from 'axios';
import type { Patient, PatientCreateInput, PatientUpdateInput, PatientListParams, PatientListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const patientApi = {
  list: async (params: PatientListParams = {}): Promise<PatientListResponse> => {
    const { data } = await api.get('/patients', { params });
    return data;
  },
  get: async (id: number): Promise<Patient> => {
    const { data } = await api.get(`/patients/${id}`);
    return data;
  },
  create: async (payload: PatientCreateInput): Promise<Patient> => {
    const { data } = await api.post('/patients', payload);
    return data;
  },
  update: async (id: number, payload: PatientUpdateInput): Promise<Patient> => {
    const { data } = await api.put(`/patients/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
  search: async (q: string): Promise<Patient[]> => {
    const { data } = await api.get(`/patients/search`, { params: { q } });
    return data;
  },
  deactivate: async (id: number): Promise<Patient> => {
    const { data } = await api.post(`/patients/${id}/deactivate`);
    return data;
  },
  reactivate: async (id: number): Promise<Patient> => {
    const { data } = await api.post(`/patients/${id}/reactivate`);
    return data;
  },
};

export default patientApi;
