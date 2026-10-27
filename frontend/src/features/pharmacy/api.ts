import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' });
import type { Medication, MedicationCreateInput, MedicationListParams, MedicationListResponse, Stock, StockCreateInput, Lot, Lot as Supplier, Supplier as Dispense, DispenseCreateInput, InteractionCheck, InteractionResult } from './types';

export const pharmacyApi = {
  listMedications: async (params: MedicationListParams = {}): Promise<MedicationListResponse> => { const { data } = await api.get('/pharmacy/medications', { params }); return data; },
  getMedication: async (id: number): Promise<Medication> => { const { data } = await api.get(`/pharmacy/medications/${id}`); return data; },
  createMedication: async (p: MedicationCreateInput): Promise<Medication> => { const { data } = await api.post('/pharmacy/medications', p); return data; },
  createStock: async (p: StockCreateInput): Promise<Stock> => { const { data } = await api.post('/pharmacy/stock', p); return data; },
  updateStock: async (id: number, quantity: number): Promise<Stock> => { const { data } = await api.put(`/pharmacy/stock/${id}`, null, { params: { quantity } }); return data; },
  lowStock: async (): Promise<Stock[]> => { const { data } = await api.get('/pharmacy/stock/low'); return data; },
  createLot: async (p: any): Promise<Lot> => { const { data } = await api.post('/pharmacy/lots', p); return data; },
  listLots: async (medication_id?: number, expiring_within_days?: number): Promise<Lot[]> => { const { data } = await api.get('/pharmacy/lots', { params: { medication_id, expiring_within_days } }); return data; },
  createSupplier: async (p: any): Promise<Supplier> => { const { data } = await api.post('/pharmacy/suppliers', p); return data; },
  listSuppliers: async (): Promise<Supplier[]> => { const { data } = await api.get('/pharmacy/suppliers'); return data; },
  dispense: async (p: DispenseCreateInput): Promise<Dispense> => { const { data } = await api.post('/pharmacy/dispense', p); return data; },
  listDispenses: async (prescription_id?: number): Promise<Dispense[]> => { const { data } = await api.get('/pharmacy/dispenses', { params: { prescription_id } }); return data; },
  checkInteraction: async (p: InteractionCheck): Promise<InteractionResult> => { const { data } = await api.post('/pharmacy/interactions/check', p); return data; },
};

export default pharmacyApi;
