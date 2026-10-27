import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pathologyApi } from './api';
import type { PathologyCreateInput, PathologyListParams, PathologyUpdateInput } from './types';

export const pathologyKeys = {
  all: ['pathology'] as const,
  list: (params: PathologyListParams) => ['pathology', 'list', params] as const,
  detail: (id: number) => ['pathology', 'detail', id] as const,
  summary: (patientId?: number) => ['pathology', 'summary', patientId] as const,
};

export function usePathologyList(params: PathologyListParams = {}) {
  return useQuery({
    queryKey: pathologyKeys.list(params),
    queryFn: () => pathologyApi.list(params),
  });
}

export function usePathologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...pathologyKeys.all, 'all', patientId],
    queryFn: () => pathologyApi.getAll(patientId),
  });
}

export function usePathology(id: number) {
  return useQuery({
    queryKey: pathologyKeys.detail(id),
    queryFn: () => pathologyApi.get(id),
    enabled: !!id,
  });
}

export function usePathologyCount() {
  return useQuery({
    queryKey: [...pathologyKeys.all, 'count'],
    queryFn: () => pathologyApi.count(),
  });
}

export function usePathologySummary(patientId?: number) {
  return useQuery({
    queryKey: pathologyKeys.summary(patientId),
    queryFn: () => pathologyApi.summary(patientId),
  });
}

export function useCreatePathology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PathologyCreateInput) => pathologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: pathologyKeys.all }),
  });
}

export function useUpdatePathology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PathologyUpdateInput }) => pathologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pathologyKeys.all });
      qc.invalidateQueries({ queryKey: pathologyKeys.detail(id) });
    },
  });
}

export function useDeletePathology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pathologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: pathologyKeys.all }),
  });
}

export function useActivatePathology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pathologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pathologyKeys.all });
      qc.invalidateQueries({ queryKey: pathologyKeys.detail(id) });
    },
  });
}

export function useDeactivatePathology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pathologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pathologyKeys.all });
      qc.invalidateQueries({ queryKey: pathologyKeys.detail(id) });
    },
  });
}

export function useCompletePathology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => pathologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pathologyKeys.all });
      qc.invalidateQueries({ queryKey: pathologyKeys.detail(id) });
    },
  });
}

export function useCancelPathology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => pathologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pathologyKeys.all });
      qc.invalidateQueries({ queryKey: pathologyKeys.detail(id) });
    },
  });
}
