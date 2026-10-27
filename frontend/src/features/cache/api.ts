import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const cacheApi = {
  get: async (key: string) => { const { data } = await api.get(`/cache/${key}`); return data; },
  set: async (key: string, value: any, ttl = 300) => { const { data } = await api.put(`/cache/${key}`, value, { params: { ttl } }); return data; },
  delete: async (key: string) => { const { data } = await api.delete(`/cache/${key}`); return data; },
  clear: async () => { const { data } = await api.post('/cache/clear'); return data; },
  purgeExpired: async () => { const { data } = await api.post('/cache/purge-expired'); return data; },
  keys: async () => { const { data } = await api.get('/cache/keys'); return data; },
  size: async () => { const { data } = await api.get('/cache/size'); return data; },
  stats: async () => { const { data } = await api.get('/cache/stats'); return data; },
};
export default cacheApi;
