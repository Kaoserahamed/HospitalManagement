import axios from 'axios';
import type { ClinicalNotes, ClinicalNotesCreateInput, ClinicalNotesUpdateInput, ClinicalNotesListParams, ClinicalNotesListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const clinical_notesApi = {
  list: async (params: ClinicalNotesListParams = {}): Promise<ClinicalNotesListResponse> => {
    const { data } = await api.get('/clinical_notes', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<ClinicalNotes[]> => {
    const { data } = await api.get('/clinical_notes/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<ClinicalNotes> => {
    const { data } = await api.get(`/clinical_notes/${id}`);
    return data;
  },
  create: async (payload: ClinicalNotesCreateInput): Promise<ClinicalNotes> => {
    const { data } = await api.post('/clinical_notes', payload);
    return data;
  },
  update: async (id: number, payload: ClinicalNotesUpdateInput): Promise<ClinicalNotes> => {
    const { data } = await api.put(`/clinical_notes/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/clinical_notes/${id}`);
  },
  search: async (q: string): Promise<ClinicalNotes[]> => {
    const { data } = await api.get('/clinical_notes/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/clinical_notes/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/clinical_notes/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<ClinicalNotes> => {
    const { data } = await api.post(`/clinical_notes/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<ClinicalNotes> => {
    const { data } = await api.post(`/clinical_notes/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<ClinicalNotes> => {
    const { data } = await api.post(`/clinical_notes/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<ClinicalNotes> => {
    const { data } = await api.post(`/clinical_notes/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default clinical_notesApi;
