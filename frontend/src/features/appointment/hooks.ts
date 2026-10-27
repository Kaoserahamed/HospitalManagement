import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from './api';
import type { AppointmentCreateInput, AppointmentListParams, AppointmentUpdateInput } from './types';

export const appointmentKeys = {
  all: ['appointments'] as const,
  list: (params: AppointmentListParams) => ['appointments', 'list', params] as const,
  detail: (id: number) => ['appointments', 'detail', id] as const,
  slots: (doctorId: number) => ['appointments', 'slots', doctorId] as const,
};

export function useAppointments(params: AppointmentListParams = {}) {
  return useQuery({ queryKey: appointmentKeys.list(params), queryFn: () => appointmentApi.list(params) });
}

export function useAppointment(id: number) {
  return useQuery({ queryKey: appointmentKeys.detail(id), queryFn: () => appointmentApi.get(id), enabled: !!id });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: AppointmentCreateInput) => appointmentApi.create(p), onSuccess: () => qc.invalidateQueries({ queryKey: appointmentKeys.all }) });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AppointmentUpdateInput }) => appointmentApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all });
      qc.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
    },
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => appointmentApi.cancel(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: appointmentKeys.all }),
  });
}

export function useCompleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => appointmentApi.complete(id, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: appointmentKeys.all }),
  });
}
