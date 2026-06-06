import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { fetchWithAuth, FetchError } from '@/services/fetchClient';
import { mergeById } from '@/utils/mergeById';

export interface UsePaginatedFetchOptions<T extends { id: number }> {
  enabled?: boolean;
  immediate?: boolean;
  getFallback?: () => Promise<T[]>;
  onItemsChange?: (items: T[]) => void;
  mergeItems?: (existing: T[], incoming: T[], replace: boolean) => T[];
}

export interface UsePaginatedFetchResult<T> {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => void;
}

export function usePaginatedFetch<T extends { id: number }>(
  buildPath: (offset: number) => string | null,
  options: UsePaginatedFetchOptions<T> = {},
): UsePaginatedFetchResult<T> {
  const {
    enabled = true,
    immediate = true,
    getFallback,
    onItemsChange,
    mergeItems = mergeById,
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const isFetching = useRef(false);

  const updateItems = useCallback(
    (updater: T[] | ((prev: T[]) => T[])) => {
      setItems((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        onItemsChange?.(next);
        return next;
      });
    },
    [onItemsChange],
  );

  const fetchPage = useCallback(
    async (currentOffset: number, refresh = false) => {
      if (!enabled || isFetching.current) return;
      if (!refresh && !hasMore && currentOffset > 0) return;

      const path = buildPath(currentOffset);
      if (!path) return;

      if (refresh) {
        setHasMore(true);
        setOffset(0);
      }

      isFetching.current = true;
      setLoading(true);
      setError(null);

      try {
        const data = await fetchWithAuth<T[]>(path);

        if (data.length === 0) {
          setHasMore(false);
          return;
        }

        updateItems((prev) => mergeItems(prev, data, refresh));
        setOffset(currentOffset + 1);
      } catch (err) {
        if (currentOffset === 0 && getFallback) {
          const fallback = await getFallback();
          if (fallback.length > 0) {
            updateItems(mergeItems([], fallback, true));
            setError('Sem conexão. Exibindo dados salvos localmente.');
          } else {
            setError('Não foi possível carregar os dados. Verifique sua conexão.');
          }
        } else if (currentOffset === 0) {
          const message =
            err instanceof FetchError ? err.message : 'Não foi possível carregar os dados.';
          setError(message);
        } else {
          setError('Erro ao carregar mais itens.');
        }
      } finally {
        isFetching.current = false;
        setLoading(false);
      }
    },
    [enabled, hasMore, buildPath, getFallback, mergeItems, updateItems],
  );

  const refresh = useCallback(() => fetchPage(0, true), [fetchPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !error) {
      fetchPage(offset);
    }
  }, [loading, hasMore, error, offset, fetchPage]);

  const hasInitialLoaded = useRef(false);

  useEffect(() => {
    if (!immediate || !enabled || hasInitialLoaded.current) return;
    hasInitialLoaded.current = true;
    fetchPage(0, true);
  }, [immediate, enabled, fetchPage]);

  return { items, setItems, loading, error, hasMore, refresh, loadMore };
}
