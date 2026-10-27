import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { credentialingApi } from './api';
import type { CredentialingCreateInput, CredentialingListParams, CredentialingUpdateInput } from './types';

export const credentialingKeys = {
  all: ['credentialing'] as const,
  list: (params: CredentialingListParams) => ['credentialing', 'list', params] as const,
  detail: (id: number) => ['credentialing', 'detail', id] as const,
  summary: (patientId?: number) => ['credentialing', 'summary', patientId] as const,
};

export function useCredentialingList(params: CredentialingListParams = {}) {
  return useQuery({
    queryKey: credentialingKeys.list(params),
    queryFn: () => credentialingApi.list(params),
  });
}

export function useCredentialingAll(patientId?: number) {
  return useQuery({
    queryKey: [...credentialingKeys.all, 'all', patientId],
    queryFn: () => credentialingApi.getAll(patientId),
  });
}

export function useCredentialing(id: number) {
  return useQuery({
    queryKey: credentialingKeys.detail(id),
    queryFn: () => credentialingApi.get(id),
    enabled: !!id,
  });
}

export function useCredentialingCount() {
  return useQuery({
    queryKey: [...credentialingKeys.all, 'count'],
    queryFn: () => credentialingApi.count(),
  });
}

export function useCredentialingSummary(patientId?: number) {
  return useQuery({
    queryKey: credentialingKeys.summary(patientId),
    queryFn: () => credentialingApi.summary(patientId),
  });
}

export function useCreateCredentialing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CredentialingCreateInput) => credentialingApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: credentialingKeys.all }),
  });
}

export function useUpdateCredentialing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CredentialingUpdateInput }) => credentialingApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: credentialingKeys.all });
      qc.invalidateQueries({ queryKey: credentialingKeys.detail(id) });
    },
  });
}

export function useDeleteCredentialing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => credentialingApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: credentialingKeys.all }),
  });
}

export function useActivateCredentialing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => credentialingApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: credentialingKeys.all });
      qc.invalidateQueries({ queryKey: credentialingKeys.detail(id) });
    },
  });
}

export function useDeactivateCredentialing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => credentialingApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: credentialingKeys.all });
      qc.invalidateQueries({ queryKey: credentialingKeys.detail(id) });
    },
  });
}

export function useCompleteCredentialing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => credentialingApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: credentialingKeys.all });
      qc.invalidateQueries({ queryKey: credentialingKeys.detail(id) });
    },
  });
}

export function useCancelCredentialing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => credentialingApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: credentialingKeys.all });
      qc.invalidateQueries({ queryKey: credentialingKeys.detail(id) });
    },
  });
}
