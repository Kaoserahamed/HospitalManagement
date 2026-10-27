import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const mdtApi = {
  listMeetings: async (params: any = {}) => { const { data } = await api.get('/mdt/meetings', { params }); return data; },
  getMeeting: async (id: number) => { const { data } = await api.get(`/mdt/meetings/${id}`); return data; },
  scheduleMeeting: async (p: any) => { const { data } = await api.post('/mdt/meetings', p); return data; },
  updateMeeting: async (id: number, p: any) => { const { data } = await api.put(`/mdt/meetings/${id}`, p); return data; },
  startMeeting: async (id: number) => { const { data } = await api.post(`/mdt/meetings/${id}/start`); return data; },
  completeMeeting: async (id: number, notes?: string) => { const { data } = await api.post(`/mdt/meetings/${id}/complete`, null, { params: { notes } }); return data; },
  cancelMeeting: async (id: number) => { const { data } = await api.post(`/mdt/meetings/${id}/cancel`); return data; },
  addAttendee: async (p: any) => { const { data } = await api.post('/mdt/attendees', p); return data; },
  listAttendees: async (meeting_id: number) => { const { data } = await api.get(`/mdt/meetings/${meeting_id}/attendees`); return data; },
  markAttended: async (id: number) => { const { data } = await api.post(`/mdt/attendees/${id}/attend`); return data; },
  addDecision: async (p: any) => { const { data } = await api.post('/mdt/decisions', p); return data; },
  listDecisions: async (meeting_id: number) => { const { data } = await api.get(`/mdt/meetings/${meeting_id}/decisions`); return data; },
  updateDecision: async (id: number, status: string) => { const { data } = await api.put(`/mdt/decisions/${id}`, null, { params: { status } }); return data; },
  closeDecision: async (id: number) => { const { data } = await api.post(`/mdt/decisions/${id}/close`); return data; },
  meetingsForPatient: async (patient_id: number) => { const { data } = await api.get(`/mdt/patients/${patient_id}/meetings`); return data; },
  attendanceRate: async (meeting_id: number) => { const { data } = await api.get(`/mdt/meetings/${meeting_id}/attendance-rate`); return data; },
};
export default mdtApi;
