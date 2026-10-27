import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { quality_improvementApi } from './api';
import type { QualityImprovementCreateInput, QualityImprovementListParams, QualityImprovementUpdateInput } from './types';

export const quality_improvementKeys = {
  all: ['quality_improvement'] as const,
  list: (params: QualityImprovementListParams) => ['quality_improvement', 'list', params] as const,
  detail: (id: number) => ['quality_improvement', 'detail', id] as const,
  summary: (patientId?: number) => ['quality_improvement', 'summary', patientId] as const,
};

export function useQualityImprovementList(params: QualityImprovementListParams = {}) {
  return useQuery({
    queryKey: quality_improvementKeys.list(params),
    queryFn: () => quality_improvementApi.list(params),
  });
}

export function useQualityImprovementAll(patientId?: number) {
  return useQuery({
    queryKey: [...quality_improvementKeys.all, 'all', patientId],
    queryFn: () => quality_improvementApi.getAll(patientId),
  });
}

export function useQualityImprovement(id: number) {
  return useQuery({
    queryKey: quality_improvementKeys.detail(id),
    queryFn: () => quality_improvementApi.get(id),
    enabled: !!id,
  });
}

export function useQualityImprovementCount() {
  return useQuery({
    queryKey: [...quality_improvementKeys.all, 'count'],
    queryFn: () => quality_improvementApi.count(),
  });
}

export function useQualityImprovementSummary(patientId?: number) {
  return useQuery({
    queryKey: quality_improvementKeys.summary(patientId),
    queryFn: () => quality_improvementApi.summary(patientId),
  });
}

export function useCreateQualityImprovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: QualityImprovementCreateInput) => quality_improvementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: quality_improvementKeys.all }),
  });
}

export function useUpdateQualityImprovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: QualityImprovementUpdateInput }) => quality_improvementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: quality_improvementKeys.all });
      qc.invalidateQueries({ queryKey: quality_improvementKeys.detail(id) });
    },
  });
}

export function useDeleteQualityImprovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => quality_improvementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: quality_improvementKeys.all }),
  });
}

export function useActivateQualityImprovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => quality_improvementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: quality_improvementKeys.all });
      qc.invalidateQueries({ queryKey: quality_improvementKeys.detail(id) });
    },
  });
}

export function useDeactivateQualityImprovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => quality_improvementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: quality_improvementKeys.all });
      qc.invalidateQueries({ queryKey: quality_improvementKeys.detail(id) });
    },
  });
}

export function useCompleteQualityImprovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => quality_improvementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: quality_improvementKeys.all });
      qc.invalidateQueries({ queryKey: quality_improvementKeys.detail(id) });
    },
  });
}

export function useCancelQualityImprovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => quality_improvementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: quality_improvementKeys.all });
      qc.invalidateQueries({ queryKey: quality_improvementKeys.detail(id) });
    },
  });
}
