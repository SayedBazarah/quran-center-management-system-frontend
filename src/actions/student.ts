import type { SWRConfiguration } from 'swr';
import type {
  IStudentItem,
  IEnrollmentItem,
  IEnrollmentLogItem,
  IEnrollmentWithStudent,
} from 'src/types/student';

import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetStudents() {
  const url = endpoints.student.list;
  const { data, isLoading, error, isValidating } = useSWR<{
    data: IEnrollmentWithStudent[];
  }>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      students: data?.data || [],
      studentsLoading: isLoading,
      studentsError: error,
      studentsValidating: isValidating,
      studentsEmpty: !isLoading && !isValidating && !data?.data?.length,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}
export function useGetPendingStudents() {
  const url = endpoints.student.pendingList;
  const { data, isLoading, error, isValidating } = useSWR<{
    data: IStudentItem[];
  }>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      students: data?.data || [],
      studentsLoading: isLoading,
      studentsError: error,
      studentsValidating: isValidating,
      studentsEmpty: !isLoading && !isValidating && !data?.data?.length,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

export function useGetStudentById(id: string) {
  const url = endpoints.student.details.replace(':id', id);

  const { data, isLoading, error, isValidating } = useSWR<{ data: IStudentItem }>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      student: (data?.data as IStudentItem) || [],
      studentLoading: isLoading,
      studentError: error,
      studentValidating: isValidating,
      studentEmpty: !isLoading && !isValidating && !data?.data,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}
export function useGetPendingEnrollments() {
  const url = endpoints.enrollments.pendingLst;

  const { data, isLoading, error, isValidating } = useSWR<{ data: IEnrollmentItem[] }>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);
  const memoizedValue = useMemo(
    () => ({
      enrollments: (data?.data as IEnrollmentItem[]) || [],
      enrollmentsLoading: isLoading,
      enrollmentsError: error,
      enrollmentsValidating: isValidating,
      enrollmentsEmpty: !isLoading && !isValidating && !data?.data,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

export function useGetStudentEnrollments(id: string) {
  const url = endpoints.enrollments.studentList.replace(':studentId', id);

  const { data, isLoading, error, isValidating } = useSWR<{ data: IEnrollmentItem[] }>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      enrollments: (data?.data as IEnrollmentItem[]) || [],
      enrollmentsLoading: isLoading,
      enrollmentsError: error,
      enrollmentsValidating: isValidating,
      enrollmentsEmpty: !isLoading && !isValidating && !data?.data,
      refetch: refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

export function useGetStudentLogs(id: string, params: { page: number; limit: number }) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  }).toString();
  const url = `${endpoints.student.logs.replace(':id', id)}?${query}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IEnrollmentLogItem[];
    total: number;
  }>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(() => {
    mutate(url);
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      logs: data?.data || [],
      logsLoading: isLoading,
      logsError: error,
      logsValidating: isValidating,
      total: data?.total || 0,
      refetch: refetchData,
    }),
    [data?.data, data?.total, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}
