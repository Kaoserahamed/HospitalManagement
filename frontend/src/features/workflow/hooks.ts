import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from './api';

export function useWorkflowDefinitions(active_only = false) {
  return useQuery({ queryKey: ['workflow', 'definitions', active_only], queryFn: () => workflowApi.listDefinitions(active_only) });
}

export function useWorkflowInstances(params: any = {}) {
  return useQuery({ queryKey: ['workflow', 'instances', params], queryFn: () => workflowApi.listInstances(params) });
}

export function useWorkflowInstance(id: number) {
  return useQuery({ queryKey: ['workflow', 'instance', id], queryFn: () => workflowApi.getInstance(id), enabled: !!id });
}

export function useStartWorkflow() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => workflowApi.startInstance(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['workflow'] }) });
}

export function useAdvanceWorkflow() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ instance_id, action, performed_by, notes }: any) => workflowApi.advance(instance_id, action, performed_by, notes), onSuccess: () => qc.invalidateQueries({ queryKey: ['workflow'] }) });
}

export function useWorkflowProgress(id: number) {
  return useQuery({ queryKey: ['workflow', 'progress', id], queryFn: () => workflowApi.progress(id), enabled: !!id });
}
