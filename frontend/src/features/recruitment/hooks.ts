import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recruitmentApi } from './api';
import type { RecruitmentCreateInput, RecruitmentListParams, RecruitmentUpdateInput } from './types';

export const recruitmentKeys = {
  all: ['recruitment'] as const,
  list: (params: RecruitmentListParams) => ['recruitment', 'list', params] as const,
  detail: (id: number) => ['recruitment', 'detail', id] as const,
  summary: (patientId?: number) => ['recruitment', 'summary', patientId] as const,
};

export function useRecruitmentList(params: RecruitmentListParams = {}) {
  return useQuery({
    queryKey: recruitmentKeys.list(params),
    queryFn: () => recruitmentApi.list(params),
  });
}

export function useRecruitmentAll(patientId?: number) {
  return useQuery({
    queryKey: [...recruitmentKeys.all, 'all', patientId],
    queryFn: () => recruitmentApi.getAll(patientId),
  });
}

export function useRecruitment(id: number) {
  return useQuery({
    queryKey: recruitmentKeys.detail(id),
    queryFn: () => recruitmentApi.get(id),
    enabled: !!id,
  });
}

export function useRecruitmentCount() {
  return useQuery({
    queryKey: [...recruitmentKeys.all, 'count'],
    queryFn: () => recruitmentApi.count(),
  });
}

export function useRecruitmentSummary(patientId?: number) {
  return useQuery({
    queryKey: recruitmentKeys.summary(patientId),
    queryFn: () => recruitmentApi.summary(patientId),
  });
}

export function useCreateRecruitment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecruitmentCreateInput) => recruitmentApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: recruitmentKeys.all }),
  });
}

export function useUpdateRecruitment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RecruitmentUpdateInput }) => recruitmentApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: recruitmentKeys.all });
      qc.invalidateQueries({ queryKey: recruitmentKeys.detail(id) });
    },
  });
}

export function useDeleteRecruitment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => recruitmentApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: recruitmentKeys.all }),
  });
}

export function useActivateRecruitment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => recruitmentApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: recruitmentKeys.all });
      qc.invalidateQueries({ queryKey: recruitmentKeys.detail(id) });
    },
  });
}

export function useDeactivateRecruitment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => recruitmentApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: recruitmentKeys.all });
      qc.invalidateQueries({ queryKey: recruitmentKeys.detail(id) });
    },
  });
}

export function useCompleteRecruitment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => recruitmentApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: recruitmentKeys.all });
      qc.invalidateQueries({ queryKey: recruitmentKeys.detail(id) });
    },
  });
}

export function useCancelRecruitment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => recruitmentApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: recruitmentKeys.all });
      qc.invalidateQueries({ queryKey: recruitmentKeys.detail(id) });
    },
  });
}
