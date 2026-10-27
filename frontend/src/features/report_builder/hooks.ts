import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportBuilderApi } from './api';

export function useReportTemplates(active_only = false) {
  return useQuery({ queryKey: ['report-builder', 'templates', active_only], queryFn: () => reportBuilderApi.listTemplates(active_only) });
}

export function useCreateReportTemplate() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => reportBuilderApi.createTemplate(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['report-builder'] }) });
}

export function useRunReportBuilder() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => reportBuilderApi.run(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['report-builder'] }) });
}

export function useReportExports(template_id?: number) {
  return useQuery({ queryKey: ['report-builder', 'exports', template_id], queryFn: () => reportBuilderApi.listExports(template_id) });
}

export function useReportDashboards() {
  return useQuery({ queryKey: ['report-builder', 'dashboards'], queryFn: () => reportBuilderApi.listDashboards() });
}
