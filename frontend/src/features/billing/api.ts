import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });

export const billingApi = {
  createCharge: async (p: any) => { const { data } = await api.post('/billing/charges', p); return data; },
  listCharges: async (patient_id?: number) => { const { data } = await api.get('/billing/charges', { params: { patient_id } }); return data; },
  createInvoice: async (p: any) => { const { data } = await api.post('/billing/invoices', p); return data; },
  listInvoices: async (params: any = {}) => { const { data } = await api.get('/billing/invoices', { params }); return data; },
  getInvoice: async (id: number) => { const { data } = await api.get(`/billing/invoices/${id}`); return data; },
  updateInvoice: async (id: number, p: any) => { const { data } = await api.put(`/billing/invoices/${id}`, p); return data; },
  issueInvoice: async (id: number) => { const { data } = await api.post(`/billing/invoices/${id}/issue`); return data; },
  cancelInvoice: async (id: number) => { const { data } = await api.post(`/billing/invoices/${id}/cancel`); return data; },
  recordPayment: async (p: any) => { const { data } = await api.post('/billing/payments', p); return data; },
  listPayments: async (invoice_id: number) => { const { data } = await api.get(`/billing/invoices/${invoice_id}/payments`); return data; },
  submitClaim: async (p: any) => { const { data } = await api.post('/billing/claims', p); return data; },
  updateClaim: async (id: number, status: string, denial_reason?: string) => { const { data } = await api.put(`/billing/claims/${id}`, null, { params: { status, denial_reason } }); return data; },
  listClaims: async (invoice_id?: number) => { const { data } = await api.get('/billing/claims', { params: { invoice_id } }); return data; },
  summary: async (patient_id?: number) => { const { data } = await api.get('/billing/summary', { params: { patient_id } }); return data; },
  overdue: async (days = 30) => { const { data } = await api.get('/billing/overdue', { params: { days } }); return data; },
};

export default billingApi;
