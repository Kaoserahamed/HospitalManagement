import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sports_medicineApi } from './api';
import type { SportsMedicineCreateInput, SportsMedicineListParams, SportsMedicineUpdateInput } from './types';

export const sports_medicineKeys = {
  all: ['sports_medicine'] as const,
  list: (params: SportsMedicineListParams) => ['sports_medicine', 'list', params] as const,
  detail: (id: number) => ['sports_medicine', 'detail', id] as const,
  summary: (patientId?: number) => ['sports_medicine', 'summary', patientId] as const,
};

export function useSportsMedicineList(params: SportsMedicineListParams = {}) {
  return useQuery({
    queryKey: sports_medicineKeys.list(params),
    queryFn: () => sports_medicineApi.list(params),
  });
}

export function useSportsMedicineAll(patientId?: number) {
  return useQuery({
    queryKey: [...sports_medicineKeys.all, 'all', patientId],
    queryFn: () => sports_medicineApi.getAll(patientId),
  });
}

export function useSportsMedicine(id: number) {
  return useQuery({
    queryKey: sports_medicineKeys.detail(id),
    queryFn: () => sports_medicineApi.get(id),
    enabled: !!id,
  });
}

export function useSportsMedicineCount() {
  return useQuery({
    queryKey: [...sports_medicineKeys.all, 'count'],
    queryFn: () => sports_medicineApi.count(),
  });
}

export function useSportsMedicineSummary(patientId?: number) {
  return useQuery({
    queryKey: sports_medicineKeys.summary(patientId),
    queryFn: () => sports_medicineApi.summary(patientId),
  });
}

export function useCreateSportsMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SportsMedicineCreateInput) => sports_medicineApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sports_medicineKeys.all }),
  });
}

export function useUpdateSportsMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SportsMedicineUpdateInput }) => sports_medicineApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sports_medicineKeys.all });
      qc.invalidateQueries({ queryKey: sports_medicineKeys.detail(id) });
    },
  });
}

export function useDeleteSportsMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sports_medicineApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: sports_medicineKeys.all }),
  });
}

export function useActivateSportsMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sports_medicineApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: sports_medicineKeys.all });
      qc.invalidateQueries({ queryKey: sports_medicineKeys.detail(id) });
    },
  });
}

export function useDeactivateSportsMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sports_medicineApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: sports_medicineKeys.all });
      qc.invalidateQueries({ queryKey: sports_medicineKeys.detail(id) });
    },
  });
}

export function useCompleteSportsMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => sports_medicineApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sports_medicineKeys.all });
      qc.invalidateQueries({ queryKey: sports_medicineKeys.detail(id) });
    },
  });
}

export function useCancelSportsMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => sports_medicineApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sports_medicineKeys.all });
      qc.invalidateQueries({ queryKey: sports_medicineKeys.detail(id) });
    },
  });
}
