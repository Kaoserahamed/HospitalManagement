import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mdtApi } from './api';

export function useMeetings(params: any = {}) {
  return useQuery({ queryKey: ['mdt', 'meetings', params], queryFn: () => mdtApi.listMeetings(params) });
}

export function useMeeting(id: number) {
  return useQuery({ queryKey: ['mdt', 'meeting', id], queryFn: () => mdtApi.getMeeting(id), enabled: !!id });
}

export function useScheduleMeeting() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => mdtApi.scheduleMeeting(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['mdt'] }) });
}

export function useCompleteMeeting() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, notes }: any) => mdtApi.completeMeeting(id, notes), onSuccess: () => qc.invalidateQueries({ queryKey: ['mdt'] }) });
}

export function useAddDecision() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => mdtApi.addDecision(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['mdt'] }) });
}
