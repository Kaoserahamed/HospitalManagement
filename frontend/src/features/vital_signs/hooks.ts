import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vital_signsApi } from './api';
import type { VitalSignsCreateInput, VitalSignsListParams, VitalSignsUpdateInput } from './types';

export const vital_signsKeys = {
  all: ['vital_signs'] as const,
  list: (params: VitalSignsListParams) => ['vital_signs', 'list', params] as const,
  detail: (id: number) => ['vital_signs', 'detail', id] as const,
  summary: (patientId?: number) => ['vital_signs', 'summary', patientId] as const,
};

export function useVitalSignsList(params: VitalSignsListParams = {}) {
  return useQuery({
    queryKey: vital_signsKeys.list(params),
    queryFn: () => vital_signsApi.list(params),
  });
}

export function useVitalSignsAll(patientId?: number) {
  return useQuery({
    queryKey: [...vital_signsKeys.all, 'all', patientId],
    queryFn: () => vital_signsApi.getAll(patientId),
  });
}

export function useVitalSigns(id: number) {
  return useQuery({
    queryKey: vital_signsKeys.detail(id),
    queryFn: () => vital_signsApi.get(id),
    enabled: !!id,
  });
}

export function useVitalSignsCount() {
  return useQuery({
    queryKey: [...vital_signsKeys.all, 'count'],
    queryFn: () => vital_signsApi.count(),
  });
}

export function useVitalSignsSummary(patientId?: number) {
  return useQuery({
    queryKey: vital_signsKeys.summary(patientId),
    queryFn: () => vital_signsApi.summary(patientId),
  });
}

export function useCreateVitalSigns() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: VitalSignsCreateInput) => vital_signsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: vital_signsKeys.all }),
  });
}

export function useUpdateVitalSigns() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: VitalSignsUpdateInput }) => vital_signsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: vital_signsKeys.all });
      qc.invalidateQueries({ queryKey: vital_signsKeys.detail(id) });
    },
  });
}

export function useDeleteVitalSigns() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vital_signsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: vital_signsKeys.all }),
  });
}

export function useActivateVitalSigns() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vital_signsApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: vital_signsKeys.all });
      qc.invalidateQueries({ queryKey: vital_signsKeys.detail(id) });
    },
  });
}

export function useDeactivateVitalSigns() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vital_signsApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: vital_signsKeys.all });
      qc.invalidateQueries({ queryKey: vital_signsKeys.detail(id) });
    },
  });
}

export function useCompleteVitalSigns() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => vital_signsApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: vital_signsKeys.all });
      qc.invalidateQueries({ queryKey: vital_signsKeys.detail(id) });
    },
  });
}

export function useCancelVitalSigns() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => vital_signsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: vital_signsKeys.all });
      qc.invalidateQueries({ queryKey: vital_signsKeys.detail(id) });
    },
  });
}
