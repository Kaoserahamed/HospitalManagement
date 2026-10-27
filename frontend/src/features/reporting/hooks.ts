import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportingApi } from './api';

export function useReportDefinitions(active_only = false) {
  return useQuery({ queryKey: ['reporting', 'definitions', active_only], queryFn: () => reportingApi.listDefinitions(active_only) });
}

export function useCreateReportDefinition() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => reportingApi.createDefinition(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['reporting'] }) });
}

export function useRunReport() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => reportingApi.run(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['reporting'] }) });
}

export function useReportExecutions(definition_id?: number) {
  return useQuery({ queryKey: ['reporting', 'executions', definition_id], queryFn: () => reportingApi.listExecutions(definition_id) });
}
