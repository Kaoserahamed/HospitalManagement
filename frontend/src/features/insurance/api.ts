import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
export const insuranceApi = {
  listPlans: async () => { const { data } = await api.get('/insurance/plans'); return data; },
  createPlan: async (p: any) => { const { data } = await api.post('/insurance/plans', p); return data; },
  enrollPatient: async (p: any) => { const { data } = await api.post('/insurance/enroll', p); return data; },
  getPatientInsurance: async (patient_id: number) => { const { data } = await api.get(`/insurance/patients/${patient_id}`); return data; },
  submitClaim: async (p: any) => { const { data } = await api.post('/insurance/claims', p); return data; },
  listClaims: async (params: any = {}) => { const { data } = await api.get('/insurance/claims', { params }); return data; },
  getClaim: async (id: number) => { const { data } = await api.get(`/insurance/claims/${id}`); return data; },
  updateClaim: async (id: number, p: any) => { const { data } = await api.put(`/insurance/claims/${id}`, p); return data; },
  approveClaim: async (id: number, amount_approved: number) => { const { data } = await api.post(`/insurance/claims/${id}/approve`, null, { params: { amount_approved } }); return data; },
  denyClaim: async (id: number, reason: string) => { const { data } = await api.post(`/insurance/claims/${id}/deny`, null, { params: { reason } }); return data; },
  fileAppeal: async (p: any) => { const { data } = await api.post('/insurance/appeals', p); return data; },
  listAppeals: async (claim_id?: number) => { const { data } = await api.get('/insurance/appeals', { params: { claim_id } }); return data; },
  resolveAppeal: async (id: number, status: string) => { const { data } = await api.put(`/insurance/appeals/${id}`, null, { params: { status } }); return data; },
};
export default insuranceApi;
