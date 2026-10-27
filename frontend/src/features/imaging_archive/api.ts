import axios from 'axios';
import type { ImagingArchive, ImagingArchiveCreateInput, ImagingArchiveUpdateInput, ImagingArchiveListParams, ImagingArchiveListResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const imaging_archiveApi = {
  list: async (params: ImagingArchiveListParams = {}): Promise<ImagingArchiveListResponse> => {
    const { data } = await api.get('/imaging_archive', { params });
    return data;
  },
  getAll: async (patientId?: number): Promise<ImagingArchive[]> => {
    const { data } = await api.get('/imaging_archive/all', { params: { patient_id: patientId } });
    return data;
  },
  get: async (id: number): Promise<ImagingArchive> => {
    const { data } = await api.get(`/imaging_archive/${id}`);
    return data;
  },
  create: async (payload: ImagingArchiveCreateInput): Promise<ImagingArchive> => {
    const { data } = await api.post('/imaging_archive', payload);
    return data;
  },
  update: async (id: number, payload: ImagingArchiveUpdateInput): Promise<ImagingArchive> => {
    const { data } = await api.put(`/imaging_archive/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/imaging_archive/${id}`);
  },
  search: async (q: string): Promise<ImagingArchive[]> => {
    const { data } = await api.get('/imaging_archive/search', { params: { q } });
    return data;
  },
  count: async (): Promise<number> => {
    const { data } = await api.get('/imaging_archive/count');
    return data.count ?? data;
  },
  summary: async (patientId?: number): Promise<any> => {
    const { data } = await api.get('/imaging_archive/summary', { params: { patient_id: patientId } });
    return data;
  },
  activate: async (id: number): Promise<ImagingArchive> => {
    const { data } = await api.post(`/imaging_archive/${id}/activate`);
    return data;
  },
  deactivate: async (id: number): Promise<ImagingArchive> => {
    const { data } = await api.post(`/imaging_archive/${id}/deactivate`);
    return data;
  },
  complete: async (id: number, notes?: string): Promise<ImagingArchive> => {
    const { data } = await api.post(`/imaging_archive/${id}/complete`, null, { params: { notes } });
    return data;
  },
  cancel: async (id: number, reason?: string): Promise<ImagingArchive> => {
    const { data } = await api.post(`/imaging_archive/${id}/cancel`, null, { params: { reason } });
    return data;
  },
};

export default imaging_archiveApi;
