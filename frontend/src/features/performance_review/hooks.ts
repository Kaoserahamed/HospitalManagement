import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { performance_reviewApi } from './api';
import type { PerformanceReviewCreateInput, PerformanceReviewListParams, PerformanceReviewUpdateInput } from './types';

export const performance_reviewKeys = {
  all: ['performance_review'] as const,
  list: (params: PerformanceReviewListParams) => ['performance_review', 'list', params] as const,
  detail: (id: number) => ['performance_review', 'detail', id] as const,
  summary: (patientId?: number) => ['performance_review', 'summary', patientId] as const,
};

export function usePerformanceReviewList(params: PerformanceReviewListParams = {}) {
  return useQuery({
    queryKey: performance_reviewKeys.list(params),
    queryFn: () => performance_reviewApi.list(params),
  });
}

export function usePerformanceReviewAll(patientId?: number) {
  return useQuery({
    queryKey: [...performance_reviewKeys.all, 'all', patientId],
    queryFn: () => performance_reviewApi.getAll(patientId),
  });
}

export function usePerformanceReview(id: number) {
  return useQuery({
    queryKey: performance_reviewKeys.detail(id),
    queryFn: () => performance_reviewApi.get(id),
    enabled: !!id,
  });
}

export function usePerformanceReviewCount() {
  return useQuery({
    queryKey: [...performance_reviewKeys.all, 'count'],
    queryFn: () => performance_reviewApi.count(),
  });
}

export function usePerformanceReviewSummary(patientId?: number) {
  return useQuery({
    queryKey: performance_reviewKeys.summary(patientId),
    queryFn: () => performance_reviewApi.summary(patientId),
  });
}

export function useCreatePerformanceReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PerformanceReviewCreateInput) => performance_reviewApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: performance_reviewKeys.all }),
  });
}

export function useUpdatePerformanceReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PerformanceReviewUpdateInput }) => performance_reviewApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: performance_reviewKeys.all });
      qc.invalidateQueries({ queryKey: performance_reviewKeys.detail(id) });
    },
  });
}

export function useDeletePerformanceReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => performance_reviewApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: performance_reviewKeys.all }),
  });
}

export function useActivatePerformanceReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => performance_reviewApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: performance_reviewKeys.all });
      qc.invalidateQueries({ queryKey: performance_reviewKeys.detail(id) });
    },
  });
}

export function useDeactivatePerformanceReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => performance_reviewApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: performance_reviewKeys.all });
      qc.invalidateQueries({ queryKey: performance_reviewKeys.detail(id) });
    },
  });
}

export function useCompletePerformanceReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => performance_reviewApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: performance_reviewKeys.all });
      qc.invalidateQueries({ queryKey: performance_reviewKeys.detail(id) });
    },
  });
}

export function useCancelPerformanceReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => performance_reviewApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: performance_reviewKeys.all });
      qc.invalidateQueries({ queryKey: performance_reviewKeys.detail(id) });
    },
  });
}
