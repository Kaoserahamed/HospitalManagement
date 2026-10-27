import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const hl7Api = {
  parse: async (raw_message: string) => { const { data } = await api.post('/hl7/parse', { raw_message }); return data; },
  receive: async (p: any) => { const { data } = await api.post('/hl7/messages', p); return data; },
  list: async (params: any = {}) => { const { data } = await api.get('/hl7/messages', { params }); return data; },
  get: async (id: number) => { const { data } = await api.get(`/hl7/messages/${id}`); return data; },
  process: async (id: number) => { const { data } = await api.post(`/hl7/messages/${id}/process`); return data; },
  fail: async (id: number, error: string) => { const { data } = await api.post(`/hl7/messages/${id}/fail`, null, { params: { error } }); return data; },
  generateAck: async (message_control_id: string, ack_code = 'AA', text?: string) => { const { data } = await api.post('/hl7/ack', null, { params: { message_control_id, ack_code, text } }); return data; },
  handleAdt: async (patient_id: number, event = 'A01') => { const { data } = await api.post('/hl7/adt', null, { params: { patient_id, event } }); return data; },
  handleOru: async (patient_id: number, observations: any[] = []) => { const { data } = await api.post('/hl7/oru', observations, { params: { patient_id } }); return data; },
  handleOrm: async (patient_id: number, orders: any[] = []) => { const { data } = await api.post('/hl7/orm', orders, { params: { patient_id } }); return data; },
  count: async () => { const { data } = await api.get('/hl7/count'); return data; },
};
export default hl7Api;
