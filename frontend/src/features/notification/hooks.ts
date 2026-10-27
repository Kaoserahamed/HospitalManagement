import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from './api';

export function useNotifications(params: any = {}) {
  return useQuery({ queryKey: ['notifications', params], queryFn: () => notificationApi.list(params) });
}

export function useUnreadCount(recipient_id: number) {
  return useQuery({ queryKey: ['notifications', 'unread', recipient_id], queryFn: () => notificationApi.unreadCount(recipient_id) });
}

export function useSendNotification() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: any) => notificationApi.send(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => notificationApi.markRead(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) });
}
