import { useCallback, useEffect, useState } from 'react';
import { Animal } from '@/types/animal';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import {
  getAnimalsCache,
  getSearchHistory,
  setAnimalsCache,
} from '@/services/storage.service';
import { mergeById } from '@/utils/mergeById';

export function useAnimalsList() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  const buildPath = useCallback((offset: number) => `/animals?offset=${offset}`, []);

  const { items, setItems, loading, error, hasMore, refresh, loadMore } =
    usePaginatedFetch<Animal>(buildPath, {
      getFallback: getAnimalsCache,
      onItemsChange: setAnimalsCache,
      immediate: false,
    });

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const [cached, history] = await Promise.all([getAnimalsCache(), getSearchHistory()]);

      if (!mounted) return;

      if (cached.length > 0) {
        setItems(mergeById([], cached, true));
      }

      setSearchHistory(history);
      setInitialized(true);
      await refresh();
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    animals: items,
    searchHistory,
    setSearchHistory,
    loading: loading || !initialized,
    error,
    hasMore,
    refresh,
    loadMore,
  };
}
