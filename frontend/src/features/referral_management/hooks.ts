import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { referral_managementApi } from './api';
import type { ReferralManagementCreateInput, ReferralManagementListParams, ReferralManagementUpdateInput } from './types';

export const referral_managementKeys = {
  all: ['referral_management'] as const,
  list: (params: ReferralManagementListParams) => ['referral_management', 'list', params] as const,
  detail: (id: number) => ['referral_management', 'detail', id] as const,
  summary: (patientId?: number) => ['referral_management', 'summary', patientId] as const,
};

export function useReferralManagementList(params: ReferralManagementListParams = {}) {
  return useQuery({
    queryKey: referral_managementKeys.list(params),
    queryFn: () => referral_managementApi.list(params),
  });
}

export function useReferralManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...referral_managementKeys.all, 'all', patientId],
    queryFn: () => referral_managementApi.getAll(patientId),
  });
}

export function useReferralManagement(id: number) {
  return useQuery({
    queryKey: referral_managementKeys.detail(id),
    queryFn: () => referral_managementApi.get(id),
    enabled: !!id,
  });
}

export function useReferralManagementCount() {
  return useQuery({
    queryKey: [...referral_managementKeys.all, 'count'],
    queryFn: () => referral_managementApi.count(),
  });
}

export function useReferralManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: referral_managementKeys.summary(patientId),
    queryFn: () => referral_managementApi.summary(patientId),
  });
}

export function useCreateReferralManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReferralManagementCreateInput) => referral_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: referral_managementKeys.all }),
  });
}

export function useUpdateReferralManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ReferralManagementUpdateInput }) => referral_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: referral_managementKeys.all });
      qc.invalidateQueries({ queryKey: referral_managementKeys.detail(id) });
    },
  });
}

export function useDeleteReferralManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => referral_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: referral_managementKeys.all }),
  });
}

export function useActivateReferralManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => referral_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: referral_managementKeys.all });
      qc.invalidateQueries({ queryKey: referral_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateReferralManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => referral_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: referral_managementKeys.all });
      qc.invalidateQueries({ queryKey: referral_managementKeys.detail(id) });
    },
  });
}

export function useCompleteReferralManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => referral_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: referral_managementKeys.all });
      qc.invalidateQueries({ queryKey: referral_managementKeys.detail(id) });
    },
  });
}

export function useCancelReferralManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => referral_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: referral_managementKeys.all });
      qc.invalidateQueries({ queryKey: referral_managementKeys.detail(id) });
    },
  });
}
