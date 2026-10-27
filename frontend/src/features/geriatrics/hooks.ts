import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { geriatricsApi } from './api';
import type { GeriatricsCreateInput, GeriatricsListParams, GeriatricsUpdateInput } from './types';

export const geriatricsKeys = {
  all: ['geriatrics'] as const,
  list: (params: GeriatricsListParams) => ['geriatrics', 'list', params] as const,
  detail: (id: number) => ['geriatrics', 'detail', id] as const,
  summary: (patientId?: number) => ['geriatrics', 'summary', patientId] as const,
};

export function useGeriatricsList(params: GeriatricsListParams = {}) {
  return useQuery({
    queryKey: geriatricsKeys.list(params),
    queryFn: () => geriatricsApi.list(params),
  });
}

export function useGeriatricsAll(patientId?: number) {
  return useQuery({
    queryKey: [...geriatricsKeys.all, 'all', patientId],
    queryFn: () => geriatricsApi.getAll(patientId),
  });
}

export function useGeriatrics(id: number) {
  return useQuery({
    queryKey: geriatricsKeys.detail(id),
    queryFn: () => geriatricsApi.get(id),
    enabled: !!id,
  });
}

export function useGeriatricsCount() {
  return useQuery({
    queryKey: [...geriatricsKeys.all, 'count'],
    queryFn: () => geriatricsApi.count(),
  });
}

export function useGeriatricsSummary(patientId?: number) {
  return useQuery({
    queryKey: geriatricsKeys.summary(patientId),
    queryFn: () => geriatricsApi.summary(patientId),
  });
}

export function useCreateGeriatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GeriatricsCreateInput) => geriatricsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: geriatricsKeys.all }),
  });
}

export function useUpdateGeriatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GeriatricsUpdateInput }) => geriatricsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: geriatricsKeys.all });
      qc.invalidateQueries({ queryKey: geriatricsKeys.detail(id) });
    },
  });
}

export function useDeleteGeriatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => geriatricsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: geriatricsKeys.all }),
  });
}

export function useActivateGeriatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => geriatricsApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: geriatricsKeys.all });
      qc.invalidateQueries({ queryKey: geriatricsKeys.detail(id) });
    },
  });
}

export function useDeactivateGeriatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => geriatricsApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: geriatricsKeys.all });
      qc.invalidateQueries({ queryKey: geriatricsKeys.detail(id) });
    },
  });
}

export function useCompleteGeriatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => geriatricsApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: geriatricsKeys.all });
      qc.invalidateQueries({ queryKey: geriatricsKeys.detail(id) });
    },
  });
}

export function useCancelGeriatrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => geriatricsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: geriatricsKeys.all });
      qc.invalidateQueries({ queryKey: geriatricsKeys.detail(id) });
    },
  });
}
