import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leave_managementApi } from './api';
import type { LeaveManagementCreateInput, LeaveManagementListParams, LeaveManagementUpdateInput } from './types';

export const leave_managementKeys = {
  all: ['leave_management'] as const,
  list: (params: LeaveManagementListParams) => ['leave_management', 'list', params] as const,
  detail: (id: number) => ['leave_management', 'detail', id] as const,
  summary: (patientId?: number) => ['leave_management', 'summary', patientId] as const,
};

export function useLeaveManagementList(params: LeaveManagementListParams = {}) {
  return useQuery({
    queryKey: leave_managementKeys.list(params),
    queryFn: () => leave_managementApi.list(params),
  });
}

export function useLeaveManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...leave_managementKeys.all, 'all', patientId],
    queryFn: () => leave_managementApi.getAll(patientId),
  });
}

export function useLeaveManagement(id: number) {
  return useQuery({
    queryKey: leave_managementKeys.detail(id),
    queryFn: () => leave_managementApi.get(id),
    enabled: !!id,
  });
}

export function useLeaveManagementCount() {
  return useQuery({
    queryKey: [...leave_managementKeys.all, 'count'],
    queryFn: () => leave_managementApi.count(),
  });
}

export function useLeaveManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: leave_managementKeys.summary(patientId),
    queryFn: () => leave_managementApi.summary(patientId),
  });
}

export function useCreateLeaveManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LeaveManagementCreateInput) => leave_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: leave_managementKeys.all }),
  });
}

export function useUpdateLeaveManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: LeaveManagementUpdateInput }) => leave_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: leave_managementKeys.all });
      qc.invalidateQueries({ queryKey: leave_managementKeys.detail(id) });
    },
  });
}

export function useDeleteLeaveManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => leave_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: leave_managementKeys.all }),
  });
}

export function useActivateLeaveManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => leave_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: leave_managementKeys.all });
      qc.invalidateQueries({ queryKey: leave_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateLeaveManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => leave_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: leave_managementKeys.all });
      qc.invalidateQueries({ queryKey: leave_managementKeys.detail(id) });
    },
  });
}

export function useCompleteLeaveManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => leave_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: leave_managementKeys.all });
      qc.invalidateQueries({ queryKey: leave_managementKeys.detail(id) });
    },
  });
}

export function useCancelLeaveManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => leave_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: leave_managementKeys.all });
      qc.invalidateQueries({ queryKey: leave_managementKeys.detail(id) });
    },
  });
}
