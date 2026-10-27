import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staff_satisfactionApi } from './api';
import type { StaffSatisfactionCreateInput, StaffSatisfactionListParams, StaffSatisfactionUpdateInput } from './types';

export const staff_satisfactionKeys = {
  all: ['staff_satisfaction'] as const,
  list: (params: StaffSatisfactionListParams) => ['staff_satisfaction', 'list', params] as const,
  detail: (id: number) => ['staff_satisfaction', 'detail', id] as const,
  summary: (patientId?: number) => ['staff_satisfaction', 'summary', patientId] as const,
};

export function useStaffSatisfactionList(params: StaffSatisfactionListParams = {}) {
  return useQuery({
    queryKey: staff_satisfactionKeys.list(params),
    queryFn: () => staff_satisfactionApi.list(params),
  });
}

export function useStaffSatisfactionAll(patientId?: number) {
  return useQuery({
    queryKey: [...staff_satisfactionKeys.all, 'all', patientId],
    queryFn: () => staff_satisfactionApi.getAll(patientId),
  });
}

export function useStaffSatisfaction(id: number) {
  return useQuery({
    queryKey: staff_satisfactionKeys.detail(id),
    queryFn: () => staff_satisfactionApi.get(id),
    enabled: !!id,
  });
}

export function useStaffSatisfactionCount() {
  return useQuery({
    queryKey: [...staff_satisfactionKeys.all, 'count'],
    queryFn: () => staff_satisfactionApi.count(),
  });
}

export function useStaffSatisfactionSummary(patientId?: number) {
  return useQuery({
    queryKey: staff_satisfactionKeys.summary(patientId),
    queryFn: () => staff_satisfactionApi.summary(patientId),
  });
}

export function useCreateStaffSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: StaffSatisfactionCreateInput) => staff_satisfactionApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: staff_satisfactionKeys.all }),
  });
}

export function useUpdateStaffSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: StaffSatisfactionUpdateInput }) => staff_satisfactionApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.detail(id) });
    },
  });
}

export function useDeleteStaffSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => staff_satisfactionApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: staff_satisfactionKeys.all }),
  });
}

export function useActivateStaffSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => staff_satisfactionApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.detail(id) });
    },
  });
}

export function useDeactivateStaffSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => staff_satisfactionApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.detail(id) });
    },
  });
}

export function useCompleteStaffSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => staff_satisfactionApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.detail(id) });
    },
  });
}

export function useCancelStaffSatisfaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => staff_satisfactionApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.all });
      qc.invalidateQueries({ queryKey: staff_satisfactionKeys.detail(id) });
    },
  });
}
