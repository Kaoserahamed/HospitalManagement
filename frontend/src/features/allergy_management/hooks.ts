import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { allergy_managementApi } from './api';
import type { AllergyManagementCreateInput, AllergyManagementListParams, AllergyManagementUpdateInput } from './types';

export const allergy_managementKeys = {
  all: ['allergy_management'] as const,
  list: (params: AllergyManagementListParams) => ['allergy_management', 'list', params] as const,
  detail: (id: number) => ['allergy_management', 'detail', id] as const,
  summary: (patientId?: number) => ['allergy_management', 'summary', patientId] as const,
};

export function useAllergyManagementList(params: AllergyManagementListParams = {}) {
  return useQuery({
    queryKey: allergy_managementKeys.list(params),
    queryFn: () => allergy_managementApi.list(params),
  });
}

export function useAllergyManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...allergy_managementKeys.all, 'all', patientId],
    queryFn: () => allergy_managementApi.getAll(patientId),
  });
}

export function useAllergyManagement(id: number) {
  return useQuery({
    queryKey: allergy_managementKeys.detail(id),
    queryFn: () => allergy_managementApi.get(id),
    enabled: !!id,
  });
}

export function useAllergyManagementCount() {
  return useQuery({
    queryKey: [...allergy_managementKeys.all, 'count'],
    queryFn: () => allergy_managementApi.count(),
  });
}

export function useAllergyManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: allergy_managementKeys.summary(patientId),
    queryFn: () => allergy_managementApi.summary(patientId),
  });
}

export function useCreateAllergyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AllergyManagementCreateInput) => allergy_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: allergy_managementKeys.all }),
  });
}

export function useUpdateAllergyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AllergyManagementUpdateInput }) => allergy_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: allergy_managementKeys.all });
      qc.invalidateQueries({ queryKey: allergy_managementKeys.detail(id) });
    },
  });
}

export function useDeleteAllergyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => allergy_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: allergy_managementKeys.all }),
  });
}

export function useActivateAllergyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => allergy_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: allergy_managementKeys.all });
      qc.invalidateQueries({ queryKey: allergy_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateAllergyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => allergy_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: allergy_managementKeys.all });
      qc.invalidateQueries({ queryKey: allergy_managementKeys.detail(id) });
    },
  });
}

export function useCompleteAllergyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => allergy_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: allergy_managementKeys.all });
      qc.invalidateQueries({ queryKey: allergy_managementKeys.detail(id) });
    },
  });
}

export function useCancelAllergyManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => allergy_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: allergy_managementKeys.all });
      qc.invalidateQueries({ queryKey: allergy_managementKeys.detail(id) });
    },
  });
}
