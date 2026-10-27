import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nephrologyApi } from './api';
import type { NephrologyCreateInput, NephrologyListParams, NephrologyUpdateInput } from './types';

export const nephrologyKeys = {
  all: ['nephrology'] as const,
  list: (params: NephrologyListParams) => ['nephrology', 'list', params] as const,
  detail: (id: number) => ['nephrology', 'detail', id] as const,
  summary: (patientId?: number) => ['nephrology', 'summary', patientId] as const,
};

export function useNephrologyList(params: NephrologyListParams = {}) {
  return useQuery({
    queryKey: nephrologyKeys.list(params),
    queryFn: () => nephrologyApi.list(params),
  });
}

export function useNephrologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...nephrologyKeys.all, 'all', patientId],
    queryFn: () => nephrologyApi.getAll(patientId),
  });
}

export function useNephrology(id: number) {
  return useQuery({
    queryKey: nephrologyKeys.detail(id),
    queryFn: () => nephrologyApi.get(id),
    enabled: !!id,
  });
}

export function useNephrologyCount() {
  return useQuery({
    queryKey: [...nephrologyKeys.all, 'count'],
    queryFn: () => nephrologyApi.count(),
  });
}

export function useNephrologySummary(patientId?: number) {
  return useQuery({
    queryKey: nephrologyKeys.summary(patientId),
    queryFn: () => nephrologyApi.summary(patientId),
  });
}

export function useCreateNephrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NephrologyCreateInput) => nephrologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: nephrologyKeys.all }),
  });
}

export function useUpdateNephrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: NephrologyUpdateInput }) => nephrologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: nephrologyKeys.all });
      qc.invalidateQueries({ queryKey: nephrologyKeys.detail(id) });
    },
  });
}

export function useDeleteNephrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => nephrologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: nephrologyKeys.all }),
  });
}

export function useActivateNephrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => nephrologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: nephrologyKeys.all });
      qc.invalidateQueries({ queryKey: nephrologyKeys.detail(id) });
    },
  });
}

export function useDeactivateNephrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => nephrologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: nephrologyKeys.all });
      qc.invalidateQueries({ queryKey: nephrologyKeys.detail(id) });
    },
  });
}

export function useCompleteNephrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => nephrologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: nephrologyKeys.all });
      qc.invalidateQueries({ queryKey: nephrologyKeys.detail(id) });
    },
  });
}

export function useCancelNephrology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => nephrologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: nephrologyKeys.all });
      qc.invalidateQueries({ queryKey: nephrologyKeys.detail(id) });
    },
  });
}
