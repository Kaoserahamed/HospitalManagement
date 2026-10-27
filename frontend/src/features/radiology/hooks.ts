import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { radiologyApi } from './api';
import type { RadiologyCreateInput, RadiologyListParams, RadiologyUpdateInput } from './types';

export const radiologyKeys = {
  all: ['radiology'] as const,
  list: (params: RadiologyListParams) => ['radiology', 'list', params] as const,
  detail: (id: number) => ['radiology', 'detail', id] as const,
  summary: (patientId?: number) => ['radiology', 'summary', patientId] as const,
};

export function useRadiologyList(params: RadiologyListParams = {}) {
  return useQuery({
    queryKey: radiologyKeys.list(params),
    queryFn: () => radiologyApi.list(params),
  });
}

export function useRadiologyAll(patientId?: number) {
  return useQuery({
    queryKey: [...radiologyKeys.all, 'all', patientId],
    queryFn: () => radiologyApi.getAll(patientId),
  });
}

export function useRadiology(id: number) {
  return useQuery({
    queryKey: radiologyKeys.detail(id),
    queryFn: () => radiologyApi.get(id),
    enabled: !!id,
  });
}

export function useRadiologyCount() {
  return useQuery({
    queryKey: [...radiologyKeys.all, 'count'],
    queryFn: () => radiologyApi.count(),
  });
}

export function useRadiologySummary(patientId?: number) {
  return useQuery({
    queryKey: radiologyKeys.summary(patientId),
    queryFn: () => radiologyApi.summary(patientId),
  });
}

export function useCreateRadiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RadiologyCreateInput) => radiologyApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: radiologyKeys.all }),
  });
}

export function useUpdateRadiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RadiologyUpdateInput }) => radiologyApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: radiologyKeys.all });
      qc.invalidateQueries({ queryKey: radiologyKeys.detail(id) });
    },
  });
}

export function useDeleteRadiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => radiologyApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: radiologyKeys.all }),
  });
}

export function useActivateRadiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => radiologyApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: radiologyKeys.all });
      qc.invalidateQueries({ queryKey: radiologyKeys.detail(id) });
    },
  });
}

export function useDeactivateRadiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => radiologyApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: radiologyKeys.all });
      qc.invalidateQueries({ queryKey: radiologyKeys.detail(id) });
    },
  });
}

export function useCompleteRadiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => radiologyApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: radiologyKeys.all });
      qc.invalidateQueries({ queryKey: radiologyKeys.detail(id) });
    },
  });
}

export function useCancelRadiology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => radiologyApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: radiologyKeys.all });
      qc.invalidateQueries({ queryKey: radiologyKeys.detail(id) });
    },
  });
}
