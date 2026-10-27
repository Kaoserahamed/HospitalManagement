import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { telemedicineApi } from './api';

export function useVisits(params: any = {}) {
  return useQuery({ queryKey: ['telemedicine', 'visits', params], queryFn: () => telemedicineApi.listVisits(params) });
}

export function useStartVisit() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => telemedicineApi.startVisit(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['telemedicine'] }) });
}

export function useEndVisit() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, quality, notes }: any) => telemedicineApi.endVisit(id, quality, notes), onSuccess: () => qc.invalidateQueries({ queryKey: ['telemedicine'] }) });
}

export function useScheduleVisit() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => telemedicineApi.scheduleVisit(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['telemedicine'] }) });
}

export function useVisitSummary() {
  return useQuery({ queryKey: ['telemedicine', 'summary'], queryFn: () => telemedicineApi.summary() });
}
