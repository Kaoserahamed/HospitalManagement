import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hematologyApi } from './api';
import type { HematologyCreateInput, HematologyListParams, HematologyUpdateInput } from './types';

export const hematologyKeys = {
  all: ['hematology'] as const,
  list: (params: HematologyListParams) => ['hematology', 'list', params] as const,
  detail: (id: number) => ['hematology', 'detail', id] as const,
  summary: (patientId?: number) => ['hematology', 'summary', patientId] as const,
};

export function useHematologyList(params: HematologyListParams = {}) {
  return useQuery({
    queryKey: hematologyKeys.list(params),
    queryFn: () => hematologyApi.list(params),
  });
}

export function useHematologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...hematologyKeys.all, 'all', patientId],
    queryFn: () => hematologyApi.getAll(patientId),
  });
}

export function useHematology(id: number) {
  return useQuery({
    queryKey: hematologyKeys.detail(id),
    queryFn: () => hematologyApi.get(id),
    enabled: !!id,
  });
}

export function useHematologyCount() {
  return useQuery({
    queryKey: [...hematologyKeys.all, 'count'],
    queryFn: () => hematologyApi.count(),
  });
}

export function useHematologySummary(patientId?: number) {
  return useQuery({
    queryKey: hematologyKeys.summary(patientId),
    queryFn: () => hematologyApi.summary(patientId),
  });
}

export function useCreateHematology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: HematologyCreateInput) => hematologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: hematologyKeys.all }),
  });
}

export function useUpdateHematology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: HematologyUpdateInput }) => hematologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hematologyKeys.all });
      qc.invalidateQueries({ queryKey: hematologyKeys.detail(id) });
    },
  });
}

export function useDeleteHematology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => hematologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: hematologyKeys.all }),
  });
}

export function useActivateHematology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => hematologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: hematologyKeys.all });
      qc.invalidateQueries({ queryKey: hematologyKeys.detail(id) });
    },
  });
}

export function useDeactivateHematology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => hematologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: hematologyKeys.all });
      qc.invalidateQueries({ queryKey: hematologyKeys.detail(id) });
    },
  });
}

export function useCompleteHematology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => hematologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hematologyKeys.all });
      qc.invalidateQueries({ queryKey: hematologyKeys.detail(id) });
    },
  });
}

export function useCancelHematology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => hematologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hematologyKeys.all });
      qc.invalidateQueries({ queryKey: hematologyKeys.detail(id) });
    },
  });
}
