// ----------------------------------------------------------------------

import type { SWRConfiguration } from 'swr';
import type { IEnrollmentLogItem } from 'src/types/student';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

const swrOptions: SWRConfiguration = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetLogs() {
  const url = endpoints.reports.logs;
  const { data, isLoading, error, isValidating } = useSWR<{
    data: IEnrollmentLogItem[];
  }>(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(
    () => ({
      logs: data?.data || [],
      logsLoading: isLoading,
      logsError: error,
      logsValidating: isValidating,
      logsEmpty: !isLoading && !isValidating && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
