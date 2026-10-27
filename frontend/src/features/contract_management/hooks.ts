import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contract_managementApi } from './api';
import type { ContractManagementCreateInput, ContractManagementListParams, ContractManagementUpdateInput } from './types';

export const contract_managementKeys = {
  all: ['contract_management'] as const,
  list: (params: ContractManagementListParams) => ['contract_management', 'list', params] as const,
  detail: (id: number) => ['contract_management', 'detail', id] as const,
  summary: (patientId?: number) => ['contract_management', 'summary', patientId] as const,
};

export function useContractManagementList(params: ContractManagementListParams = {}) {
  return useQuery({
    queryKey: contract_managementKeys.list(params),
    queryFn: () => contract_managementApi.list(params),
  });
}

export function useContractManagementAll(patientId?: number) {
  return useQuery({
    queryKey: [...contract_managementKeys.all, 'all', patientId],
    queryFn: () => contract_managementApi.getAll(patientId),
  });
}

export function useContractManagement(id: number) {
  return useQuery({
    queryKey: contract_managementKeys.detail(id),
    queryFn: () => contract_managementApi.get(id),
    enabled: !!id,
  });
}

export function useContractManagementCount() {
  return useQuery({
    queryKey: [...contract_managementKeys.all, 'count'],
    queryFn: () => contract_managementApi.count(),
  });
}

export function useContractManagementSummary(patientId?: number) {
  return useQuery({
    queryKey: contract_managementKeys.summary(patientId),
    queryFn: () => contract_managementApi.summary(patientId),
  });
}

export function useCreateContractManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ContractManagementCreateInput) => contract_managementApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: contract_managementKeys.all }),
  });
}

export function useUpdateContractManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ContractManagementUpdateInput }) => contract_managementApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: contract_managementKeys.all });
      qc.invalidateQueries({ queryKey: contract_managementKeys.detail(id) });
    },
  });
}

export function useDeleteContractManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contract_managementApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: contract_managementKeys.all }),
  });
}

export function useActivateContractManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contract_managementApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: contract_managementKeys.all });
      qc.invalidateQueries({ queryKey: contract_managementKeys.detail(id) });
    },
  });
}

export function useDeactivateContractManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contract_managementApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: contract_managementKeys.all });
      qc.invalidateQueries({ queryKey: contract_managementKeys.detail(id) });
    },
  });
}

export function useCompleteContractManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => contract_managementApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: contract_managementKeys.all });
      qc.invalidateQueries({ queryKey: contract_managementKeys.detail(id) });
    },
  });
}

export function useCancelContractManagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => contract_managementApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: contract_managementKeys.all });
      qc.invalidateQueries({ queryKey: contract_managementKeys.detail(id) });
    },
  });
}
