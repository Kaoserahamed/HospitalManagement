import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffApi } from './api';

export const staffKeys = { all: ['staff'] as const };

export function useStaffProfiles(params: any = {}) {
  return useQuery({ queryKey: ['staff', 'profiles', params], queryFn: () => staffApi.listProfiles(params) });
}

export function useCreateStaffProfile() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => staffApi.createProfile(p), onSuccess: () => qc.invalidateQueries({ queryKey: staffKeys.all }) });
}

export function useCreateShift() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => staffApi.createShift(p), onSuccess: () => qc.invalidateQueries({ queryKey: staffKeys.all }) });
}

export function useRequestTimeOff() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => staffApi.requestTimeOff(p), onSuccess: () => qc.invalidateQueries({ queryKey: staffKeys.all }) });
}
