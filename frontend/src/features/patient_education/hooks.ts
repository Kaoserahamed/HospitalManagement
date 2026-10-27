import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patient_educationApi } from './api';
import type { PatientEducationCreateInput, PatientEducationListParams, PatientEducationUpdateInput } from './types';

export const patient_educationKeys = {
  all: ['patient_education'] as const,
  list: (params: PatientEducationListParams) => ['patient_education', 'list', params] as const,
  detail: (id: number) => ['patient_education', 'detail', id] as const,
  summary: (patientId?: number) => ['patient_education', 'summary', patientId] as const,
};

export function usePatientEducationList(params: PatientEducationListParams = {}) {
  return useQuery({
    queryKey: patient_educationKeys.list(params),
    queryFn: () => patient_educationApi.list(params),
  });
}

export function usePatientEducationAll(patientId?: number) {
  return useQuery({
    queryKey: [...patient_educationKeys.all, 'all', patientId],
    queryFn: () => patient_educationApi.getAll(patientId),
  });
}

export function usePatientEducation(id: number) {
  return useQuery({
    queryKey: patient_educationKeys.detail(id),
    queryFn: () => patient_educationApi.get(id),
    enabled: !!id,
  });
}

export function usePatientEducationCount() {
  return useQuery({
    queryKey: [...patient_educationKeys.all, 'count'],
    queryFn: () => patient_educationApi.count(),
  });
}

export function usePatientEducationSummary(patientId?: number) {
  return useQuery({
    queryKey: patient_educationKeys.summary(patientId),
    queryFn: () => patient_educationApi.summary(patientId),
  });
}

export function useCreatePatientEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PatientEducationCreateInput) => patient_educationApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: patient_educationKeys.all }),
  });
}

export function useUpdatePatientEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatientEducationUpdateInput }) => patient_educationApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patient_educationKeys.all });
      qc.invalidateQueries({ queryKey: patient_educationKeys.detail(id) });
    },
  });
}

export function useDeletePatientEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patient_educationApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: patient_educationKeys.all }),
  });
}

export function useActivatePatientEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patient_educationApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: patient_educationKeys.all });
      qc.invalidateQueries({ queryKey: patient_educationKeys.detail(id) });
    },
  });
}

export function useDeactivatePatientEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patient_educationApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: patient_educationKeys.all });
      qc.invalidateQueries({ queryKey: patient_educationKeys.detail(id) });
    },
  });
}

export function useCompletePatientEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => patient_educationApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patient_educationKeys.all });
      qc.invalidateQueries({ queryKey: patient_educationKeys.detail(id) });
    },
  });
}

export function useCancelPatientEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => patient_educationApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patient_educationKeys.all });
      qc.invalidateQueries({ queryKey: patient_educationKeys.detail(id) });
    },
  });
}
