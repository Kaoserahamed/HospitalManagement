import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pressure_ulcerApi } from './api';
import type { PressureUlcerCreateInput, PressureUlcerListParams, PressureUlcerUpdateInput } from './types';

export const pressure_ulcerKeys = {
  all: ['pressure_ulcer'] as const,
  list: (params: PressureUlcerListParams) => ['pressure_ulcer', 'list', params] as const,
  detail: (id: number) => ['pressure_ulcer', 'detail', id] as const,
  summary: (patientId?: number) => ['pressure_ulcer', 'summary', patientId] as const,
};

export function usePressureUlcerList(params: PressureUlcerListParams = {}) {
  return useQuery({
    queryKey: pressure_ulcerKeys.list(params),
    queryFn: () => pressure_ulcerApi.list(params),
  });
}

export function usePressureUlcerAll(patientId?: number) {
  return useQuery({
    queryKey: [...pressure_ulcerKeys.all, 'all', patientId],
    queryFn: () => pressure_ulcerApi.getAll(patientId),
  });
}

export function usePressureUlcer(id: number) {
  return useQuery({
    queryKey: pressure_ulcerKeys.detail(id),
    queryFn: () => pressure_ulcerApi.get(id),
    enabled: !!id,
  });
}

export function usePressureUlcerCount() {
  return useQuery({
    queryKey: [...pressure_ulcerKeys.all, 'count'],
    queryFn: () => pressure_ulcerApi.count(),
  });
}

export function usePressureUlcerSummary(patientId?: number) {
  return useQuery({
    queryKey: pressure_ulcerKeys.summary(patientId),
    queryFn: () => pressure_ulcerApi.summary(patientId),
  });
}

export function useCreatePressureUlcer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PressureUlcerCreateInput) => pressure_ulcerApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: pressure_ulcerKeys.all }),
  });
}

export function useUpdatePressureUlcer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PressureUlcerUpdateInput }) => pressure_ulcerApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.all });
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.detail(id) });
    },
  });
}

export function useDeletePressureUlcer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pressure_ulcerApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: pressure_ulcerKeys.all }),
  });
}

export function useActivatePressureUlcer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pressure_ulcerApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.all });
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.detail(id) });
    },
  });
}

export function useDeactivatePressureUlcer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pressure_ulcerApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.all });
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.detail(id) });
    },
  });
}

export function useCompletePressureUlcer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => pressure_ulcerApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.all });
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.detail(id) });
    },
  });
}

export function useCancelPressureUlcer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => pressure_ulcerApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.all });
      qc.invalidateQueries({ queryKey: pressure_ulcerKeys.detail(id) });
    },
  });
}
