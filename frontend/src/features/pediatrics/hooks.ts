import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pediatricsApi } from './api';
import type { PediatricsCreateInput, PediatricsListParams, PediatricsUpdateInput } from './types';

export const pediatricsKeys = {
  all: ['pediatrics'] as const,
  list: (params: PediatricsListParams) => ['pediatrics', 'list', params] as const,
  detail: (id: number) => ['pediatrics', 'detail', id] as const,
  summary: (patientId?: number) => ['pediatrics', 'summary', patientId] as const,
};

export function usePediatricsList(params: PediatricsListParams = {}) {
  return useQuery({
    queryKey: pediatricsKeys.list(params),
    queryFn: () => pediatricsApi.list(params),
  });
}

export function usePediatricsAll(patientId?: number) {
  return useQuery({
    queryKey: [...pediatricsKeys.all, 'all', patientId],
    queryFn: () => pediatricsApi.getAll(patientId),
  });
}

export function usePediatrics(id: number) {
  return useQuery({
    queryKey: pediatricsKeys.detail(id),
    queryFn: () => pediatricsApi.get(id),
    enabled: !!id,
  });
}

export function usePediatricsCount() {
  return useQuery({
    queryKey: [...pediatricsKeys.all, 'count'],
    queryFn: () => pediatricsApi.count(),
  });
}

export function usePediatricsSummary(patientId?: number) {
  return useQuery({
    queryKey: pediatricsKeys.summary(patientId),
    queryFn: () => pediatricsApi.summary(patientId),
  });
}

export function useCreatePediatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PediatricsCreateInput) => pediatricsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: pediatricsKeys.all }),
  });
}

export function useUpdatePediatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PediatricsUpdateInput }) => pediatricsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pediatricsKeys.all });
      qc.invalidateQueries({ queryKey: pediatricsKeys.detail(id) });
    },
  });
}

export function useDeletePediatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pediatricsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: pediatricsKeys.all }),
  });
}

export function useActivatePediatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pediatricsApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pediatricsKeys.all });
      qc.invalidateQueries({ queryKey: pediatricsKeys.detail(id) });
    },
  });
}

export function useDeactivatePediatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pediatricsApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pediatricsKeys.all });
      qc.invalidateQueries({ queryKey: pediatricsKeys.detail(id) });
    },
  });
}

export function useCompletePediatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => pediatricsApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pediatricsKeys.all });
      qc.invalidateQueries({ queryKey: pediatricsKeys.detail(id) });
    },
  });
}

export function useCancelPediatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => pediatricsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pediatricsKeys.all });
      qc.invalidateQueries({ queryKey: pediatricsKeys.detail(id) });
    },
  });
}
