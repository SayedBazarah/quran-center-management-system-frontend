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
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

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
  reports: {
    root: '/analytics/',
    logs: '/analytics/logs',
  },
  student: {
    new: '/students',
    list: '/students?all=true',
    update: '/students/:id',
    delete: '/students/:id',
    // -------------------
    pendingList: '/students/status/pending/list?sort=name&limit=1000',
    status: '/students/:id/status',
    // -------------------
    enroll: '/students/enrollment/create/:id', // Single enroll (just one students)
    acceptEnroll: '/enrollments/:enrollmentId/status', // Single enroll (just one students)

    // -------------------
    parent: '/students/parent',
    details: '/students/:id',
    updateEnroll: '/students/enrollment/update/:id', // Single enroll (just one students)
    enrollLog: '/enrollments/log/:id', // Single enroll (just one students)
    closeEnrollment: '/students/enrollment/close/:id', // Single enroll (just one students)
    pendingEnrollments: '/students/enrollment/pending?sort=name&limit=1000',
    acceptEnrollment: '/students/enrollment/accept/:id',
  },
  enrollments: {
    pendingLst: '/enrollments/pending?sort=name&limit=1000',
    create: '/enrollments/:id',
    update: '/enrollments/:id',
    studentList: '/enrollments/by-student/:studentId',
    createLog: '/enrollments/:studentId/:enrollmentId/log',
  },
  course: {
    new: '/courses',
    list: '/courses?sort=order&limit=1000',
    update: '/courses/:id',
    delete: '/courses/:id',
  },
  round: {
    new: '/round',
    list: '/round?sort=name&limit=1000',
    update: '/round/:id',
    details: '/round/:id',
    bulkEnroll: '/round/bulk-enroll', // Bulk enroll
  },
  teacher: {
    new: '/teachers',
    list: '/teachers?sort=name&limit=1000',
    update: '/teachers/:id',
    delete: '/teachers/:id',
  },
  admin: {
    list: '/admins?sort=name&limit=1000',
    new: '/admins',
    update: '/admins/:id',
    delete: '/admins/:id',
  },
  role: {
    list: '/roles?sort=name&limit=1000',
    new: '/roles',
    update: '/roles/:id',
    delete: '/roles/:id',
    permission: '/roles/permissions?sort=order&limit=1000',
  },
  branch: {
    list: '/branches?sort=name&limit=1000',
    new: '/branches',
    update: '/branches/:id',
    delete: '/branches/:id',
  },
};
