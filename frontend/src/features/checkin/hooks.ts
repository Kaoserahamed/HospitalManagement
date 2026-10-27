import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkinApi } from './api';

export function useCheckIns(params: any = {}) {
  return useQuery({ queryKey: ['checkin', params], queryFn: () => checkinApi.list(params) });
}

export function useCheckIn(id: number) {
  return useQuery({ queryKey: ['checkin', id], queryFn: () => checkinApi.get(id), enabled: !!id });
}

export function useCreateCheckIn() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => checkinApi.checkIn(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['checkin'] }) });
}

export function useCallPatient() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => checkinApi.call(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['checkin'] }) });
}

export function useCompleteCheckIn() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => checkinApi.complete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['checkin'] }) });
}

export function useQueueStats(department_id?: number) {
  return useQuery({ queryKey: ['checkin', 'stats', department_id], queryFn: () => checkinApi.queueStats(department_id) });
}
