import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { escalationApi } from './api';

export function useEscalations(params: any = {}) {
  return useQuery({ queryKey: ['escalation', params], queryFn: () => escalationApi.list(params) });
}

export function useOpenEscalations(patient_id?: number) {
  return useQuery({ queryKey: ['escalation', 'open', patient_id], queryFn: () => escalationApi.openEscalations(patient_id) });
}

export function useCreateEscalation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => escalationApi.create(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['escalation'] }) });
}

export function useResolveEscalation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, notes }: any) => escalationApi.resolve(id, notes), onSuccess: () => qc.invalidateQueries({ queryKey: ['escalation'] }) });
}

export function useEscalate() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => escalationApi.escalate(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['escalation'] }) });
}
