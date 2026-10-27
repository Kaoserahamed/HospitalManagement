import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const featureFlagApi = {
  list: async () => { const { data } = await api.get('/feature-flags'); return data; },
  get: async (id: number) => { const { data } = await api.get(`/feature-flags/${id}`); return data; },
  getByKey: async (key: string) => { const { data } = await api.get(`/feature-flags/key/${key}`); return data; },
  create: async (p: any) => { const { data } = await api.post('/feature-flags', p); return data; },
  update: async (id: number, p: any) => { const { data } = await api.put(`/feature-flags/${id}`, p); return data; },
  toggle: async (id: number, enabled: boolean) => { const { data } = await api.post(`/feature-flags/${id}/toggle`, null, { params: { enabled } }); return data; },
  setRollout: async (id: number, percentage: number) => { const { data } = await api.post(`/feature-flags/${id}/rollout`, null, { params: { percentage } }); return data; },
  delete: async (id: number) => { await api.delete(`/feature-flags/${id}`); },
  createOverride: async (p: any) => { const { data } = await api.post('/feature-flags/overrides', p); return data; },
  listOverrides: async (flag_id?: number) => { const { data } = await api.get('/feature-flags/overrides', { params: { flag_id } }); return data; },
  evaluate: async (key: string, user_id?: number, role?: string) => { const { data } = await api.post('/feature-flags/evaluate', null, { params: { key, user_id, role } }); return data; },
  evaluateAll: async (user_id?: number, role?: string) => { const { data } = await api.post('/feature-flags/evaluate-all', null, { params: { user_id, role } }); return data; },
};
export default featureFlagApi;
