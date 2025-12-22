import type { SWRConfiguration } from 'swr';
import type { IAdminItem } from 'src/types/admin';
import type { ICourseItem } from 'src/types/course';

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

export function useGetAllAdmins() {
  const url = endpoints.admin.listAll;
  const { data, isLoading, error, isValidating } = useSWR<{ data: IAdminItem[] }>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      admins: data?.data || [],
      adminsLoading: isLoading,
      adminsError: error,
      adminsValidating: isValidating,
      adminsEmpty: !isLoading && !isValidating && !data?.data?.length,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

export function useGetAdmins() {
  const url = endpoints.admin.list;
  const { data, isLoading, error, isValidating } = useSWR<{ data: IAdminItem[] }>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      admins: data?.data || [],
      adminsLoading: isLoading,
      adminsError: error,
      adminsValidating: isValidating,
      adminsEmpty: !isLoading && !isValidating && !data?.data?.length,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

export function useGetCourseById(id: string) {
  const url = `endpoints.course.details.replace(':id', id);`;

  const { data, isLoading, error, isValidating } = useSWR<ICourseItem>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      course: data as ICourseItem,
      courseLoading: isLoading,
      courseError: error,
      courseValidating: isValidating,
      courseEmpty: !isLoading && !isValidating && !data,
      refetch: refetchData,
    }),
    [data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}
