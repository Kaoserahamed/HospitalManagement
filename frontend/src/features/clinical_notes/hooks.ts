import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clinical_notesApi } from './api';
import type { ClinicalNotesCreateInput, ClinicalNotesListParams, ClinicalNotesUpdateInput } from './types';

export const clinical_notesKeys = {
  all: ['clinical_notes'] as const,
  list: (params: ClinicalNotesListParams) => ['clinical_notes', 'list', params] as const,
  detail: (id: number) => ['clinical_notes', 'detail', id] as const,
  summary: (patientId?: number) => ['clinical_notes', 'summary', patientId] as const,
};

export function useClinicalNotesList(params: ClinicalNotesListParams = {}) {
  return useQuery({
    queryKey: clinical_notesKeys.list(params),
    queryFn: () => clinical_notesApi.list(params),
  });
}

export function useClinicalNotesAll(patientId?: number) {
  return useQuery({
    queryKey: [...clinical_notesKeys.all, 'all', patientId],
    queryFn: () => clinical_notesApi.getAll(patientId),
  });
}

export function useClinicalNotes(id: number) {
  return useQuery({
    queryKey: clinical_notesKeys.detail(id),
    queryFn: () => clinical_notesApi.get(id),
    enabled: !!id,
  });
}

export function useClinicalNotesCount() {
  return useQuery({
    queryKey: [...clinical_notesKeys.all, 'count'],
    queryFn: () => clinical_notesApi.count(),
  });
}

export function useClinicalNotesSummary(patientId?: number) {
  return useQuery({
    queryKey: clinical_notesKeys.summary(patientId),
    queryFn: () => clinical_notesApi.summary(patientId),
  });
}

export function useCreateClinicalNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ClinicalNotesCreateInput) => clinical_notesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinical_notesKeys.all }),
  });
}

export function useUpdateClinicalNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ClinicalNotesUpdateInput }) => clinical_notesApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: clinical_notesKeys.all });
      qc.invalidateQueries({ queryKey: clinical_notesKeys.detail(id) });
    },
  });
}

export function useDeleteClinicalNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clinical_notesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinical_notesKeys.all }),
  });
}

export function useActivateClinicalNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clinical_notesApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: clinical_notesKeys.all });
      qc.invalidateQueries({ queryKey: clinical_notesKeys.detail(id) });
    },
  });
}

export function useDeactivateClinicalNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clinical_notesApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: clinical_notesKeys.all });
      qc.invalidateQueries({ queryKey: clinical_notesKeys.detail(id) });
    },
  });
}

export function useCompleteClinicalNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => clinical_notesApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: clinical_notesKeys.all });
      qc.invalidateQueries({ queryKey: clinical_notesKeys.detail(id) });
    },
  });
}

export function useCancelClinicalNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => clinical_notesApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: clinical_notesKeys.all });
      qc.invalidateQueries({ queryKey: clinical_notesKeys.detail(id) });
    },
  });
}
