import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { occupational_healthApi } from './api';
import type { OccupationalHealthCreateInput, OccupationalHealthListParams, OccupationalHealthUpdateInput } from './types';

export const occupational_healthKeys = {
  all: ['occupational_health'] as const,
  list: (params: OccupationalHealthListParams) => ['occupational_health', 'list', params] as const,
  detail: (id: number) => ['occupational_health', 'detail', id] as const,
  summary: (patientId?: number) => ['occupational_health', 'summary', patientId] as const,
};

export function useOccupationalHealthList(params: OccupationalHealthListParams = {}) {
  return useQuery({
    queryKey: occupational_healthKeys.list(params),
    queryFn: () => occupational_healthApi.list(params),
  });
}

export function useOccupationalHealthAll(patientId?: number) {
  return useQuery({
    queryKey: [...occupational_healthKeys.all, 'all', patientId],
    queryFn: () => occupational_healthApi.getAll(patientId),
  });
}

export function useOccupationalHealth(id: number) {
  return useQuery({
    queryKey: occupational_healthKeys.detail(id),
    queryFn: () => occupational_healthApi.get(id),
    enabled: !!id,
  });
}

export function useOccupationalHealthCount() {
  return useQuery({
    queryKey: [...occupational_healthKeys.all, 'count'],
    queryFn: () => occupational_healthApi.count(),
  });
}

export function useOccupationalHealthSummary(patientId?: number) {
  return useQuery({
    queryKey: occupational_healthKeys.summary(patientId),
    queryFn: () => occupational_healthApi.summary(patientId),
  });
}

export function useCreateOccupationalHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OccupationalHealthCreateInput) => occupational_healthApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: occupational_healthKeys.all }),
  });
}

export function useUpdateOccupationalHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: OccupationalHealthUpdateInput }) => occupational_healthApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: occupational_healthKeys.all });
      qc.invalidateQueries({ queryKey: occupational_healthKeys.detail(id) });
    },
  });
}

export function useDeleteOccupationalHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => occupational_healthApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: occupational_healthKeys.all }),
  });
}

export function useActivateOccupationalHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => occupational_healthApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: occupational_healthKeys.all });
      qc.invalidateQueries({ queryKey: occupational_healthKeys.detail(id) });
    },
  });
}

export function useDeactivateOccupationalHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => occupational_healthApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: occupational_healthKeys.all });
      qc.invalidateQueries({ queryKey: occupational_healthKeys.detail(id) });
    },
  });
}

export function useCompleteOccupationalHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => occupational_healthApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: occupational_healthKeys.all });
      qc.invalidateQueries({ queryKey: occupational_healthKeys.detail(id) });
    },
  });
}

export function useCancelOccupationalHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => occupational_healthApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: occupational_healthKeys.all });
      qc.invalidateQueries({ queryKey: occupational_healthKeys.detail(id) });
    },
  });
}
