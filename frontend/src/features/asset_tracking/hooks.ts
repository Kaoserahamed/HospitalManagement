import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { asset_trackingApi } from './api';
import type { AssetTrackingCreateInput, AssetTrackingListParams, AssetTrackingUpdateInput } from './types';

export const asset_trackingKeys = {
  all: ['asset_tracking'] as const,
  list: (params: AssetTrackingListParams) => ['asset_tracking', 'list', params] as const,
  detail: (id: number) => ['asset_tracking', 'detail', id] as const,
  summary: (patientId?: number) => ['asset_tracking', 'summary', patientId] as const,
};

export function useAssetTrackingList(params: AssetTrackingListParams = {}) {
  return useQuery({
    queryKey: asset_trackingKeys.list(params),
    queryFn: () => asset_trackingApi.list(params),
  });
}

export function useAssetTrackingAll(patientId?: number) {
  return useQuery({
    queryKey: [...asset_trackingKeys.all, 'all', patientId],
    queryFn: () => asset_trackingApi.getAll(patientId),
  });
}

export function useAssetTracking(id: number) {
  return useQuery({
    queryKey: asset_trackingKeys.detail(id),
    queryFn: () => asset_trackingApi.get(id),
    enabled: !!id,
  });
}

export function useAssetTrackingCount() {
  return useQuery({
    queryKey: [...asset_trackingKeys.all, 'count'],
    queryFn: () => asset_trackingApi.count(),
  });
}

export function useAssetTrackingSummary(patientId?: number) {
  return useQuery({
    queryKey: asset_trackingKeys.summary(patientId),
    queryFn: () => asset_trackingApi.summary(patientId),
  });
}

export function useCreateAssetTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssetTrackingCreateInput) => asset_trackingApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: asset_trackingKeys.all }),
  });
}

export function useUpdateAssetTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssetTrackingUpdateInput }) => asset_trackingApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: asset_trackingKeys.all });
      qc.invalidateQueries({ queryKey: asset_trackingKeys.detail(id) });
    },
  });
}

export function useDeleteAssetTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => asset_trackingApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: asset_trackingKeys.all }),
  });
}

export function useActivateAssetTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => asset_trackingApi.activate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: asset_trackingKeys.all });
      qc.invalidateQueries({ queryKey: asset_trackingKeys.detail(id) });
    },
  });
}

export function useDeactivateAssetTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => asset_trackingApi.deactivate(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: asset_trackingKeys.all });
      qc.invalidateQueries({ queryKey: asset_trackingKeys.detail(id) });
    },
  });
}

export function useCompleteAssetTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => asset_trackingApi.complete(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: asset_trackingKeys.all });
      qc.invalidateQueries({ queryKey: asset_trackingKeys.detail(id) });
    },
  });
}

export function useCancelAssetTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => asset_trackingApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: asset_trackingKeys.all });
      qc.invalidateQueries({ queryKey: asset_trackingKeys.detail(id) });
    },
  });
}
