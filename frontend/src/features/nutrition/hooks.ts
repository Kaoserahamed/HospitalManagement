import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nutritionApi } from './api';
import type { NutritionCreateInput, NutritionListParams, NutritionUpdateInput } from './types';

export const nutritionKeys = {
  all: ['nutrition'] as const,
  list: (params: NutritionListParams) => ['nutrition', 'list', params] as const,
  detail: (id: number) => ['nutrition', 'detail', id] as const,
  summary: (patientId?: number) => ['nutrition', 'summary', patientId] as const,
};

export function useNutritionList(params: NutritionListParams = {}) {
  return useQuery({
    queryKey: nutritionKeys.list(params),
    queryFn: () => nutritionApi.list(params),
  });
}

export function useNutritionAll(patientId?: number) {
  return useQuery({
    queryKey: [...nutritionKeys.all, 'all', patientId],
    queryFn: () => nutritionApi.getAll(patientId),
  });
}

export function useNutrition(id: number) {
  return useQuery({
    queryKey: nutritionKeys.detail(id),
    queryFn: () => nutritionApi.get(id),
    enabled: !!id,
  });
}

export function useNutritionCount() {
  return useQuery({
    queryKey: [...nutritionKeys.all, 'count'],
    queryFn: () => nutritionApi.count(),
  });
}

export function useNutritionSummary(patientId?: number) {
  return useQuery({
    queryKey: nutritionKeys.summary(patientId),
    queryFn: () => nutritionApi.summary(patientId),
  });
}

export function useCreateNutrition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NutritionCreateInput) => nutritionApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionKeys.all }),
  });
}

export function useUpdateNutrition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: NutritionUpdateInput }) => nutritionApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: nutritionKeys.all });
      qc.invalidateQueries({ queryKey: nutritionKeys.detail(id) });
    },
  });
}

export function useDeleteNutrition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => nutritionApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionKeys.all }),
  });
}

export function useActivateNutrition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => nutritionApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: nutritionKeys.all });
      qc.invalidateQueries({ queryKey: nutritionKeys.detail(id) });
    },
  });
}

export function useDeactivateNutrition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => nutritionApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: nutritionKeys.all });
      qc.invalidateQueries({ queryKey: nutritionKeys.detail(id) });
    },
  });
}

export function useCompleteNutrition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => nutritionApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: nutritionKeys.all });
      qc.invalidateQueries({ queryKey: nutritionKeys.detail(id) });
    },
  });
}

export function useCancelNutrition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => nutritionApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: nutritionKeys.all });
      qc.invalidateQueries({ queryKey: nutritionKeys.detail(id) });
    },
  });
}
