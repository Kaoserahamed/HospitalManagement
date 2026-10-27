import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const videoApi = {
  listSessions: async (params: any = {}) => { const { data } = await api.get('/video/sessions', { params }); return data; },
  getSession: async (id: number) => { const { data } = await api.get(`/video/sessions/${id}`); return data; },
  getSessionByRoom: async (room_id: string) => { const { data } = await api.get(`/video/sessions/room/${room_id}`); return data; },
  createSession: async (p: any) => { const { data } = await api.post('/video/sessions', p); return data; },
  connect: async (id: number) => { const { data } = await api.post(`/video/sessions/${id}/connect`); return data; },
  connected: async (id: number, participant_count = 1) => { const { data } = await api.post(`/video/sessions/${id}/connected`, null, { params: { participant_count } }); return data; },
  endSession: async (id: number, recording_path?: string) => { const { data } = await api.post(`/video/sessions/${id}/end`, null, { params: { recording_path } }); return data; },
  failSession: async (id: number, error?: string) => { const { data } = await api.post(`/video/sessions/${id}/fail`, null, { params: { error } }); return data; },
  updateQuality: async (id: number, quality: string) => { const { data } = await api.put(`/video/sessions/${id}/quality`, null, { params: { quality } }); return data; },
  addParticipant: async (id: number) => { const { data } = await api.post(`/video/sessions/${id}/participants`); return data; },
  removeParticipant: async (id: number) => { const { data } = await api.delete(`/video/sessions/${id}/participants`); return data; },
  sendSignaling: async (p: any) => { const { data } = await api.post('/video/signaling', p); return data; },
  listSignaling: async (session_id: number) => { const { data } = await api.get(`/video/sessions/${session_id}/signaling`); return data; },
  recordMetric: async (p: any) => { const { data } = await api.post('/video/metrics', p); return data; },
  listMetrics: async (session_id: number) => { const { data } = await api.get(`/video/sessions/${session_id}/metrics`); return data; },
  sessionDuration: async (session_id: number) => { const { data } = await api.get(`/video/sessions/${session_id}/duration`); return data; },
  count: async () => { const { data } = await api.get('/video/count'); return data; },
};
export default videoApi;
