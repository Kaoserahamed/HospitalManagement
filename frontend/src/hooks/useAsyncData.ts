import { useCallback, useEffect, useRef, useState } from 'react'

import { ApiError, toApiError } from '../api/apiError'

interface UseAsyncDataResult<T> {
  data: T | null
  error: ApiError | null
  loading: boolean
  /** Re-run the fetcher with fresh state (e.g. after a failed attempt). */
  reload: () => void
}

/**
 * Typed data-fetching hook: centralizes loading/error state and normalizes
 * every failure to ApiError. Fetcher identity is tracked via ref so callers
 * can pass inline closures without retriggering effects.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[] = [],
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(true)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(toApiError(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  return { data, error, loading, reload }
}
