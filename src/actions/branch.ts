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

export function useGetAllBranches() {
  const url = endpoints.branch.listAll;
  const { data, isLoading, error, isValidating } = useSWR<{ data: IRoleItem[] }>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      branches: data?.data || [],
      branchesLoading: isLoading,
      branchesError: error,
      branchesValidating: isValidating,
      branchesEmpty: !isLoading && !isValidating && !data?.data?.length,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

export function useGetBranches() {
  const url = endpoints.branch.list;
  const { data, isLoading, error, isValidating } = useSWR<{ data: IRoleItem[] }>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      branches: data?.data || [],
      branchesLoading: isLoading,
      branchesError: error,
      branchesValidating: isValidating,
      branchesEmpty: !isLoading && !isValidating && !data?.data?.length,
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

// export function useGetPermissions() {
//   const url = endpoints.role.permission;
//   const { data, isLoading, error, isValidating } = useSWR<IRoleItem[]>(url, fetcher, {
//     ...swrOptions,
//   });

//   const refetchData = () => {
//     mutate(url); // This will re-fetch the data from the same URL
//   };

//   const memoizedValue = useMemo(
//     () => ({
//       permissions: data || [],
//       permissionsLoading: isLoading,
//       permissionsError: error,
//       permissionsValidating: isValidating,
//       permissionsEmpty: !isLoading && !isValidating && !data?.length,
//       refetch: refetchData,
//     }),
//     [data, error, isLoading, isValidating]
//   );
//   return memoizedValue;
// }
