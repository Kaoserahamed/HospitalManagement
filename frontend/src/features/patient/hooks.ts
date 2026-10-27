import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patientApi } from './api';
import type { PatientCreateInput, PatientListParams, PatientUpdateInput } from './types';

export const patientKeys = {
  all: ['patients'] as const,
  list: (params: PatientListParams) => ['patients', 'list', params] as const,
  detail: (id: number) => ['patients', 'detail', id] as const,
};

export function usePatients(params: PatientListParams = {}) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientApi.list(params),
  });
}

export function usePatient(id: number) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientApi.get(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PatientCreateInput) => patientApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: patientKeys.all }),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatientUpdateInput }) => patientApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: patientKeys.all });
      qc.invalidateQueries({ queryKey: patientKeys.detail(id) });
    },
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patientApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: patientKeys.all }),
  });
}
