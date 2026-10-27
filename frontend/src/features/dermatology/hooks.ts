import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dermatologyApi } from './api';
import type { DermatologyCreateInput, DermatologyListParams, DermatologyUpdateInput } from './types';

export const dermatologyKeys = {
  all: ['dermatology'] as const,
  list: (params: DermatologyListParams) => ['dermatology', 'list', params] as const,
  detail: (id: number) => ['dermatology', 'detail', id] as const,
  summary: (patientId?: number) => ['dermatology', 'summary', patientId] as const,
};

export function useDermatologyList(params: DermatologyListParams = {}) {
  return useQuery({
    queryKey: dermatologyKeys.list(params),
    queryFn: () => dermatologyApi.list(params),
  });
}

export function useDermatologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...dermatologyKeys.all, 'all', patientId],
    queryFn: () => dermatologyApi.getAll(patientId),
  });
}

export function useDermatology(id: number) {
  return useQuery({
    queryKey: dermatologyKeys.detail(id),
    queryFn: () => dermatologyApi.get(id),
    enabled: !!id,
  });
}

export function useDermatologyCount() {
  return useQuery({
    queryKey: [...dermatologyKeys.all, 'count'],
    queryFn: () => dermatologyApi.count(),
  });
}

export function useDermatologySummary(patientId?: number) {
  return useQuery({
    queryKey: dermatologyKeys.summary(patientId),
    queryFn: () => dermatologyApi.summary(patientId),
  });
}

export function useCreateDermatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DermatologyCreateInput) => dermatologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: dermatologyKeys.all }),
  });
}

export function useUpdateDermatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DermatologyUpdateInput }) => dermatologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: dermatologyKeys.all });
      qc.invalidateQueries({ queryKey: dermatologyKeys.detail(id) });
    },
  });
}

export function useDeleteDermatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dermatologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: dermatologyKeys.all }),
  });
}

export function useActivateDermatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dermatologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: dermatologyKeys.all });
      qc.invalidateQueries({ queryKey: dermatologyKeys.detail(id) });
    },
  });
}

export function useDeactivateDermatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dermatologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: dermatologyKeys.all });
      qc.invalidateQueries({ queryKey: dermatologyKeys.detail(id) });
    },
  });
}

export function useCompleteDermatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => dermatologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: dermatologyKeys.all });
      qc.invalidateQueries({ queryKey: dermatologyKeys.detail(id) });
    },
  });
}

export function useCancelDermatology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => dermatologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: dermatologyKeys.all });
      qc.invalidateQueries({ queryKey: dermatologyKeys.detail(id) });
    },
  });
}
