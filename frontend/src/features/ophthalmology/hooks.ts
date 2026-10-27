import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ophthalmologyApi } from './api';
import type { OphthalmologyCreateInput, OphthalmologyListParams, OphthalmologyUpdateInput } from './types';

export const ophthalmologyKeys = {
  all: ['ophthalmology'] as const,
  list: (params: OphthalmologyListParams) => ['ophthalmology', 'list', params] as const,
  detail: (id: number) => ['ophthalmology', 'detail', id] as const,
  summary: (patientId?: number) => ['ophthalmology', 'summary', patientId] as const,
};

export function useOphthalmologyList(params: OphthalmologyListParams = {}) {
  return useQuery({
    queryKey: ophthalmologyKeys.list(params),
    queryFn: () => ophthalmologyApi.list(params),
  });
}

export function useOphthalmologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...ophthalmologyKeys.all, 'all', patientId],
    queryFn: () => ophthalmologyApi.getAll(patientId),
  });
}

export function useOphthalmology(id: number) {
  return useQuery({
    queryKey: ophthalmologyKeys.detail(id),
    queryFn: () => ophthalmologyApi.get(id),
    enabled: !!id,
  });
}

export function useOphthalmologyCount() {
  return useQuery({
    queryKey: [...ophthalmologyKeys.all, 'count'],
    queryFn: () => ophthalmologyApi.count(),
  });
}

export function useOphthalmologySummary(patientId?: number) {
  return useQuery({
    queryKey: ophthalmologyKeys.summary(patientId),
    queryFn: () => ophthalmologyApi.summary(patientId),
  });
}

export function useCreateOphthalmology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OphthalmologyCreateInput) => ophthalmologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ophthalmologyKeys.all }),
  });
}

export function useUpdateOphthalmology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: OphthalmologyUpdateInput }) => ophthalmologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.all });
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.detail(id) });
    },
  });
}

export function useDeleteOphthalmology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ophthalmologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ophthalmologyKeys.all }),
  });
}

export function useActivateOphthalmology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ophthalmologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.all });
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.detail(id) });
    },
  });
}

export function useDeactivateOphthalmology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ophthalmologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.all });
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.detail(id) });
    },
  });
}

export function useCompleteOphthalmology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => ophthalmologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.all });
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.detail(id) });
    },
  });
}

export function useCancelOphthalmology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => ophthalmologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.all });
      qc.invalidateQueries({ queryKey: ophthalmologyKeys.detail(id) });
    },
  });
}
