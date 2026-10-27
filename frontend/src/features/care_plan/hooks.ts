import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { care_planApi } from './api';
import type { CarePlanCreateInput, CarePlanListParams, CarePlanUpdateInput } from './types';

export const care_planKeys = {
  all: ['care_plan'] as const,
  list: (params: CarePlanListParams) => ['care_plan', 'list', params] as const,
  detail: (id: number) => ['care_plan', 'detail', id] as const,
  summary: (patientId?: number) => ['care_plan', 'summary', patientId] as const,
};

export function useCarePlanList(params: CarePlanListParams = {}) {
  return useQuery({
    queryKey: care_planKeys.list(params),
    queryFn: () => care_planApi.list(params),
  });
}

export function useCarePlanAll(patientId?: number) {
  return useQuery({
    queryKey: [...care_planKeys.all, 'all', patientId],
    queryFn: () => care_planApi.getAll(patientId),
  });
}

export function useCarePlan(id: number) {
  return useQuery({
    queryKey: care_planKeys.detail(id),
    queryFn: () => care_planApi.get(id),
    enabled: !!id,
  });
}

export function useCarePlanCount() {
  return useQuery({
    queryKey: [...care_planKeys.all, 'count'],
    queryFn: () => care_planApi.count(),
  });
}

export function useCarePlanSummary(patientId?: number) {
  return useQuery({
    queryKey: care_planKeys.summary(patientId),
    queryFn: () => care_planApi.summary(patientId),
  });
}

export function useCreateCarePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CarePlanCreateInput) => care_planApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: care_planKeys.all }),
  });
}

export function useUpdateCarePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CarePlanUpdateInput }) => care_planApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: care_planKeys.all });
      qc.invalidateQueries({ queryKey: care_planKeys.detail(id) });
    },
  });
}

export function useDeleteCarePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => care_planApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: care_planKeys.all }),
  });
}

export function useActivateCarePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => care_planApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: care_planKeys.all });
      qc.invalidateQueries({ queryKey: care_planKeys.detail(id) });
    },
  });
}

export function useDeactivateCarePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => care_planApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: care_planKeys.all });
      qc.invalidateQueries({ queryKey: care_planKeys.detail(id) });
    },
  });
}

export function useCompleteCarePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => care_planApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: care_planKeys.all });
      qc.invalidateQueries({ queryKey: care_planKeys.detail(id) });
    },
  });
}

export function useCancelCarePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => care_planApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: care_planKeys.all });
      qc.invalidateQueries({ queryKey: care_planKeys.detail(id) });
    },
  });
}
