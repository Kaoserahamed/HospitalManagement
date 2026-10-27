import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { quality_measureApi } from './api';
import type { QualityMeasureCreateInput, QualityMeasureListParams, QualityMeasureUpdateInput } from './types';

export const quality_measureKeys = {
  all: ['quality_measure'] as const,
  list: (params: QualityMeasureListParams) => ['quality_measure', 'list', params] as const,
  detail: (id: number) => ['quality_measure', 'detail', id] as const,
  summary: (patientId?: number) => ['quality_measure', 'summary', patientId] as const,
};

export function useQualityMeasureList(params: QualityMeasureListParams = {}) {
  return useQuery({
    queryKey: quality_measureKeys.list(params),
    queryFn: () => quality_measureApi.list(params),
  });
}

export function useQualityMeasureAll(patientId?: number) {
  return useQuery({
    queryKey: [...quality_measureKeys.all, 'all', patientId],
    queryFn: () => quality_measureApi.getAll(patientId),
  });
}

export function useQualityMeasure(id: number) {
  return useQuery({
    queryKey: quality_measureKeys.detail(id),
    queryFn: () => quality_measureApi.get(id),
    enabled: !!id,
  });
}

export function useQualityMeasureCount() {
  return useQuery({
    queryKey: [...quality_measureKeys.all, 'count'],
    queryFn: () => quality_measureApi.count(),
  });
}

export function useQualityMeasureSummary(patientId?: number) {
  return useQuery({
    queryKey: quality_measureKeys.summary(patientId),
    queryFn: () => quality_measureApi.summary(patientId),
  });
}

export function useCreateQualityMeasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: QualityMeasureCreateInput) => quality_measureApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: quality_measureKeys.all }),
  });
}

export function useUpdateQualityMeasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: QualityMeasureUpdateInput }) => quality_measureApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: quality_measureKeys.all });
      qc.invalidateQueries({ queryKey: quality_measureKeys.detail(id) });
    },
  });
}

export function useDeleteQualityMeasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => quality_measureApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: quality_measureKeys.all }),
  });
}

export function useActivateQualityMeasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => quality_measureApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: quality_measureKeys.all });
      qc.invalidateQueries({ queryKey: quality_measureKeys.detail(id) });
    },
  });
}

export function useDeactivateQualityMeasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => quality_measureApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: quality_measureKeys.all });
      qc.invalidateQueries({ queryKey: quality_measureKeys.detail(id) });
    },
  });
}

export function useCompleteQualityMeasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => quality_measureApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: quality_measureKeys.all });
      qc.invalidateQueries({ queryKey: quality_measureKeys.detail(id) });
    },
  });
}

export function useCancelQualityMeasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => quality_measureApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: quality_measureKeys.all });
      qc.invalidateQueries({ queryKey: quality_measureKeys.detail(id) });
    },
  });
}
