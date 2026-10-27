import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const integrationApi = {
  listAdapters: async (adapter_type?: string, status?: string) => { const { data } = await api.get('/integration/adapters', { params: { adapter_type, status } }); return data; },
  getAdapter: async (id: number) => { const { data } = await api.get(`/integration/adapters/${id}`); return data; },
  createAdapter: async (p: any) => { const { data } = await api.post('/integration/adapters', p); return data; },
  updateAdapter: async (id: number, p: any) => { const { data } = await api.put(`/integration/adapters/${id}`, p); return data; },
  activateAdapter: async (id: number) => { const { data } = await api.post(`/integration/adapters/${id}/activate`); return data; },
  deactivateAdapter: async (id: number) => { const { data } = await api.post(`/integration/adapters/${id}/deactivate`); return data; },
  sync: async (id: number) => { const { data } = await api.post(`/integration/adapters/${id}/sync`); return data; },
  syncLogs: async (id: number) => { const { data } = await api.get(`/integration/adapters/${id}/sync-logs`); return data; },
  adapterHealth: async (id: number) => { const { data } = await api.get(`/integration/adapters/${id}/health`); return data; },
  listWebhooks: async (is_active?: boolean) => { const { data } = await api.get('/integration/webhooks', { params: { is_active } }); return data; },
  getWebhook: async (id: number) => { const { data } = await api.get(`/integration/webhooks/${id}`); return data; },
  createWebhook: async (p: any) => { const { data } = await api.post('/integration/webhooks', p); return data; },
  deleteWebhook: async (id: number) => { await api.delete(`/integration/webhooks/${id}`); },
  triggerWebhook: async (id: number, event: string, payload: any) => { const { data } = await api.post(`/integration/webhooks/${id}/trigger`, payload, { params: { event } }); return data; },
  listDeliveries: async (id: number) => { const { data } = await api.get(`/integration/webhooks/${id}/deliveries`); return data; },
  retryDelivery: async (id: number) => { const { data } = await api.post(`/integration/deliveries/${id}/retry`); return data; },
};
export default integrationApi;
