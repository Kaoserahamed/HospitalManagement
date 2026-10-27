import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { palliative_careApi } from './api';
import type { PalliativeCareCreateInput, PalliativeCareListParams, PalliativeCareUpdateInput } from './types';

export const palliative_careKeys = {
  all: ['palliative_care'] as const,
  list: (params: PalliativeCareListParams) => ['palliative_care', 'list', params] as const,
  detail: (id: number) => ['palliative_care', 'detail', id] as const,
  summary: (patientId?: number) => ['palliative_care', 'summary', patientId] as const,
};

export function usePalliativeCareList(params: PalliativeCareListParams = {}) {
  return useQuery({
    queryKey: palliative_careKeys.list(params),
    queryFn: () => palliative_careApi.list(params),
  });
}

export function usePalliativeCareAll(patientId?: number) {
  return useQuery({
    queryKey: [...palliative_careKeys.all, 'all', patientId],
    queryFn: () => palliative_careApi.getAll(patientId),
  });
}

export function usePalliativeCare(id: number) {
  return useQuery({
    queryKey: palliative_careKeys.detail(id),
    queryFn: () => palliative_careApi.get(id),
    enabled: !!id,
  });
}

export function usePalliativeCareCount() {
  return useQuery({
    queryKey: [...palliative_careKeys.all, 'count'],
    queryFn: () => palliative_careApi.count(),
  });
}

export function usePalliativeCareSummary(patientId?: number) {
  return useQuery({
    queryKey: palliative_careKeys.summary(patientId),
    queryFn: () => palliative_careApi.summary(patientId),
  });
}

export function useCreatePalliativeCare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PalliativeCareCreateInput) => palliative_careApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: palliative_careKeys.all }),
  });
}

export function useUpdatePalliativeCare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PalliativeCareUpdateInput }) => palliative_careApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: palliative_careKeys.all });
      qc.invalidateQueries({ queryKey: palliative_careKeys.detail(id) });
    },
  });
}

export function useDeletePalliativeCare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => palliative_careApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: palliative_careKeys.all }),
  });
}

export function useActivatePalliativeCare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => palliative_careApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: palliative_careKeys.all });
      qc.invalidateQueries({ queryKey: palliative_careKeys.detail(id) });
    },
  });
}

export function useDeactivatePalliativeCare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => palliative_careApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: palliative_careKeys.all });
      qc.invalidateQueries({ queryKey: palliative_careKeys.detail(id) });
    },
  });
}

export function useCompletePalliativeCare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => palliative_careApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: palliative_careKeys.all });
      qc.invalidateQueries({ queryKey: palliative_careKeys.detail(id) });
    },
  });
}

export function useCancelPalliativeCare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => palliative_careApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: palliative_careKeys.all });
      qc.invalidateQueries({ queryKey: palliative_careKeys.detail(id) });
    },
  });
}
