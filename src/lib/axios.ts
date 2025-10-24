import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  withCredentials: true, // <-- send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Optional: Add token (if using auth)
 *
 *
 */
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong!';
    console.error('Axios error:', message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get<T>(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/me',
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
  },
  student: {
    new: '/student/create',
    parent: '/student/parent',
    list: '/student/list',
    update: '/student/update/:id',
    details: '/student/details/:id',
    enroll: '/student/enrollment/create/:id', // Single enroll (just one student)
    updateEnroll: '/student/enrollment/update/:id', // Single enroll (just one student)
    enrollLog: '/student/enrollment/log/:id', // Single enroll (just one student)
    closeEnrollment: '/student/enrollment/close/:id', // Single enroll (just one student)
    pendingEnrollments: '/student/enrollment/pending',
    acceptEnrollment: '/student/enrollment/accept/:id',
  },
  course: {
    new: '/course/create',
    list: '/course/list',
    update: '/course/update/:id',
    delete: '/course/delete/:id',
  },
  round: {
    new: '/round',
    list: '/round',
    update: '/round/:id',
    details: '/round/:id',
    bulkEnroll: '/round/bulk-enroll', // Bulk enroll
  },
  teacher: {
    new: '/teacher/create',
    list: '/teacher/list',
    update: '/teacher/update/:id',
    delete: '/teacher/delete/:id',
    details: '/teacher/details/:id',
  },
  admin: {
    list: '/admin/list',
    new: '/admin/create',
    update: '/admin/update/:id',
    details: '/admin/:id',
    delete: '/admin/delete/:id',
  },
  role: {
    list: '/role/list',
    new: '/role/create',
    update: '/role/update/:id',
    delete: '/role/delete/:id',
    details: '/role/:id',
    permission: '/role/permissions',
  },
  branch: {
    list: '/branch/list',
    new: '/branch/create',
    update: '/branch/update/:id',
    delete: '/branch/delete/:id',
    details: '/branch/:id',
    permission: '/branch/permissions',
  },
};
