import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { videoApi } from './api';

export function useVideoSessions(params: any = {}) {
  return useQuery({ queryKey: ['video', 'sessions', params], queryFn: () => videoApi.listSessions(params) });
}

export function useVideoSession(id: number) {
  return useQuery({ queryKey: ['video', 'session', id], queryFn: () => videoApi.getSession(id), enabled: !!id });
}

export function useCreateVideoSession() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => videoApi.createSession(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['video'] }) });
}

export function useConnectVideoSession() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => videoApi.connect(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['video'] }) });
}

export function useEndVideoSession() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, recording_path }: any) => videoApi.endSession(id, recording_path), onSuccess: () => qc.invalidateQueries({ queryKey: ['video'] }) });
}
