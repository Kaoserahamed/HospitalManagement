import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const auditApi = {
  record: async (p: any) => { const { data } = await api.post('/audit/logs', p); return data; },
  list: async (params: any = {}) => { const { data } = await api.get('/audit/logs', { params }); return data; },
  recent: async (limit = 20) => { const { data } = await api.get('/audit/logs/recent', { params: { limit } }); return data; },
  count: async () => { const { data } = await api.get('/audit/logs/count'); return data; },
};
export default auditApi;
