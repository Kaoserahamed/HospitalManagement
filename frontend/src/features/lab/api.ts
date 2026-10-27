import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const labApi = {
  createOrder: async (p: any) => { const { data } = await api.post('/lab/orders', p); return data; },
  listOrders: async (params: any = {}) => { const { data } = await api.get('/lab/orders', { params }); return data; },
  getOrder: async (id: number) => { const { data } = await api.get(`/lab/orders/${id}`); return data; },
  updateOrder: async (id: number, p: any) => { const { data } = await api.put(`/lab/orders/${id}`, p); return data; },
  collectSample: async (id: number) => { const { data } = await api.post(`/lab/orders/${id}/collect`); return data; },
  startProcessing: async (id: number) => { const { data } = await api.post(`/lab/orders/${id}/process`); return data; },
  cancelOrder: async (id: number, reason?: string) => { const { data } = await api.post(`/lab/orders/${id}/cancel`, null, { params: { reason } }); return data; },
  addResult: async (p: any) => { const { data } = await api.post('/lab/results', p); return data; },
  listResults: async (order_id: number) => { const { data } = await api.get(`/lab/orders/${order_id}/results`); return data; },
  createPanel: async (p: any) => { const { data } = await api.post('/lab/panels', p); return data; },
  listPanels: async () => { const { data } = await api.get('/lab/panels'); return data; },
  orderPanel: async (panel_id: number, patient_id: number, ordering_provider: number, encounter_id?: number) => { const { data } = await api.post(`/lab/panels/${panel_id}/order`, null, { params: { patient_id, ordering_provider, encounter_id } }); return data; },
  abnormalResults: async (patient_id: number) => { const { data } = await api.get(`/lab/patients/${patient_id}/abnormal`); return data; },
  count: async () => { const { data } = await api.get('/lab/count'); return data; },
};
export default labApi;
