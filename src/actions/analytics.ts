import type { SWRConfiguration } from 'swr';
import type { ReportData } from 'src/types/analytics';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetAnalytics(startDate?: Date, endDate?: Date) {
  const params = new URLSearchParams();
  if (startDate) params.append('start', startDate.toISOString());
  if (endDate) params.append('end', endDate.toISOString());

  const url = `${endpoints.reports.root}?${params.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<ReportData[]>(url, fetcher, {
    ...swrOptions,
  });
  console.log('report', data);
  const memoizedValue = useMemo(
    () => ({
      report: data || [],
      reportLoading: isLoading,
      reportError: error,
      reportValidating: isValidating,
      reportEmpty: !isLoading && !isValidating && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
