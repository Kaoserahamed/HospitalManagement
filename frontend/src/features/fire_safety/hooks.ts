import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fire_safetyApi } from './api';
import type { FireSafetyCreateInput, FireSafetyListParams, FireSafetyUpdateInput } from './types';

export const fire_safetyKeys = {
  all: ['fire_safety'] as const,
  list: (params: FireSafetyListParams) => ['fire_safety', 'list', params] as const,
  detail: (id: number) => ['fire_safety', 'detail', id] as const,
  summary: (patientId?: number) => ['fire_safety', 'summary', patientId] as const,
};

export function useFireSafetyList(params: FireSafetyListParams = {}) {
  return useQuery({
    queryKey: fire_safetyKeys.list(params),
    queryFn: () => fire_safetyApi.list(params),
  });
}

export function useFireSafetyAll(patientId?: number) {
  return useQuery({
    queryKey: [...fire_safetyKeys.all, 'all', patientId],
    queryFn: () => fire_safetyApi.getAll(patientId),
  });
}

export function useFireSafety(id: number) {
  return useQuery({
    queryKey: fire_safetyKeys.detail(id),
    queryFn: () => fire_safetyApi.get(id),
    enabled: !!id,
  });
}

export function useFireSafetyCount() {
  return useQuery({
    queryKey: [...fire_safetyKeys.all, 'count'],
    queryFn: () => fire_safetyApi.count(),
  });
}

export function useFireSafetySummary(patientId?: number) {
  return useQuery({
    queryKey: fire_safetyKeys.summary(patientId),
    queryFn: () => fire_safetyApi.summary(patientId),
  });
}

export function useCreateFireSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FireSafetyCreateInput) => fire_safetyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: fire_safetyKeys.all }),
  });
}

export function useUpdateFireSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FireSafetyUpdateInput }) => fire_safetyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: fire_safetyKeys.all });
      qc.invalidateQueries({ queryKey: fire_safetyKeys.detail(id) });
    },
  });
}

export function useDeleteFireSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fire_safetyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: fire_safetyKeys.all }),
  });
}

export function useActivateFireSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fire_safetyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: fire_safetyKeys.all });
      qc.invalidateQueries({ queryKey: fire_safetyKeys.detail(id) });
    },
  });
}

export function useDeactivateFireSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fire_safetyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: fire_safetyKeys.all });
      qc.invalidateQueries({ queryKey: fire_safetyKeys.detail(id) });
    },
  });
}

export function useCompleteFireSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => fire_safetyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: fire_safetyKeys.all });
      qc.invalidateQueries({ queryKey: fire_safetyKeys.detail(id) });
    },
  });
}

export function useCancelFireSafety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => fire_safetyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: fire_safetyKeys.all });
      qc.invalidateQueries({ queryKey: fire_safetyKeys.detail(id) });
    },
  });
}
