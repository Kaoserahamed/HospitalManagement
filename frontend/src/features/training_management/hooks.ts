import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { training_managementApi } from './api';
import type { TrainingManagementCreateInput, TrainingManagementListParams, TrainingManagementUpdateInput } from './types';

export const training_managementKeys = {
  all: ['training_management'] as const,
  list: (params: TrainingManagementListParams) => ['training_management', 'list', params] as const,
  detail: (id: number) => ['training_management', 'detail', id] as const,
  summary: (patientId?: number) => ['training_management', 'summary', patientId] as const,
};

export function useTrainingManagementList(params: TrainingManagementListParams = {}) {
  return useQuery({
    queryKey: training_managementKeys.list(params),
    queryFn: () => training_managementApi.list(params),
  });
}

export function useTrainingManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...training_managementKeys.all, 'all', patientId],
    queryFn: () => training_managementApi.getAll(patientId),
  });
}

export function useTrainingManagement(id: number) {
  return useQuery({
    queryKey: training_managementKeys.detail(id),
    queryFn: () => training_managementApi.get(id),
    enabled: !!id,
  });
}

export function useTrainingManagementCount() {
  return useQuery({
    queryKey: [...training_managementKeys.all, 'count'],
    queryFn: () => training_managementApi.count(),
  });
}

export function useTrainingManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: training_managementKeys.summary(patientId),
    queryFn: () => training_managementApi.summary(patientId),
  });
}

export function useCreateTrainingManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TrainingManagementCreateInput) => training_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: training_managementKeys.all }),
  });
}

export function useUpdateTrainingManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TrainingManagementUpdateInput }) => training_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: training_managementKeys.all });
      qc.invalidateQueries({ queryKey: training_managementKeys.detail(id) });
    },
  });
}

export function useDeleteTrainingManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => training_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: training_managementKeys.all }),
  });
}

export function useActivateTrainingManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => training_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: training_managementKeys.all });
      qc.invalidateQueries({ queryKey: training_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateTrainingManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => training_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: training_managementKeys.all });
      qc.invalidateQueries({ queryKey: training_managementKeys.detail(id) });
    },
  });
}

export function useCompleteTrainingManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => training_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: training_managementKeys.all });
      qc.invalidateQueries({ queryKey: training_managementKeys.detail(id) });
    },
  });
}

export function useCancelTrainingManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => training_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: training_managementKeys.all });
      qc.invalidateQueries({ queryKey: training_managementKeys.detail(id) });
    },
  });
}
