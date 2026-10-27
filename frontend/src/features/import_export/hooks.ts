import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { importExportApi } from './api';

export function useImports(params: any = {}) {
  return useQuery({ queryKey: ['import-export', 'imports', params], queryFn: () => importExportApi.listImports(params) });
}

export function useExports(params: any = {}) {
  return useQuery({ queryKey: ['import-export', 'exports', params], queryFn: () => importExportApi.listExports(params) });
}

export function useCreateImport() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => importExportApi.createImport(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['import-export'] }) });
}

export function useProcessImport() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => importExportApi.processImport(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['import-export'] }) });
}

export function useCreateExport() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => importExportApi.createExport(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['import-export'] }) });
}

export function useProcessExport() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => importExportApi.processExport(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['import-export'] }) });
}
