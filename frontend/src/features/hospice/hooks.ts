import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hospiceApi } from './api';
import type { HospiceCreateInput, HospiceListParams, HospiceUpdateInput } from './types';

export const hospiceKeys = {
  all: ['hospice'] as const,
  list: (params: HospiceListParams) => ['hospice', 'list', params] as const,
  detail: (id: number) => ['hospice', 'detail', id] as const,
  summary: (patientId?: number) => ['hospice', 'summary', patientId] as const,
};

export function useHospiceList(params: HospiceListParams = {}) {
  return useQuery({
    queryKey: hospiceKeys.list(params),
    queryFn: () => hospiceApi.list(params),
  });
}

export function useHospiceAll(patientId?: number) {
  return useQuery({
    queryKey: [...hospiceKeys.all, 'all', patientId],
    queryFn: () => hospiceApi.getAll(patientId),
  });
}

export function useHospice(id: number) {
  return useQuery({
    queryKey: hospiceKeys.detail(id),
    queryFn: () => hospiceApi.get(id),
    enabled: !!id,
  });
}

export function useHospiceCount() {
  return useQuery({
    queryKey: [...hospiceKeys.all, 'count'],
    queryFn: () => hospiceApi.count(),
  });
}

export function useHospiceSummary(patientId?: number) {
  return useQuery({
    queryKey: hospiceKeys.summary(patientId),
    queryFn: () => hospiceApi.summary(patientId),
  });
}

export function useCreateHospice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: HospiceCreateInput) => hospiceApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: hospiceKeys.all }),
  });
}

export function useUpdateHospice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: HospiceUpdateInput }) => hospiceApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hospiceKeys.all });
      qc.invalidateQueries({ queryKey: hospiceKeys.detail(id) });
    },
  });
}

export function useDeleteHospice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => hospiceApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: hospiceKeys.all }),
  });
}

export function useActivateHospice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => hospiceApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: hospiceKeys.all });
      qc.invalidateQueries({ queryKey: hospiceKeys.detail(id) });
    },
  });
}

export function useDeactivateHospice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => hospiceApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: hospiceKeys.all });
      qc.invalidateQueries({ queryKey: hospiceKeys.detail(id) });
    },
  });
}

export function useCompleteHospice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => hospiceApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hospiceKeys.all });
      qc.invalidateQueries({ queryKey: hospiceKeys.detail(id) });
    },
  });
}

export function useCancelHospice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => hospiceApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hospiceKeys.all });
      qc.invalidateQueries({ queryKey: hospiceKeys.detail(id) });
    },
  });
}
