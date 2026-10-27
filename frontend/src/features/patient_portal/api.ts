import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const patientPortalApi = {
  sendMessage: async (p: any) => { const { data } = await api.post('/portal/messages', p); return data; },
  listMessages: async (params: any = {}) => { const { data } = await api.get('/portal/messages', { params }); return data; },
  getMessage: async (id: number) => { const { data } = await api.get(`/portal/messages/${id}`); return data; },
  markRead: async (id: number) => { const { data } = await api.post(`/portal/messages/${id}/read`); return data; },
  conversations: async (user_id: number) => { const { data } = await api.get(`/portal/conversations/${user_id}`); return data; },
  unreadCount: async (recipient_id: number) => { const { data } = await api.get('/portal/unread-count', { params: { recipient_id } }); return data; },
  recordDownload: async (p: any) => { const { data } = await api.post('/portal/downloads', p); return data; },
  listDownloads: async (patient_id?: number) => { const { data } = await api.get('/portal/downloads', { params: { patient_id } }); return data; },
  createReminder: async (p: any) => { const { data } = await api.post('/portal/reminders', p); return data; },
  listReminders: async (patient_id?: number, status?: string) => { const { data } = await api.get('/portal/reminders', { params: { patient_id, status } }); return data; },
  pendingReminders: async (patient_id?: number) => { const { data } = await api.get('/portal/reminders/pending', { params: { patient_id } }); return data; },
  getReminder: async (id: number) => { const { data } = await api.get(`/portal/reminders/${id}`); return data; },
  updateReminder: async (id: number, p: any) => { const { data } = await api.put(`/portal/reminders/${id}`, p); return data; },
  acknowledgeReminder: async (id: number) => { const { data } = await api.post(`/portal/reminders/${id}/acknowledge`); return data; },
  cancelReminder: async (id: number) => { const { data } = await api.post(`/portal/reminders/${id}/cancel`); return data; },
  sendAppointmentReminder: async (patient_id: number, appointment_id: number, scheduled_at: string) => { const { data } = await api.post('/portal/reminders/appointment', null, { params: { patient_id, appointment_id, scheduled_at } }); return data; },
  sendMedicationReminder: async (patient_id: number, medication: string) => { const { data } = await api.post('/portal/reminders/medication', null, { params: { patient_id, medication } }); return data; },
  sendLabResultNotification: async (patient_id: number, result_id: number) => { const { data } = await api.post('/portal/reminders/lab-result', null, { params: { patient_id, result_id } }); return data; },
  portalSummary: async (patient_id: number) => { const { data } = await api.get('/portal/summary', { params: { patient_id } }); return data; },
};
export default patientPortalApi;
