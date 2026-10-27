import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { backupApi } from './api';

export function useBackups(params: any = {}) {
  return useQuery({ queryKey: ['backup', 'jobs', params], queryFn: () => backupApi.listBackups(params) });
}

export function useCreateBackup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => backupApi.createBackup(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['backup'] }) });
}

export function useRunBackup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => backupApi.runBackup(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['backup'] }) });
}

export function useBackupStats() {
  return useQuery({ queryKey: ['backup', 'stats'], queryFn: () => backupApi.stats() });
}

export function useLatestBackup() {
  return useQuery({ queryKey: ['backup', 'latest'], queryFn: () => backupApi.latestBackup() });
}
