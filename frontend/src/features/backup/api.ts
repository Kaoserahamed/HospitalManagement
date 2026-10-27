import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const backupApi = {
  listBackups: async (params: any = {}) => { const { data } = await api.get('/backup/jobs', { params }); return data; },
  getBackup: async (id: number) => { const { data } = await api.get(`/backup/jobs/${id}`); return data; },
  createBackup: async (p: any) => { const { data } = await api.post('/backup/jobs', p); return data; },
  runBackup: async (id: number) => { const { data } = await api.post(`/backup/jobs/${id}/run`); return data; },
  failBackup: async (id: number, error: string) => { const { data } = await api.post(`/backup/jobs/${id}/fail`, null, { params: { error } }); return data; },
  deleteBackup: async (id: number) => { await api.delete(`/backup/jobs/${id}`); },
  createRestore: async (p: any) => { const { data } = await api.post('/backup/restores', p); return data; },
  getRestore: async (id: number) => { const { data } = await api.get(`/backup/restores/${id}`); return data; },
  runRestore: async (id: number) => { const { data } = await api.post(`/backup/restores/${id}/run`); return data; },
  listSchedules: async (active_only = false) => { const { data } = await api.get('/backup/schedules', { params: { active_only } }); return data; },
  createSchedule: async (p: any) => { const { data } = await api.post('/backup/schedules', p); return data; },
  dueSchedules: async () => { const { data } = await api.get('/backup/schedules/due'); return data; },
  latestBackup: async () => { const { data } = await api.get('/backup/latest'); return data; },
  stats: async () => { const { data } = await api.get('/backup/stats'); return data; },
};
export default backupApi;
