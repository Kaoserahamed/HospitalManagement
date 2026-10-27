import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointment_reminderApi } from './api';
import type { AppointmentReminderCreateInput, AppointmentReminderListParams, AppointmentReminderUpdateInput } from './types';

export const appointment_reminderKeys = {
  all: ['appointment_reminder'] as const,
  list: (params: AppointmentReminderListParams) => ['appointment_reminder', 'list', params] as const,
  detail: (id: number) => ['appointment_reminder', 'detail', id] as const,
  summary: (patientId?: number) => ['appointment_reminder', 'summary', patientId] as const,
};

export function useAppointmentReminderList(params: AppointmentReminderListParams = {}) {
  return useQuery({
    queryKey: appointment_reminderKeys.list(params),
    queryFn: () => appointment_reminderApi.list(params),
  });
}

export function useAppointmentReminderAll(patientId?: number) {
  return useQuery({
    queryKey: [...appointment_reminderKeys.all, 'all', patientId],
    queryFn: () => appointment_reminderApi.getAll(patientId),
  });
}

export function useAppointmentReminder(id: number) {
  return useQuery({
    queryKey: appointment_reminderKeys.detail(id),
    queryFn: () => appointment_reminderApi.get(id),
    enabled: !!id,
  });
}

export function useAppointmentReminderCount() {
  return useQuery({
    queryKey: [...appointment_reminderKeys.all, 'count'],
    queryFn: () => appointment_reminderApi.count(),
  });
}

export function useAppointmentReminderSummary(patientId?: number) {
  return useQuery({
    queryKey: appointment_reminderKeys.summary(patientId),
    queryFn: () => appointment_reminderApi.summary(patientId),
  });
}

export function useCreateAppointmentReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AppointmentReminderCreateInput) => appointment_reminderApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: appointment_reminderKeys.all }),
  });
}

export function useUpdateAppointmentReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AppointmentReminderUpdateInput }) => appointment_reminderApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.all });
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.detail(id) });
    },
  });
}

export function useDeleteAppointmentReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointment_reminderApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: appointment_reminderKeys.all }),
  });
}

export function useActivateAppointmentReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointment_reminderApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.all });
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.detail(id) });
    },
  });
}

export function useDeactivateAppointmentReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointment_reminderApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.all });
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.detail(id) });
    },
  });
}

export function useCompleteAppointmentReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => appointment_reminderApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.all });
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.detail(id) });
    },
  });
}

export function useCancelAppointmentReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => appointment_reminderApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.all });
      qc.invalidateQueries({ queryKey: appointment_reminderKeys.detail(id) });
    },
  });
}
