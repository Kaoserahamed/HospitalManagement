import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { schedulingApi } from './api';

export function useSwaps(status?: string) {
  return useQuery({ queryKey: ['scheduling', 'swaps', status], queryFn: () => schedulingApi.listSwaps(status) });
}

export function usePendingSwaps() {
  return useQuery({ queryKey: ['scheduling', 'swaps', 'pending'], queryFn: () => schedulingApi.pendingSwaps() });
}

export function useRequestSwap() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => schedulingApi.requestSwap(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduling'] }) });
}

export function useApproveSwap() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, reviewer_id }: any) => schedulingApi.approveSwap(id, reviewer_id), onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduling'] }) });
}

export function useOnCall(department_id?: number, active_only = false) {
  return useQuery({ queryKey: ['scheduling', 'oncall', department_id, active_only], queryFn: () => schedulingApi.listOnCall(department_id, active_only) });
}

export function useCoverageAlerts(department_id?: number, acknowledged?: boolean) {
  return useQuery({ queryKey: ['scheduling', 'alerts', department_id, acknowledged], queryFn: () => schedulingApi.listCoverageAlerts(department_id, acknowledged) });
}

export function useShiftTemplates(department_id?: number) {
  return useQuery({ queryKey: ['scheduling', 'templates', department_id], queryFn: () => schedulingApi.listTemplates(department_id) });
}
