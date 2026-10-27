import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pulmonologyApi } from './api';
import type { PulmonologyCreateInput, PulmonologyListParams, PulmonologyUpdateInput } from './types';

export const pulmonologyKeys = {
  all: ['pulmonology'] as const,
  list: (params: PulmonologyListParams) => ['pulmonology', 'list', params] as const,
  detail: (id: number) => ['pulmonology', 'detail', id] as const,
  summary: (patientId?: number) => ['pulmonology', 'summary', patientId] as const,
};

export function usePulmonologyList(params: PulmonologyListParams = {}) {
  return useQuery({
    queryKey: pulmonologyKeys.list(params),
    queryFn: () => pulmonologyApi.list(params),
  });
}

export function usePulmonologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...pulmonologyKeys.all, 'all', patientId],
    queryFn: () => pulmonologyApi.getAll(patientId),
  });
}

export function usePulmonology(id: number) {
  return useQuery({
    queryKey: pulmonologyKeys.detail(id),
    queryFn: () => pulmonologyApi.get(id),
    enabled: !!id,
  });
}

export function usePulmonologyCount() {
  return useQuery({
    queryKey: [...pulmonologyKeys.all, 'count'],
    queryFn: () => pulmonologyApi.count(),
  });
}

export function usePulmonologySummary(patientId?: number) {
  return useQuery({
    queryKey: pulmonologyKeys.summary(patientId),
    queryFn: () => pulmonologyApi.summary(patientId),
  });
}

export function useCreatePulmonology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PulmonologyCreateInput) => pulmonologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: pulmonologyKeys.all }),
  });
}

export function useUpdatePulmonology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PulmonologyUpdateInput }) => pulmonologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pulmonologyKeys.all });
      qc.invalidateQueries({ queryKey: pulmonologyKeys.detail(id) });
    },
  });
}

export function useDeletePulmonology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pulmonologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: pulmonologyKeys.all }),
  });
}

export function useActivatePulmonology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pulmonologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pulmonologyKeys.all });
      qc.invalidateQueries({ queryKey: pulmonologyKeys.detail(id) });
    },
  });
}

export function useDeactivatePulmonology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pulmonologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pulmonologyKeys.all });
      qc.invalidateQueries({ queryKey: pulmonologyKeys.detail(id) });
    },
  });
}

export function useCompletePulmonology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => pulmonologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pulmonologyKeys.all });
      qc.invalidateQueries({ queryKey: pulmonologyKeys.detail(id) });
    },
  });
}

export function useCancelPulmonology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => pulmonologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pulmonologyKeys.all });
      qc.invalidateQueries({ queryKey: pulmonologyKeys.detail(id) });
    },
  });
}
