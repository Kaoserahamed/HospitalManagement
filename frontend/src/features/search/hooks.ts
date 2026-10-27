import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { searchApi } from './api';

export function useSearch(query: string, limit = 20) {
  return useQuery({ queryKey: ['search', query, limit], queryFn: () => searchApi.search(query, limit), enabled: !!query.trim() });
}

export function useSuggest(q: string, limit = 5) {
  return useQuery({ queryKey: ['search', 'suggest', q, limit], queryFn: () => searchApi.suggest(q, limit), enabled: !!q.trim() });
}

export function useIndexDocument() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ doc_id, content }: any) => searchApi.index(doc_id, content), onSuccess: () => qc.invalidateQueries({ queryKey: ['search'] }) });
}
