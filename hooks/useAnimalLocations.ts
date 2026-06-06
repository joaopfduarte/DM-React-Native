import { useCallback } from 'react';
import { AnimalLocation } from '@/types/animal';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';

export function useAnimalLocations() {
  const buildPath = useCallback(
    (offset: number) => `/animals/location?offset=${offset}`,
    [],
  );

  return usePaginatedFetch<AnimalLocation>(buildPath);
}
