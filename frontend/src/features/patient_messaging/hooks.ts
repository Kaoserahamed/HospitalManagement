import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patient_messagingApi } from './api';
import type { PatientMessagingCreateInput, PatientMessagingListParams, PatientMessagingUpdateInput } from './types';

export const patient_messagingKeys = {
  all: ['patient_messaging'] as const,
  list: (params: PatientMessagingListParams) => ['patient_messaging', 'list', params] as const,
  detail: (id: number) => ['patient_messaging', 'detail', id] as const,
  summary: (patientId?: number) => ['patient_messaging', 'summary', patientId] as const,
};

export function usePatientMessagingList(params: PatientMessagingListParams = {}) {
  return useQuery({
    queryKey: patient_messagingKeys.list(params),
    queryFn: () => patient_messagingApi.list(params),
  });
}

export function usePatientMessagingAll(patientId?: number) {
  return useQuery({
    queryKey: [...patient_messagingKeys.all, 'all', patientId],
    queryFn: () => patient_messagingApi.getAll(patientId),
  });
}

export function usePatientMessaging(id: number) {
  return useQuery({
    queryKey: patient_messagingKeys.detail(id),
    queryFn: () => patient_messagingApi.get(id),
    enabled: !!id,
  });
}

export function usePatientMessagingCount() {
  return useQuery({
    queryKey: [...patient_messagingKeys.all, 'count'],
    queryFn: () => patient_messagingApi.count(),
  });
}

export function usePatientMessagingSummary(patientId?: number) {
  return useQuery({
    queryKey: patient_messagingKeys.summary(patientId),
    queryFn: () => patient_messagingApi.summary(patientId),
  });
}

export function useCreatePatientMessaging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PatientMessagingCreateInput) => patient_messagingApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: patient_messagingKeys.all }),
  });
}

export function useUpdatePatientMessaging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatientMessagingUpdateInput }) => patient_messagingApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patient_messagingKeys.all });
      qc.invalidateQueries({ queryKey: patient_messagingKeys.detail(id) });
    },
  });
}

export function useDeletePatientMessaging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patient_messagingApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: patient_messagingKeys.all }),
  });
}

export function useActivatePatientMessaging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patient_messagingApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: patient_messagingKeys.all });
      qc.invalidateQueries({ queryKey: patient_messagingKeys.detail(id) });
    },
  });
}

export function useDeactivatePatientMessaging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patient_messagingApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: patient_messagingKeys.all });
      qc.invalidateQueries({ queryKey: patient_messagingKeys.detail(id) });
    },
  });
}

export function useCompletePatientMessaging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => patient_messagingApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patient_messagingKeys.all });
      qc.invalidateQueries({ queryKey: patient_messagingKeys.detail(id) });
    },
  });
}

export function useCancelPatientMessaging() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => patient_messagingApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patient_messagingKeys.all });
      qc.invalidateQueries({ queryKey: patient_messagingKeys.detail(id) });
    },
  });
}
