import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const searchApi = {
  search: async (query: string, limit = 20) => { const { data } = await api.post('/search', { query, limit }); return data; },
  suggest: async (q: string, limit = 5) => { const { data } = await api.get('/search/suggest', { params: { q, limit } }); return data; },
  count: async () => { const { data } = await api.get('/search/count'); return data; },
  index: async (doc_id: string, content: string) => { const { data } = await api.post('/search/index', null, { params: { doc_id, content } }); return data; },
  remove: async (doc_id: string) => { const { data } = await api.delete(`/search/index/${doc_id}`); return data; },
  rebuild: async (documents: any[]) => { const { data } = await api.post('/search/rebuild', documents); return data; },
  clear: async () => { const { data } = await api.post('/search/clear'); return data; },
};
export default searchApi;
