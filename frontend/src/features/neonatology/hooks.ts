import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { neonatologyApi } from './api';
import type { NeonatologyCreateInput, NeonatologyListParams, NeonatologyUpdateInput } from './types';

export const neonatologyKeys = {
  all: ['neonatology'] as const,
  list: (params: NeonatologyListParams) => ['neonatology', 'list', params] as const,
  detail: (id: number) => ['neonatology', 'detail', id] as const,
  summary: (patientId?: number) => ['neonatology', 'summary', patientId] as const,
};

export function useNeonatologyList(params: NeonatologyListParams = {}) {
  return useQuery({
    queryKey: neonatologyKeys.list(params),
    queryFn: () => neonatologyApi.list(params),
  });
}

export function useNeonatologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...neonatologyKeys.all, 'all', patientId],
    queryFn: () => neonatologyApi.getAll(patientId),
  });
}

export function useNeonatology(id: number) {
  return useQuery({
    queryKey: neonatologyKeys.detail(id),
    queryFn: () => neonatologyApi.get(id),
    enabled: !!id,
  });
}

export function useNeonatologyCount() {
  return useQuery({
    queryKey: [...neonatologyKeys.all, 'count'],
    queryFn: () => neonatologyApi.count(),
  });
}

export function useNeonatologySummary(patientId?: number) {
  return useQuery({
    queryKey: neonatologyKeys.summary(patientId),
    queryFn: () => neonatologyApi.summary(patientId),
  });
}

export function useCreateNeonatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NeonatologyCreateInput) => neonatologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: neonatologyKeys.all }),
  });
}

export function useUpdateNeonatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: NeonatologyUpdateInput }) => neonatologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: neonatologyKeys.all });
      qc.invalidateQueries({ queryKey: neonatologyKeys.detail(id) });
    },
  });
}

export function useDeleteNeonatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => neonatologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: neonatologyKeys.all }),
  });
}

export function useActivateNeonatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => neonatologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: neonatologyKeys.all });
      qc.invalidateQueries({ queryKey: neonatologyKeys.detail(id) });
    },
  });
}

export function useDeactivateNeonatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => neonatologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: neonatologyKeys.all });
      qc.invalidateQueries({ queryKey: neonatologyKeys.detail(id) });
    },
  });
}

export function useCompleteNeonatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => neonatologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: neonatologyKeys.all });
      qc.invalidateQueries({ queryKey: neonatologyKeys.detail(id) });
    },
  });
}

export function useCancelNeonatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => neonatologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: neonatologyKeys.all });
      qc.invalidateQueries({ queryKey: neonatologyKeys.detail(id) });
    },
  });
}
