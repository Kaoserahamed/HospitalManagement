import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { billingApi } from './api';

export const billingKeys = { all: ['billing'] as const };

export function useInvoices(params: any = {}) {
  return useQuery({ queryKey: ['billing', 'invoices', params], queryFn: () => billingApi.listInvoices(params) });
}

export function useInvoice(id: number) {
  return useQuery({ queryKey: ['billing', 'invoice', id], queryFn: () => billingApi.getInvoice(id), enabled: !!id });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => billingApi.createInvoice(p), onSuccess: () => qc.invalidateQueries({ queryKey: billingKeys.all }) });
}

export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => billingApi.recordPayment(p), onSuccess: () => qc.invalidateQueries({ queryKey: billingKeys.all }) });
}

export function useBillingSummary(patient_id?: number) {
  return useQuery({ queryKey: ['billing', 'summary', patient_id], queryFn: () => billingApi.summary(patient_id) });
}
