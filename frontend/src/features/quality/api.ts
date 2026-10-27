import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const qualityApi = {
  listMeasures: async (category?: string) => { const { data } = await api.get('/quality/measures', { params: { category } }); return data; },
  getMeasure: async (id: number) => { const { data } = await api.get(`/quality/measures/${id}`); return data; },
  createMeasure: async (p: any) => { const { data } = await api.post('/quality/measures', p); return data; },
  updateMeasure: async (id: number, p: any) => { const { data } = await api.put(`/quality/measures/${id}`, p); return data; },
  recordResult: async (p: any) => { const { data } = await api.post('/quality/results', p); return data; },
  listResults: async (measure_id?: number) => { const { data } = await api.get(`/quality/measures/${measure_id}/results`); return data; },
  createBenchmark: async (p: any) => { const { data } = await api.post('/quality/benchmarks', p); return data; },
  listBenchmarks: async (measure_id: number) => { const { data } = await api.get(`/quality/measures/${measure_id}/benchmarks`); return data; },
  getRate: async (id: number) => { const { data } = await api.get(`/quality/measures/${id}/rate`); return data; },
  getSummary: async (id: number) => { const { data } = await api.get(`/quality/measures/${id}/summary`); return data; },
  allSummaries: async () => { const { data } = await api.get('/quality/summaries'); return data; },
  topPerformers: async (limit = 5) => { const { data } = await api.get('/quality/top-performers', { params: { limit } }); return data; },
};
export default qualityApi;
