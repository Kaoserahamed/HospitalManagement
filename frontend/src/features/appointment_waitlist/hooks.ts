import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointment_waitlistApi } from './api';
import type { AppointmentWaitlistCreateInput, AppointmentWaitlistListParams, AppointmentWaitlistUpdateInput } from './types';

export const appointment_waitlistKeys = {
  all: ['appointment_waitlist'] as const,
  list: (params: AppointmentWaitlistListParams) => ['appointment_waitlist', 'list', params] as const,
  detail: (id: number) => ['appointment_waitlist', 'detail', id] as const,
  summary: (patientId?: number) => ['appointment_waitlist', 'summary', patientId] as const,
};

export function useAppointmentWaitlistList(params: AppointmentWaitlistListParams = {}) {
  return useQuery({
    queryKey: appointment_waitlistKeys.list(params),
    queryFn: () => appointment_waitlistApi.list(params),
  });
}

export function useAppointmentWaitlistAll(patientId?: number) {
  return useQuery({
    queryKey: [...appointment_waitlistKeys.all, 'all', patientId],
    queryFn: () => appointment_waitlistApi.getAll(patientId),
  });
}

export function useAppointmentWaitlist(id: number) {
  return useQuery({
    queryKey: appointment_waitlistKeys.detail(id),
    queryFn: () => appointment_waitlistApi.get(id),
    enabled: !!id,
  });
}

export function useAppointmentWaitlistCount() {
  return useQuery({
    queryKey: [...appointment_waitlistKeys.all, 'count'],
    queryFn: () => appointment_waitlistApi.count(),
  });
}

export function useAppointmentWaitlistSummary(patientId?: number) {
  return useQuery({
    queryKey: appointment_waitlistKeys.summary(patientId),
    queryFn: () => appointment_waitlistApi.summary(patientId),
  });
}

export function useCreateAppointmentWaitlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AppointmentWaitlistCreateInput) => appointment_waitlistApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: appointment_waitlistKeys.all }),
  });
}

export function useUpdateAppointmentWaitlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AppointmentWaitlistUpdateInput }) => appointment_waitlistApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.all });
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.detail(id) });
    },
  });
}

export function useDeleteAppointmentWaitlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointment_waitlistApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: appointment_waitlistKeys.all }),
  });
}

export function useActivateAppointmentWaitlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointment_waitlistApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.all });
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.detail(id) });
    },
  });
}

export function useDeactivateAppointmentWaitlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointment_waitlistApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.all });
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.detail(id) });
    },
  });
}

export function useCompleteAppointmentWaitlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => appointment_waitlistApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.all });
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.detail(id) });
    },
  });
}

export function useCancelAppointmentWaitlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => appointment_waitlistApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.all });
      qc.invalidateQueries({ queryKey: appointment_waitlistKeys.detail(id) });
    },
  });
}
