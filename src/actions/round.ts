import type { SWRConfiguration } from 'swr';
import type { ICourseRounds } from 'src/types/course';

import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetRounds() {
  const url = endpoints.round.list;
  const { data, isLoading, error, isValidating } = useSWR<ICourseRounds[]>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      rounds: data || [],
      roundsLoading: isLoading,
      roundsError: error,
      roundsValidating: isValidating,
      roundsEmpty: !isLoading && !isValidating && !data?.length,
      refetch: refetchData,
    }),
    [data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

export function useGetRoundeById(id: string) {
  const url = endpoints.round.details.replace(':id', id);

  const { data, isLoading, error, isValidating } = useSWR<ICourseRounds>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      round: data,
      roundLoading: isLoading,
      roundError: error,
      roundValidating: isValidating,
      roundEmpty: !isLoading && !isValidating && !data,
      refetch: refetchData,
    }),
    [data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}
