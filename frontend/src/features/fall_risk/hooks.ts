import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fall_riskApi } from './api';
import type { FallRiskCreateInput, FallRiskListParams, FallRiskUpdateInput } from './types';

export const fall_riskKeys = {
  all: ['fall_risk'] as const,
  list: (params: FallRiskListParams) => ['fall_risk', 'list', params] as const,
  detail: (id: number) => ['fall_risk', 'detail', id] as const,
  summary: (patientId?: number) => ['fall_risk', 'summary', patientId] as const,
};

export function useFallRiskList(params: FallRiskListParams = {}) {
  return useQuery({
    queryKey: fall_riskKeys.list(params),
    queryFn: () => fall_riskApi.list(params),
  });
}

export function useFallRiskAll(patientId?: number) {
  return useQuery({
    queryKey: [...fall_riskKeys.all, 'all', patientId],
    queryFn: () => fall_riskApi.getAll(patientId),
  });
}

export function useFallRisk(id: number) {
  return useQuery({
    queryKey: fall_riskKeys.detail(id),
    queryFn: () => fall_riskApi.get(id),
    enabled: !!id,
  });
}

export function useFallRiskCount() {
  return useQuery({
    queryKey: [...fall_riskKeys.all, 'count'],
    queryFn: () => fall_riskApi.count(),
  });
}

export function useFallRiskSummary(patientId?: number) {
  return useQuery({
    queryKey: fall_riskKeys.summary(patientId),
    queryFn: () => fall_riskApi.summary(patientId),
  });
}

export function useCreateFallRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FallRiskCreateInput) => fall_riskApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: fall_riskKeys.all }),
  });
}

export function useUpdateFallRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FallRiskUpdateInput }) => fall_riskApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: fall_riskKeys.all });
      qc.invalidateQueries({ queryKey: fall_riskKeys.detail(id) });
    },
  });
}

export function useDeleteFallRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fall_riskApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: fall_riskKeys.all }),
  });
}

export function useActivateFallRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fall_riskApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: fall_riskKeys.all });
      qc.invalidateQueries({ queryKey: fall_riskKeys.detail(id) });
    },
  });
}

export function useDeactivateFallRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fall_riskApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: fall_riskKeys.all });
      qc.invalidateQueries({ queryKey: fall_riskKeys.detail(id) });
    },
  });
}

export function useCompleteFallRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => fall_riskApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: fall_riskKeys.all });
      qc.invalidateQueries({ queryKey: fall_riskKeys.detail(id) });
    },
  });
}

export function useCancelFallRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => fall_riskApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: fall_riskKeys.all });
      qc.invalidateQueries({ queryKey: fall_riskKeys.detail(id) });
    },
  });
}
