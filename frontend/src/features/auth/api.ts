import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });

export const authApi = {
  login: async (p: { email: string; password: string }) => { const { data } = await api.post('/auth/login', p); return data; },
  registerPatient: async (p: any) => { const { data } = await api.post('/auth/register-patient', p); return data; },
  createUser: async (p: any) => { const { data } = await api.post('/auth/create-user', p); return data; },
  me: async () => { const { data } = await api.get('/auth/me'); return data; },
};

export default authApi;
