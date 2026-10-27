import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const monitoringApi = {
  listDevices: async (patient_id?: number) => { const { data } = await api.get('/monitoring/devices', { params: { patient_id } }); return data; },
  registerDevice: async (p: any) => { const { data } = await api.post('/monitoring/devices', p); return data; },
  deactivateDevice: async (id: number) => { const { data } = await api.delete(`/monitoring/devices/${id}`); return data; },
  recordReading: async (p: any) => { const { data } = await api.post('/monitoring/readings', p); return data; },
  listReadings: async (patient_id?: number, vital_type?: string, limit = 100) => { const { data } = await api.get('/monitoring/readings', { params: { patient_id, vital_type, limit } }); return data; },
  listThresholds: async () => { const { data } = await api.get('/monitoring/thresholds'); return data; },
  createThreshold: async (p: any) => { const { data } = await api.post('/monitoring/thresholds', p); return data; },
  listAlerts: async (patient_id?: number, acknowledged?: boolean) => { const { data } = await api.get('/monitoring/alerts', { params: { patient_id, acknowledged } }); return data; },
  acknowledgeAlert: async (id: number) => { const { data } = await api.post(`/monitoring/alerts/${id}/acknowledge`); return data; },
  unacknowledgedCount: async (patient_id?: number) => { const { data } = await api.get('/monitoring/alerts/unacknowledged-count', { params: { patient_id } }); return data; },
  latestReading: async (patient_id: number, vital_type: string) => { const { data } = await api.get(`/monitoring/patients/${patient_id}/latest/${vital_type}`); return data; },
  trend: async (patient_id: number, vital_type: string, limit = 10) => { const { data } = await api.get(`/monitoring/patients/${patient_id}/trend/${vital_type}`, { params: { limit } }); return data; },
};
export default monitoringApi;
