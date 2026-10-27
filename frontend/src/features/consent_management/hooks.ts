import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { consent_managementApi } from './api';
import type { ConsentManagementCreateInput, ConsentManagementListParams, ConsentManagementUpdateInput } from './types';

export const consent_managementKeys = {
  all: ['consent_management'] as const,
  list: (params: ConsentManagementListParams) => ['consent_management', 'list', params] as const,
  detail: (id: number) => ['consent_management', 'detail', id] as const,
  summary: (patientId?: number) => ['consent_management', 'summary', patientId] as const,
};

export function useConsentManagementList(params: ConsentManagementListParams = {}) {
  return useQuery({
    queryKey: consent_managementKeys.list(params),
    queryFn: () => consent_managementApi.list(params),
  });
}

export function useConsentManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...consent_managementKeys.all, 'all', patientId],
    queryFn: () => consent_managementApi.getAll(patientId),
  });
}

export function useConsentManagement(id: number) {
  return useQuery({
    queryKey: consent_managementKeys.detail(id),
    queryFn: () => consent_managementApi.get(id),
    enabled: !!id,
  });
}

export function useConsentManagementCount() {
  return useQuery({
    queryKey: [...consent_managementKeys.all, 'count'],
    queryFn: () => consent_managementApi.count(),
  });
}

export function useConsentManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: consent_managementKeys.summary(patientId),
    queryFn: () => consent_managementApi.summary(patientId),
  });
}

export function useCreateConsentManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConsentManagementCreateInput) => consent_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: consent_managementKeys.all }),
  });
}

export function useUpdateConsentManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ConsentManagementUpdateInput }) => consent_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: consent_managementKeys.all });
      qc.invalidateQueries({ queryKey: consent_managementKeys.detail(id) });
    },
  });
}

export function useDeleteConsentManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => consent_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: consent_managementKeys.all }),
  });
}

export function useActivateConsentManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => consent_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: consent_managementKeys.all });
      qc.invalidateQueries({ queryKey: consent_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateConsentManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => consent_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: consent_managementKeys.all });
      qc.invalidateQueries({ queryKey: consent_managementKeys.detail(id) });
    },
  });
}

export function useCompleteConsentManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => consent_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: consent_managementKeys.all });
      qc.invalidateQueries({ queryKey: consent_managementKeys.detail(id) });
    },
  });
}

export function useCancelConsentManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => consent_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: consent_managementKeys.all });
      qc.invalidateQueries({ queryKey: consent_managementKeys.detail(id) });
    },
  });
}
