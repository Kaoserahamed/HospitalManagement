import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { neurosurgeryApi } from './api';
import type { NeurosurgeryCreateInput, NeurosurgeryListParams, NeurosurgeryUpdateInput } from './types';

export const neurosurgeryKeys = {
  all: ['neurosurgery'] as const,
  list: (params: NeurosurgeryListParams) => ['neurosurgery', 'list', params] as const,
  detail: (id: number) => ['neurosurgery', 'detail', id] as const,
  summary: (patientId?: number) => ['neurosurgery', 'summary', patientId] as const,
};

export function useNeurosurgeryList(params: NeurosurgeryListParams = {}) {
  return useQuery({
    queryKey: neurosurgeryKeys.list(params),
    queryFn: () => neurosurgeryApi.list(params),
  });
}

export function useNeurosurgeryAll(patientId?: number) {
  return useQuery({
    queryKey: [...neurosurgeryKeys.all, 'all', patientId],
    queryFn: () => neurosurgeryApi.getAll(patientId),
  });
}

export function useNeurosurgery(id: number) {
  return useQuery({
    queryKey: neurosurgeryKeys.detail(id),
    queryFn: () => neurosurgeryApi.get(id),
    enabled: !!id,
  });
}

export function useNeurosurgeryCount() {
  return useQuery({
    queryKey: [...neurosurgeryKeys.all, 'count'],
    queryFn: () => neurosurgeryApi.count(),
  });
}

export function useNeurosurgerySummary(patientId?: number) {
  return useQuery({
    queryKey: neurosurgeryKeys.summary(patientId),
    queryFn: () => neurosurgeryApi.summary(patientId),
  });
}

export function useCreateNeurosurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NeurosurgeryCreateInput) => neurosurgeryApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: neurosurgeryKeys.all }),
  });
}

export function useUpdateNeurosurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: NeurosurgeryUpdateInput }) => neurosurgeryApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.all });
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.detail(id) });
    },
  });
}

export function useDeleteNeurosurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => neurosurgeryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: neurosurgeryKeys.all }),
  });
}

export function useActivateNeurosurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => neurosurgeryApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.all });
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.detail(id) });
    },
  });
}

export function useDeactivateNeurosurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => neurosurgeryApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.all });
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.detail(id) });
    },
  });
}

export function useCompleteNeurosurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => neurosurgeryApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.all });
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.detail(id) });
    },
  });
}

export function useCancelNeurosurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => neurosurgeryApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.all });
      qc.invalidateQueries({ queryKey: neurosurgeryKeys.detail(id) });
    },
  });
}
