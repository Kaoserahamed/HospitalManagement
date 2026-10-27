import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gynecologyApi } from './api';
import type { GynecologyCreateInput, GynecologyListParams, GynecologyUpdateInput } from './types';

export const gynecologyKeys = {
  all: ['gynecology'] as const,
  list: (params: GynecologyListParams) => ['gynecology', 'list', params] as const,
  detail: (id: number) => ['gynecology', 'detail', id] as const,
  summary: (patientId?: number) => ['gynecology', 'summary', patientId] as const,
};

export function useGynecologyList(params: GynecologyListParams = {}) {
  return useQuery({
    queryKey: gynecologyKeys.list(params),
    queryFn: () => gynecologyApi.list(params),
  });
}

export function useGynecologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...gynecologyKeys.all, 'all', patientId],
    queryFn: () => gynecologyApi.getAll(patientId),
  });
}

export function useGynecology(id: number) {
  return useQuery({
    queryKey: gynecologyKeys.detail(id),
    queryFn: () => gynecologyApi.get(id),
    enabled: !!id,
  });
}

export function useGynecologyCount() {
  return useQuery({
    queryKey: [...gynecologyKeys.all, 'count'],
    queryFn: () => gynecologyApi.count(),
  });
}

export function useGynecologySummary(patientId?: number) {
  return useQuery({
    queryKey: gynecologyKeys.summary(patientId),
    queryFn: () => gynecologyApi.summary(patientId),
  });
}

export function useCreateGynecology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GynecologyCreateInput) => gynecologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: gynecologyKeys.all }),
  });
}

export function useUpdateGynecology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GynecologyUpdateInput }) => gynecologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: gynecologyKeys.all });
      qc.invalidateQueries({ queryKey: gynecologyKeys.detail(id) });
    },
  });
}

export function useDeleteGynecology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gynecologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: gynecologyKeys.all }),
  });
}

export function useActivateGynecology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gynecologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: gynecologyKeys.all });
      qc.invalidateQueries({ queryKey: gynecologyKeys.detail(id) });
    },
  });
}

export function useDeactivateGynecology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gynecologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: gynecologyKeys.all });
      qc.invalidateQueries({ queryKey: gynecologyKeys.detail(id) });
    },
  });
}

export function useCompleteGynecology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => gynecologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: gynecologyKeys.all });
      qc.invalidateQueries({ queryKey: gynecologyKeys.detail(id) });
    },
  });
}

export function useCancelGynecology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => gynecologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: gynecologyKeys.all });
      qc.invalidateQueries({ queryKey: gynecologyKeys.detail(id) });
    },
  });
}
