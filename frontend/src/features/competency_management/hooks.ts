import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { competency_managementApi } from './api';
import type { CompetencyManagementCreateInput, CompetencyManagementListParams, CompetencyManagementUpdateInput } from './types';

export const competency_managementKeys = {
  all: ['competency_management'] as const,
  list: (params: CompetencyManagementListParams) => ['competency_management', 'list', params] as const,
  detail: (id: number) => ['competency_management', 'detail', id] as const,
  summary: (patientId?: number) => ['competency_management', 'summary', patientId] as const,
};

export function useCompetencyManagementList(params: CompetencyManagementListParams = {}) {
  return useQuery({
    queryKey: competency_managementKeys.list(params),
    queryFn: () => competency_managementApi.list(params),
  });
}

export function useCompetencyManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...competency_managementKeys.all, 'all', patientId],
    queryFn: () => competency_managementApi.getAll(patientId),
  });
}

export function useCompetencyManagement(id: number) {
  return useQuery({
    queryKey: competency_managementKeys.detail(id),
    queryFn: () => competency_managementApi.get(id),
    enabled: !!id,
  });
}

export function useCompetencyManagementCount() {
  return useQuery({
    queryKey: [...competency_managementKeys.all, 'count'],
    queryFn: () => competency_managementApi.count(),
  });
}

export function useCompetencyManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: competency_managementKeys.summary(patientId),
    queryFn: () => competency_managementApi.summary(patientId),
  });
}

export function useCreateCompetencyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompetencyManagementCreateInput) => competency_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: competency_managementKeys.all }),
  });
}

export function useUpdateCompetencyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CompetencyManagementUpdateInput }) => competency_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: competency_managementKeys.all });
      qc.invalidateQueries({ queryKey: competency_managementKeys.detail(id) });
    },
  });
}

export function useDeleteCompetencyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => competency_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: competency_managementKeys.all }),
  });
}

export function useActivateCompetencyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => competency_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: competency_managementKeys.all });
      qc.invalidateQueries({ queryKey: competency_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateCompetencyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => competency_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: competency_managementKeys.all });
      qc.invalidateQueries({ queryKey: competency_managementKeys.detail(id) });
    },
  });
}

export function useCompleteCompetencyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => competency_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: competency_managementKeys.all });
      qc.invalidateQueries({ queryKey: competency_managementKeys.detail(id) });
    },
  });
}

export function useCancelCompetencyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => competency_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: competency_managementKeys.all });
      qc.invalidateQueries({ queryKey: competency_managementKeys.detail(id) });
    },
  });
}
