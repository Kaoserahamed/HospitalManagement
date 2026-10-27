import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { obstetricsApi } from './api';
import type { ObstetricsCreateInput, ObstetricsListParams, ObstetricsUpdateInput } from './types';

export const obstetricsKeys = {
  all: ['obstetrics'] as const,
  list: (params: ObstetricsListParams) => ['obstetrics', 'list', params] as const,
  detail: (id: number) => ['obstetrics', 'detail', id] as const,
  summary: (patientId?: number) => ['obstetrics', 'summary', patientId] as const,
};

export function useObstetricsList(params: ObstetricsListParams = {}) {
  return useQuery({
    queryKey: obstetricsKeys.list(params),
    queryFn: () => obstetricsApi.list(params),
  });
}

export function useObstetricsAll(patientId?: number) {
  return useQuery({
    queryKey: [...obstetricsKeys.all, 'all', patientId],
    queryFn: () => obstetricsApi.getAll(patientId),
  });
}

export function useObstetrics(id: number) {
  return useQuery({
    queryKey: obstetricsKeys.detail(id),
    queryFn: () => obstetricsApi.get(id),
    enabled: !!id,
  });
}

export function useObstetricsCount() {
  return useQuery({
    queryKey: [...obstetricsKeys.all, 'count'],
    queryFn: () => obstetricsApi.count(),
  });
}

export function useObstetricsSummary(patientId?: number) {
  return useQuery({
    queryKey: obstetricsKeys.summary(patientId),
    queryFn: () => obstetricsApi.summary(patientId),
  });
}

export function useCreateObstetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ObstetricsCreateInput) => obstetricsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: obstetricsKeys.all }),
  });
}

export function useUpdateObstetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ObstetricsUpdateInput }) => obstetricsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: obstetricsKeys.all });
      qc.invalidateQueries({ queryKey: obstetricsKeys.detail(id) });
    },
  });
}

export function useDeleteObstetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => obstetricsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: obstetricsKeys.all }),
  });
}

export function useActivateObstetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => obstetricsApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: obstetricsKeys.all });
      qc.invalidateQueries({ queryKey: obstetricsKeys.detail(id) });
    },
  });
}

export function useDeactivateObstetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => obstetricsApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: obstetricsKeys.all });
      qc.invalidateQueries({ queryKey: obstetricsKeys.detail(id) });
    },
  });
}

export function useCompleteObstetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => obstetricsApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: obstetricsKeys.all });
      qc.invalidateQueries({ queryKey: obstetricsKeys.detail(id) });
    },
  });
}

export function useCancelObstetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => obstetricsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: obstetricsKeys.all });
      qc.invalidateQueries({ queryKey: obstetricsKeys.detail(id) });
    },
  });
}
