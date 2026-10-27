import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { telehealthApi } from './api';
import type { TelehealthCreateInput, TelehealthListParams, TelehealthUpdateInput } from './types';

export const telehealthKeys = {
  all: ['telehealth'] as const,
  list: (params: TelehealthListParams) => ['telehealth', 'list', params] as const,
  detail: (id: number) => ['telehealth', 'detail', id] as const,
  summary: (patientId?: number) => ['telehealth', 'summary', patientId] as const,
};

export function useTelehealthList(params: TelehealthListParams = {}) {
  return useQuery({
    queryKey: telehealthKeys.list(params),
    queryFn: () => telehealthApi.list(params),
  });
}

export function useTelehealthAll(patientId?: number) {
  return useQuery({
    queryKey: [...telehealthKeys.all, 'all', patientId],
    queryFn: () => telehealthApi.getAll(patientId),
  });
}

export function useTelehealth(id: number) {
  return useQuery({
    queryKey: telehealthKeys.detail(id),
    queryFn: () => telehealthApi.get(id),
    enabled: !!id,
  });
}

export function useTelehealthCount() {
  return useQuery({
    queryKey: [...telehealthKeys.all, 'count'],
    queryFn: () => telehealthApi.count(),
  });
}

export function useTelehealthSummary(patientId?: number) {
  return useQuery({
    queryKey: telehealthKeys.summary(patientId),
    queryFn: () => telehealthApi.summary(patientId),
  });
}

export function useCreateTelehealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TelehealthCreateInput) => telehealthApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: telehealthKeys.all }),
  });
}

export function useUpdateTelehealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TelehealthUpdateInput }) => telehealthApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: telehealthKeys.all });
      qc.invalidateQueries({ queryKey: telehealthKeys.detail(id) });
    },
  });
}

export function useDeleteTelehealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => telehealthApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: telehealthKeys.all }),
  });
}

export function useActivateTelehealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => telehealthApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: telehealthKeys.all });
      qc.invalidateQueries({ queryKey: telehealthKeys.detail(id) });
    },
  });
}

export function useDeactivateTelehealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => telehealthApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: telehealthKeys.all });
      qc.invalidateQueries({ queryKey: telehealthKeys.detail(id) });
    },
  });
}

export function useCompleteTelehealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => telehealthApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: telehealthKeys.all });
      qc.invalidateQueries({ queryKey: telehealthKeys.detail(id) });
    },
  });
}

export function useCancelTelehealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => telehealthApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: telehealthKeys.all });
      qc.invalidateQueries({ queryKey: telehealthKeys.detail(id) });
    },
  });
}
