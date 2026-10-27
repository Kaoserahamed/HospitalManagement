import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cdsApi } from './api';

export function useCDSRules(rule_type?: string, active_only = false) {
  return useQuery({ queryKey: ['cds', 'rules', rule_type, active_only], queryFn: () => cdsApi.listRules(rule_type, active_only) });
}

export function useCDSAlerts(patient_id?: number, acknowledged?: boolean) {
  return useQuery({ queryKey: ['cds', 'alerts', patient_id, acknowledged], queryFn: () => cdsApi.listAlerts(patient_id, acknowledged) });
}

export function useEvaluateCDS() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => cdsApi.evaluate(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['cds'] }) });
}

export function useAcknowledgeCDSAlert() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, acknowledged_by }: any) => cdsApi.acknowledgeAlert(id, acknowledged_by), onSuccess: () => qc.invalidateQueries({ queryKey: ['cds'] }) });
}
