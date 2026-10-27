import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { discharge_planningApi } from './api';
import type { DischargePlanningCreateInput, DischargePlanningListParams, DischargePlanningUpdateInput } from './types';

export const discharge_planningKeys = {
  all: ['discharge_planning'] as const,
  list: (params: DischargePlanningListParams) => ['discharge_planning', 'list', params] as const,
  detail: (id: number) => ['discharge_planning', 'detail', id] as const,
  summary: (patientId?: number) => ['discharge_planning', 'summary', patientId] as const,
};

export function useDischargePlanningList(params: DischargePlanningListParams = {}) {
  return useQuery({
    queryKey: discharge_planningKeys.list(params),
    queryFn: () => discharge_planningApi.list(params),
  });
}

export function useDischargePlanningAll(patientId?: number) {
  return useQuery({
    queryKey: [...discharge_planningKeys.all, 'all', patientId],
    queryFn: () => discharge_planningApi.getAll(patientId),
  });
}

export function useDischargePlanning(id: number) {
  return useQuery({
    queryKey: discharge_planningKeys.detail(id),
    queryFn: () => discharge_planningApi.get(id),
    enabled: !!id,
  });
}

export function useDischargePlanningCount() {
  return useQuery({
    queryKey: [...discharge_planningKeys.all, 'count'],
    queryFn: () => discharge_planningApi.count(),
  });
}

export function useDischargePlanningSummary(patientId?: number) {
  return useQuery({
    queryKey: discharge_planningKeys.summary(patientId),
    queryFn: () => discharge_planningApi.summary(patientId),
  });
}

export function useCreateDischargePlanning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DischargePlanningCreateInput) => discharge_planningApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: discharge_planningKeys.all }),
  });
}

export function useUpdateDischargePlanning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DischargePlanningUpdateInput }) => discharge_planningApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: discharge_planningKeys.all });
      qc.invalidateQueries({ queryKey: discharge_planningKeys.detail(id) });
    },
  });
}

export function useDeleteDischargePlanning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => discharge_planningApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: discharge_planningKeys.all }),
  });
}

export function useActivateDischargePlanning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => discharge_planningApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: discharge_planningKeys.all });
      qc.invalidateQueries({ queryKey: discharge_planningKeys.detail(id) });
    },
  });
}

export function useDeactivateDischargePlanning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => discharge_planningApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: discharge_planningKeys.all });
      qc.invalidateQueries({ queryKey: discharge_planningKeys.detail(id) });
    },
  });
}

export function useCompleteDischargePlanning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => discharge_planningApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: discharge_planningKeys.all });
      qc.invalidateQueries({ queryKey: discharge_planningKeys.detail(id) });
    },
  });
}

export function useCancelDischargePlanning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => discharge_planningApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: discharge_planningKeys.all });
      qc.invalidateQueries({ queryKey: discharge_planningKeys.detail(id) });
    },
  });
}
