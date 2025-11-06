// ----------------------------------------------------------------------

import { useMemo } from 'react';
import { endpoints, fetcher } from 'src/lib/axios';
import { IEnrollmentLogItem } from 'src/types/student';
import useSWR, { SWRConfiguration } from 'swr';

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
