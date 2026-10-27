import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { careApi } from './api';

export function useCareTeams(patient_id?: number) {
  return useQuery({ queryKey: ['care', 'teams', patient_id], queryFn: () => careApi.listTeams(patient_id) });
}

export function useCareTasks(params: any = {}) {
  return useQuery({ queryKey: ['care', 'tasks', params], queryFn: () => careApi.listTasks(params) });
}

export function useCreateCareTask() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => careApi.createTask(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['care'] }) });
}

export function useCompleteCareTask() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => careApi.completeTask(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['care'] }) });
}

export function useHandoffs(patient_id?: number, to_user?: number) {
  return useQuery({ queryKey: ['care', 'handoffs', patient_id, to_user], queryFn: () => careApi.listHandoffs(patient_id, to_user) });
}

export function useCreateHandoff() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => careApi.createHandoff(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['care'] }) });
}
