import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patientPortalApi } from './api';

export function useMessages(params: any = {}) {
  return useQuery({ queryKey: ['portal', 'messages', params], queryFn: () => patientPortalApi.listMessages(params) });
}

export function useConversations(user_id: number) {
  return useQuery({ queryKey: ['portal', 'conversations', user_id], queryFn: () => patientPortalApi.conversations(user_id) });
}

export function useUnreadCount(recipient_id: number) {
  return useQuery({ queryKey: ['portal', 'unread', recipient_id], queryFn: () => patientPortalApi.unreadCount(recipient_id) });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => patientPortalApi.sendMessage(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['portal'] }) });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => patientPortalApi.markRead(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['portal'] }) });
}

export function usePortalSummary(patient_id: number) {
  return useQuery({ queryKey: ['portal', 'summary', patient_id], queryFn: () => patientPortalApi.portalSummary(patient_id) });
}

export function usePendingReminders(patient_id?: number) {
  return useQuery({ queryKey: ['portal', 'reminders', patient_id], queryFn: () => patientPortalApi.pendingReminders(patient_id) });
}
