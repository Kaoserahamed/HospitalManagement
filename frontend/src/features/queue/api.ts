import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const queueApi = {
  enqueue: async (p: any) => { const { data } = await api.post('/queue/tasks', p); return data; },
  list: async (params: any = {}) => { const { data } = await api.get('/queue/tasks', { params }); return data; },
  get: async (id: number) => { const { data } = await api.get(`/queue/tasks/${id}`); return data; },
  update: async (id: number, p: any) => { const { data } = await api.put(`/queue/tasks/${id}`, p); return data; },
  dequeue: async () => { const { data } = await api.post('/queue/tasks/dequeue'); return data; },
  complete: async (id: number) => { const { data } = await api.post(`/queue/tasks/${id}/complete`); return data; },
  fail: async (id: number, error: string) => { const { data } = await api.post(`/queue/tasks/${id}/fail`, null, { params: { error } }); return data; },
  cancel: async (id: number) => { const { data } = await api.post(`/queue/tasks/${id}/cancel`); return data; },
  retry: async (id: number) => { const { data } = await api.post(`/queue/tasks/${id}/retry`); return data; },
  stats: async () => { const { data } = await api.get('/queue/stats'); return data; },
  size: async () => { const { data } = await api.get('/queue/size'); return data; },
};
export default queueApi;
