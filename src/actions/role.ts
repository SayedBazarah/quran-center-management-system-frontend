import type { SWRConfiguration } from 'swr';
import type { IRoleItem } from 'src/types/admin';

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

export function useGetRoles() {
  const url = endpoints.role.list;
  const { data, isLoading, error, isValidating } = useSWR<{ data: IRoleItem[] }>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      roles: data?.data || [],
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      rolesEmpty: !isLoading && !isValidating && !data?.data?.length,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

// export function useGetCourseById(id: string) {
//   const url = endpoints.course.details.replace(':id', id);

//   const { data, isLoading, error, isValidating } = useSWR<ICourseItem>(url, fetcher, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//   });

//   const refetchData = () => {
//     mutate(url); // This will re-fetch the data from the same URL
//   };

//   const memoizedValue = useMemo(
//     () => ({
//       course: data as ICourseItem,
//       courseLoading: isLoading,
//       courseError: error,
//       courseValidating: isValidating,
//       courseEmpty: !isLoading && !isValidating && !data,
//       refetch: refetchData,
//     }),
//     [data, error, isLoading, isValidating]
//   );
//   return memoizedValue;
// }
// // ----------------------------------------------------------------------

export function useGetPermissions() {
  const url = endpoints.role.permission;
  const { data, isLoading, error, isValidating } = useSWR<{
    data: {
      id: string;
      name: string;
      code: string;
    }[];
  }>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      permissions: data?.data || [],
      permissionsLoading: isLoading,
      permissionsError: error,
      permissionsValidating: isValidating,
      permissionsEmpty: !isLoading && !isValidating && !data?.data?.length,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}
