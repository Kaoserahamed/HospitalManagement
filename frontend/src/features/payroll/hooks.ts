import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { payrollApi } from './api';
import type { PayrollCreateInput, PayrollListParams, PayrollUpdateInput } from './types';

export const payrollKeys = {
  all: ['payroll'] as const,
  list: (params: PayrollListParams) => ['payroll', 'list', params] as const,
  detail: (id: number) => ['payroll', 'detail', id] as const,
  summary: (patientId?: number) => ['payroll', 'summary', patientId] as const,
};

export function usePayrollList(params: PayrollListParams = {}) {
  return useQuery({
    queryKey: payrollKeys.list(params),
    queryFn: () => payrollApi.list(params),
  });
}

export function usePayrollAll(patientId?: number) {
  return useQuery({
    queryKey: [...payrollKeys.all, 'all', patientId],
    queryFn: () => payrollApi.getAll(patientId),
  });
}

export function usePayroll(id: number) {
  return useQuery({
    queryKey: payrollKeys.detail(id),
    queryFn: () => payrollApi.get(id),
    enabled: !!id,
  });
}

export function usePayrollCount() {
  return useQuery({
    queryKey: [...payrollKeys.all, 'count'],
    queryFn: () => payrollApi.count(),
  });
}

export function usePayrollSummary(patientId?: number) {
  return useQuery({
    queryKey: payrollKeys.summary(patientId),
    queryFn: () => payrollApi.summary(patientId),
  });
}

export function useCreatePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PayrollCreateInput) => payrollApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: payrollKeys.all }),
  });
}

export function useUpdatePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PayrollUpdateInput }) => payrollApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: payrollKeys.all });
      qc.invalidateQueries({ queryKey: payrollKeys.detail(id) });
    },
  });
}

export function useDeletePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => payrollApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: payrollKeys.all }),
  });
}

export function useActivatePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => payrollApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: payrollKeys.all });
      qc.invalidateQueries({ queryKey: payrollKeys.detail(id) });
    },
  });
}

export function useDeactivatePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => payrollApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: payrollKeys.all });
      qc.invalidateQueries({ queryKey: payrollKeys.detail(id) });
    },
  });
}

export function useCompletePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => payrollApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: payrollKeys.all });
      qc.invalidateQueries({ queryKey: payrollKeys.detail(id) });
    },
  });
}

export function useCancelPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => payrollApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: payrollKeys.all });
      qc.invalidateQueries({ queryKey: payrollKeys.detail(id) });
    },
  });
}
