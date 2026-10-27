import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employee_healthApi } from './api';
import type { EmployeeHealthCreateInput, EmployeeHealthListParams, EmployeeHealthUpdateInput } from './types';

export const employee_healthKeys = {
  all: ['employee_health'] as const,
  list: (params: EmployeeHealthListParams) => ['employee_health', 'list', params] as const,
  detail: (id: number) => ['employee_health', 'detail', id] as const,
  summary: (patientId?: number) => ['employee_health', 'summary', patientId] as const,
};

export function useEmployeeHealthList(params: EmployeeHealthListParams = {}) {
  return useQuery({
    queryKey: employee_healthKeys.list(params),
    queryFn: () => employee_healthApi.list(params),
  });
}

export function useEmployeeHealthAll(patientId?: number) {
  return useQuery({
    queryKey: [...employee_healthKeys.all, 'all', patientId],
    queryFn: () => employee_healthApi.getAll(patientId),
  });
}

export function useEmployeeHealth(id: number) {
  return useQuery({
    queryKey: employee_healthKeys.detail(id),
    queryFn: () => employee_healthApi.get(id),
    enabled: !!id,
  });
}

export function useEmployeeHealthCount() {
  return useQuery({
    queryKey: [...employee_healthKeys.all, 'count'],
    queryFn: () => employee_healthApi.count(),
  });
}

export function useEmployeeHealthSummary(patientId?: number) {
  return useQuery({
    queryKey: employee_healthKeys.summary(patientId),
    queryFn: () => employee_healthApi.summary(patientId),
  });
}

export function useCreateEmployeeHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeeHealthCreateInput) => employee_healthApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: employee_healthKeys.all }),
  });
}

export function useUpdateEmployeeHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EmployeeHealthUpdateInput }) => employee_healthApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: employee_healthKeys.all });
      qc.invalidateQueries({ queryKey: employee_healthKeys.detail(id) });
    },
  });
}

export function useDeleteEmployeeHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employee_healthApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: employee_healthKeys.all }),
  });
}

export function useActivateEmployeeHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employee_healthApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: employee_healthKeys.all });
      qc.invalidateQueries({ queryKey: employee_healthKeys.detail(id) });
    },
  });
}

export function useDeactivateEmployeeHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employee_healthApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: employee_healthKeys.all });
      qc.invalidateQueries({ queryKey: employee_healthKeys.detail(id) });
    },
  });
}

export function useCompleteEmployeeHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => employee_healthApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: employee_healthKeys.all });
      qc.invalidateQueries({ queryKey: employee_healthKeys.detail(id) });
    },
  });
}

export function useCancelEmployeeHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => employee_healthApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: employee_healthKeys.all });
      qc.invalidateQueries({ queryKey: employee_healthKeys.detail(id) });
    },
  });
}
