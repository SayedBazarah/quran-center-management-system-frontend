import type { SWRConfiguration } from 'swr';
import type { ITeacherItem } from 'src/types/teacher';

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

export function useGetTeachers() {
  const url = endpoints.teacher.list;
  const { data, isLoading, error, isValidating } = useSWR<{ data: ITeacherItem[] }>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      teachers: data?.data || [],
      teachersLoading: isLoading,
      teachersError: error,
      teachersValidating: isValidating,
      teachersEmpty: !isLoading && !isValidating && !data?.data?.length,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

// export function useGetTeacherById(id: string) {
//   const url = endpoints.teacher.details.replace(':id', id);

//   const { data, isLoading, error, isValidating } = useSWR<ITeacherItem>(url, fetcher, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//   });

//   const refetchData = useCallback(() => {
//     mutate(url); // This will re-fetch the data from the same URL
//   }, [url]);

//   const memoizedValue = useMemo(
//     () => ({
//       teacher: data as ITeacherItem,
//       teacherLoading: isLoading,
//       teacherError: error,
//       teacherValidating: isValidating,
//       teacherEmpty: !isLoading && !isValidating && !data,
//       refetch: refetchData,
//     }),
//     [data, error, isLoading, isValidating, refetchData]
//   );
//   return memoizedValue;
// }
