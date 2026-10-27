import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { risk_assessmentApi } from './api';
import type { RiskAssessmentCreateInput, RiskAssessmentListParams, RiskAssessmentUpdateInput } from './types';

export const risk_assessmentKeys = {
  all: ['risk_assessment'] as const,
  list: (params: RiskAssessmentListParams) => ['risk_assessment', 'list', params] as const,
  detail: (id: number) => ['risk_assessment', 'detail', id] as const,
  summary: (patientId?: number) => ['risk_assessment', 'summary', patientId] as const,
};

export function useRiskAssessmentList(params: RiskAssessmentListParams = {}) {
  return useQuery({
    queryKey: risk_assessmentKeys.list(params),
    queryFn: () => risk_assessmentApi.list(params),
  });
}

export function useRiskAssessmentAll(patientId?: number) {
  return useQuery({
    queryKey: [...risk_assessmentKeys.all, 'all', patientId],
    queryFn: () => risk_assessmentApi.getAll(patientId),
  });
}

export function useRiskAssessment(id: number) {
  return useQuery({
    queryKey: risk_assessmentKeys.detail(id),
    queryFn: () => risk_assessmentApi.get(id),
    enabled: !!id,
  });
}

export function useRiskAssessmentCount() {
  return useQuery({
    queryKey: [...risk_assessmentKeys.all, 'count'],
    queryFn: () => risk_assessmentApi.count(),
  });
}

export function useRiskAssessmentSummary(patientId?: number) {
  return useQuery({
    queryKey: risk_assessmentKeys.summary(patientId),
    queryFn: () => risk_assessmentApi.summary(patientId),
  });
}

export function useCreateRiskAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RiskAssessmentCreateInput) => risk_assessmentApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: risk_assessmentKeys.all }),
  });
}

export function useUpdateRiskAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RiskAssessmentUpdateInput }) => risk_assessmentApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.all });
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.detail(id) });
    },
  });
}

export function useDeleteRiskAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => risk_assessmentApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: risk_assessmentKeys.all }),
  });
}

export function useActivateRiskAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => risk_assessmentApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.all });
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.detail(id) });
    },
  });
}

export function useDeactivateRiskAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => risk_assessmentApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.all });
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.detail(id) });
    },
  });
}

export function useCompleteRiskAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => risk_assessmentApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.all });
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.detail(id) });
    },
  });
}

export function useCancelRiskAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => risk_assessmentApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.all });
      qc.invalidateQueries({ queryKey: risk_assessmentKeys.detail(id) });
    },
  });
}
