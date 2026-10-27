import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patient_satisfactionApi } from './api';
import type { PatientSatisfactionCreateInput, PatientSatisfactionListParams, PatientSatisfactionUpdateInput } from './types';

export const patient_satisfactionKeys = {
  all: ['patient_satisfaction'] as const,
  list: (params: PatientSatisfactionListParams) => ['patient_satisfaction', 'list', params] as const,
  detail: (id: number) => ['patient_satisfaction', 'detail', id] as const,
  summary: (patientId?: number) => ['patient_satisfaction', 'summary', patientId] as const,
};

export function usePatientSatisfactionList(params: PatientSatisfactionListParams = {}) {
  return useQuery({
    queryKey: patient_satisfactionKeys.list(params),
    queryFn: () => patient_satisfactionApi.list(params),
  });
}

export function usePatientSatisfactionAll(patientId?: number) {
  return useQuery({
    queryKey: [...patient_satisfactionKeys.all, 'all', patientId],
    queryFn: () => patient_satisfactionApi.getAll(patientId),
  });
}

export function usePatientSatisfaction(id: number) {
  return useQuery({
    queryKey: patient_satisfactionKeys.detail(id),
    queryFn: () => patient_satisfactionApi.get(id),
    enabled: !!id,
  });
}

export function usePatientSatisfactionCount() {
  return useQuery({
    queryKey: [...patient_satisfactionKeys.all, 'count'],
    queryFn: () => patient_satisfactionApi.count(),
  });
}

export function usePatientSatisfactionSummary(patientId?: number) {
  return useQuery({
    queryKey: patient_satisfactionKeys.summary(patientId),
    queryFn: () => patient_satisfactionApi.summary(patientId),
  });
}

export function useCreatePatientSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PatientSatisfactionCreateInput) => patient_satisfactionApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: patient_satisfactionKeys.all }),
  });
}

export function useUpdatePatientSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatientSatisfactionUpdateInput }) => patient_satisfactionApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.detail(id) });
    },
  });
}

export function useDeletePatientSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patient_satisfactionApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: patient_satisfactionKeys.all }),
  });
}

export function useActivatePatientSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patient_satisfactionApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.detail(id) });
    },
  });
}

export function useDeactivatePatientSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patient_satisfactionApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.detail(id) });
    },
  });
}

export function useCompletePatientSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => patient_satisfactionApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.detail(id) });
    },
  });
}

export function useCancelPatientSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => patient_satisfactionApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: patient_satisfactionKeys.detail(id) });
    },
  });
}
