import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { imaging_archiveApi } from './api';
import type { ImagingArchiveCreateInput, ImagingArchiveListParams, ImagingArchiveUpdateInput } from './types';

export const imaging_archiveKeys = {
  all: ['imaging_archive'] as const,
  list: (params: ImagingArchiveListParams) => ['imaging_archive', 'list', params] as const,
  detail: (id: number) => ['imaging_archive', 'detail', id] as const,
  summary: (patientId?: number) => ['imaging_archive', 'summary', patientId] as const,
};

export function useImagingArchiveList(params: ImagingArchiveListParams = {}) {
  return useQuery({
    queryKey: imaging_archiveKeys.list(params),
    queryFn: () => imaging_archiveApi.list(params),
  });
}

export function useImagingArchiveAll(patientId?: number) {
  return useQuery({
    queryKey: [...imaging_archiveKeys.all, 'all', patientId],
    queryFn: () => imaging_archiveApi.getAll(patientId),
  });
}

export function useImagingArchive(id: number) {
  return useQuery({
    queryKey: imaging_archiveKeys.detail(id),
    queryFn: () => imaging_archiveApi.get(id),
    enabled: !!id,
  });
}

export function useImagingArchiveCount() {
  return useQuery({
    queryKey: [...imaging_archiveKeys.all, 'count'],
    queryFn: () => imaging_archiveApi.count(),
  });
}

export function useImagingArchiveSummary(patientId?: number) {
  return useQuery({
    queryKey: imaging_archiveKeys.summary(patientId),
    queryFn: () => imaging_archiveApi.summary(patientId),
  });
}

export function useCreateImagingArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ImagingArchiveCreateInput) => imaging_archiveApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: imaging_archiveKeys.all }),
  });
}

export function useUpdateImagingArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ImagingArchiveUpdateInput }) => imaging_archiveApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.all });
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.detail(id) });
    },
  });
}

export function useDeleteImagingArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => imaging_archiveApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: imaging_archiveKeys.all }),
  });
}

export function useActivateImagingArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => imaging_archiveApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.all });
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.detail(id) });
    },
  });
}

export function useDeactivateImagingArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => imaging_archiveApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.all });
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.detail(id) });
    },
  });
}

export function useCompleteImagingArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => imaging_archiveApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.all });
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.detail(id) });
    },
  });
}

export function useCancelImagingArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => imaging_archiveApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.all });
      qc.invalidateQueries({ queryKey: imaging_archiveKeys.detail(id) });
    },
  });
}
