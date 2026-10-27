import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { anesthesiologyApi } from './api';
import type { AnesthesiologyCreateInput, AnesthesiologyListParams, AnesthesiologyUpdateInput } from './types';

export const anesthesiologyKeys = {
  all: ['anesthesiology'] as const,
  list: (params: AnesthesiologyListParams) => ['anesthesiology', 'list', params] as const,
  detail: (id: number) => ['anesthesiology', 'detail', id] as const,
  summary: (patientId?: number) => ['anesthesiology', 'summary', patientId] as const,
};

export function useAnesthesiologyList(params: AnesthesiologyListParams = {}) {
  return useQuery({
    queryKey: anesthesiologyKeys.list(params),
    queryFn: () => anesthesiologyApi.list(params),
  });
}

export function useAnesthesiologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...anesthesiologyKeys.all, 'all', patientId],
    queryFn: () => anesthesiologyApi.getAll(patientId),
  });
}

export function useAnesthesiology(id: number) {
  return useQuery({
    queryKey: anesthesiologyKeys.detail(id),
    queryFn: () => anesthesiologyApi.get(id),
    enabled: !!id,
  });
}

export function useAnesthesiologyCount() {
  return useQuery({
    queryKey: [...anesthesiologyKeys.all, 'count'],
    queryFn: () => anesthesiologyApi.count(),
  });
}

export function useAnesthesiologySummary(patientId?: number) {
  return useQuery({
    queryKey: anesthesiologyKeys.summary(patientId),
    queryFn: () => anesthesiologyApi.summary(patientId),
  });
}

export function useCreateAnesthesiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AnesthesiologyCreateInput) => anesthesiologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: anesthesiologyKeys.all }),
  });
}

export function useUpdateAnesthesiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AnesthesiologyUpdateInput }) => anesthesiologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.detail(id) });
    },
  });
}

export function useDeleteAnesthesiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => anesthesiologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: anesthesiologyKeys.all }),
  });
}

export function useActivateAnesthesiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => anesthesiologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.detail(id) });
    },
  });
}

export function useDeactivateAnesthesiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => anesthesiologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.detail(id) });
    },
  });
}

export function useCompleteAnesthesiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => anesthesiologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.detail(id) });
    },
  });
}

export function useCancelAnesthesiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => anesthesiologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.all });
      qc.invalidateQueries({ queryKey: anesthesiologyKeys.detail(id) });
    },
  });
}
