import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { onboardingApi } from './api';
import type { OnboardingCreateInput, OnboardingListParams, OnboardingUpdateInput } from './types';

export const onboardingKeys = {
  all: ['onboarding'] as const,
  list: (params: OnboardingListParams) => ['onboarding', 'list', params] as const,
  detail: (id: number) => ['onboarding', 'detail', id] as const,
  summary: (patientId?: number) => ['onboarding', 'summary', patientId] as const,
};

export function useOnboardingList(params: OnboardingListParams = {}) {
  return useQuery({
    queryKey: onboardingKeys.list(params),
    queryFn: () => onboardingApi.list(params),
  });
}

export function useOnboardingAll(patientId?: number) {
  return useQuery({
    queryKey: [...onboardingKeys.all, 'all', patientId],
    queryFn: () => onboardingApi.getAll(patientId),
  });
}

export function useOnboarding(id: number) {
  return useQuery({
    queryKey: onboardingKeys.detail(id),
    queryFn: () => onboardingApi.get(id),
    enabled: !!id,
  });
}

export function useOnboardingCount() {
  return useQuery({
    queryKey: [...onboardingKeys.all, 'count'],
    queryFn: () => onboardingApi.count(),
  });
}

export function useOnboardingSummary(patientId?: number) {
  return useQuery({
    queryKey: onboardingKeys.summary(patientId),
    queryFn: () => onboardingApi.summary(patientId),
  });
}

export function useCreateOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OnboardingCreateInput) => onboardingApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: onboardingKeys.all }),
  });
}

export function useUpdateOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: OnboardingUpdateInput }) => onboardingApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: onboardingKeys.all });
      qc.invalidateQueries({ queryKey: onboardingKeys.detail(id) });
    },
  });
}

export function useDeleteOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => onboardingApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: onboardingKeys.all }),
  });
}

export function useActivateOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => onboardingApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: onboardingKeys.all });
      qc.invalidateQueries({ queryKey: onboardingKeys.detail(id) });
    },
  });
}

export function useDeactivateOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => onboardingApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: onboardingKeys.all });
      qc.invalidateQueries({ queryKey: onboardingKeys.detail(id) });
    },
  });
}

export function useCompleteOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => onboardingApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: onboardingKeys.all });
      qc.invalidateQueries({ queryKey: onboardingKeys.detail(id) });
    },
  });
}

export function useCancelOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => onboardingApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: onboardingKeys.all });
      qc.invalidateQueries({ queryKey: onboardingKeys.detail(id) });
    },
  });
}
