import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { monitoringApi } from './api';

export function useDevices(patient_id?: number) {
  return useQuery({ queryKey: ['monitoring', 'devices', patient_id], queryFn: () => monitoringApi.listDevices(patient_id) });
}

export function useReadings(patient_id?: number, vital_type?: string, limit = 100) {
  return useQuery({ queryKey: ['monitoring', 'readings', patient_id, vital_type, limit], queryFn: () => monitoringApi.listReadings(patient_id, vital_type, limit) });
}

export function useAlerts(patient_id?: number, acknowledged?: boolean) {
  return useQuery({ queryKey: ['monitoring', 'alerts', patient_id, acknowledged], queryFn: () => monitoringApi.listAlerts(patient_id, acknowledged) });
}

export function useRegisterDevice() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => monitoringApi.registerDevice(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['monitoring'] }) });
}

export function useRecordReading() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => monitoringApi.recordReading(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['monitoring'] }) });
}

export function useAcknowledgeAlert() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => monitoringApi.acknowledgeAlert(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['monitoring'] }) });
}
