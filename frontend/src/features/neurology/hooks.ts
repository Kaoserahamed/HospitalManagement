import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { neurologyApi } from './api';
import type { NeurologyCreateInput, NeurologyListParams, NeurologyUpdateInput } from './types';

export const neurologyKeys = {
  all: ['neurology'] as const,
  list: (params: NeurologyListParams) => ['neurology', 'list', params] as const,
  detail: (id: number) => ['neurology', 'detail', id] as const,
  summary: (patientId?: number) => ['neurology', 'summary', patientId] as const,
};

export function useNeurologyList(params: NeurologyListParams = {}) {
  return useQuery({
    queryKey: neurologyKeys.list(params),
    queryFn: () => neurologyApi.list(params),
  });
}

export function useNeurologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...neurologyKeys.all, 'all', patientId],
    queryFn: () => neurologyApi.getAll(patientId),
  });
}

export function useNeurology(id: number) {
  return useQuery({
    queryKey: neurologyKeys.detail(id),
    queryFn: () => neurologyApi.get(id),
    enabled: !!id,
  });
}

export function useNeurologyCount() {
  return useQuery({
    queryKey: [...neurologyKeys.all, 'count'],
    queryFn: () => neurologyApi.count(),
  });
}

export function useNeurologySummary(patientId?: number) {
  return useQuery({
    queryKey: neurologyKeys.summary(patientId),
    queryFn: () => neurologyApi.summary(patientId),
  });
}

export function useCreateNeurology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NeurologyCreateInput) => neurologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: neurologyKeys.all }),
  });
}

export function useUpdateNeurology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: NeurologyUpdateInput }) => neurologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: neurologyKeys.all });
      qc.invalidateQueries({ queryKey: neurologyKeys.detail(id) });
    },
  });
}

export function useDeleteNeurology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => neurologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: neurologyKeys.all }),
  });
}

export function useActivateNeurology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => neurologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: neurologyKeys.all });
      qc.invalidateQueries({ queryKey: neurologyKeys.detail(id) });
    },
  });
}

export function useDeactivateNeurology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => neurologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: neurologyKeys.all });
      qc.invalidateQueries({ queryKey: neurologyKeys.detail(id) });
    },
  });
}

export function useCompleteNeurology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => neurologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: neurologyKeys.all });
      qc.invalidateQueries({ queryKey: neurologyKeys.detail(id) });
    },
  });
}

export function useCancelNeurology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => neurologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: neurologyKeys.all });
      qc.invalidateQueries({ queryKey: neurologyKeys.detail(id) });
    },
  });
}
