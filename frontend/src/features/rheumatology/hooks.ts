import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rheumatologyApi } from './api';
import type { RheumatologyCreateInput, RheumatologyListParams, RheumatologyUpdateInput } from './types';

export const rheumatologyKeys = {
  all: ['rheumatology'] as const,
  list: (params: RheumatologyListParams) => ['rheumatology', 'list', params] as const,
  detail: (id: number) => ['rheumatology', 'detail', id] as const,
  summary: (patientId?: number) => ['rheumatology', 'summary', patientId] as const,
};

export function useRheumatologyList(params: RheumatologyListParams = {}) {
  return useQuery({
    queryKey: rheumatologyKeys.list(params),
    queryFn: () => rheumatologyApi.list(params),
  });
}

export function useRheumatologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...rheumatologyKeys.all, 'all', patientId],
    queryFn: () => rheumatologyApi.getAll(patientId),
  });
}

export function useRheumatology(id: number) {
  return useQuery({
    queryKey: rheumatologyKeys.detail(id),
    queryFn: () => rheumatologyApi.get(id),
    enabled: !!id,
  });
}

export function useRheumatologyCount() {
  return useQuery({
    queryKey: [...rheumatologyKeys.all, 'count'],
    queryFn: () => rheumatologyApi.count(),
  });
}

export function useRheumatologySummary(patientId?: number) {
  return useQuery({
    queryKey: rheumatologyKeys.summary(patientId),
    queryFn: () => rheumatologyApi.summary(patientId),
  });
}

export function useCreateRheumatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RheumatologyCreateInput) => rheumatologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: rheumatologyKeys.all }),
  });
}

export function useUpdateRheumatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RheumatologyUpdateInput }) => rheumatologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: rheumatologyKeys.all });
      qc.invalidateQueries({ queryKey: rheumatologyKeys.detail(id) });
    },
  });
}

export function useDeleteRheumatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rheumatologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: rheumatologyKeys.all }),
  });
}

export function useActivateRheumatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rheumatologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: rheumatologyKeys.all });
      qc.invalidateQueries({ queryKey: rheumatologyKeys.detail(id) });
    },
  });
}

export function useDeactivateRheumatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rheumatologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: rheumatologyKeys.all });
      qc.invalidateQueries({ queryKey: rheumatologyKeys.detail(id) });
    },
  });
}

export function useCompleteRheumatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => rheumatologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: rheumatologyKeys.all });
      qc.invalidateQueries({ queryKey: rheumatologyKeys.detail(id) });
    },
  });
}

export function useCancelRheumatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => rheumatologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: rheumatologyKeys.all });
      qc.invalidateQueries({ queryKey: rheumatologyKeys.detail(id) });
    },
  });
}
