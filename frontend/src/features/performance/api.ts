import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const performanceApi = {
  recordMetric: async (p: any) => { const { data } = await api.post('/performance/metrics', p); return data; },
  listMetrics: async (params: any = {}) => { const { data } = await api.get('/performance/metrics', { params }); return data; },
  recordSlowQuery: async (p: any) => { const { data } = await api.post('/performance/slow-queries', p); return data; },
  listSlowQueries: async (limit = 20) => { const { data } = await api.get('/performance/slow-queries', { params: { limit } }); return data; },
  recordCacheStats: async (p: any) => { const { data } = await api.post('/performance/cache-stats', p); return data; },
  listCacheStats: async (cache_name?: string) => { const { data } = await api.get('/performance/cache-stats', { params: { cache_name } }); return data; },
  summary: async (endpoint?: string) => { const { data } = await api.get('/performance/summary', { params: { endpoint } }); return data; },
  slowestEndpoints: async (limit = 5) => { const { data } = await api.get('/performance/slowest-endpoints', { params: { limit } }); return data; },
  cacheHitRate: async (cache_name: string) => { const { data } = await api.get('/performance/cache-hit-rate', { params: { cache_name } }); return data; },
  topSlowQueries: async (limit = 10) => { const { data } = await api.get('/performance/top-slow-queries', { params: { limit } }); return data; },
};
export default performanceApi;
