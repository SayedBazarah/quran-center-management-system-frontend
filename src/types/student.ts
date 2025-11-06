import type { ICourseItem } from './course';
import type { ITeacherItem } from './teacher';
import type { IAdminItem, IBranchItem } from './admin';
export enum StudentStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  LATE = 'late',
  DROPOUT = 'dropout',
  GRADUATED = 'graduated',
  REJECTED = 'rejected',
}

export interface IEnrollmentItem {
  _id: string;
  id: string;
  status: EnrollmentStatus;
  startDate: string;
  endDate: string;
  courseId: ICourseItem;
  teacherId: ITeacherItem;
  adminId: IAdminItem;
  logs: IEnrollmentLogItem[];
  studentId: IStudentItem;
  createdBy: IAdminItem;
  rejectionReason?: string;
  rejectedBy?: IAdminItem;
  rejectedAt?: string;
  acceptedBy?: IAdminItem;
  acceptedAt?: string;
}

export interface IStudentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string | number | null;
  address: string;
  nationalId: string;
  age?: number;
  avatar: string;
  nationalIdImg: string;
  status: string;

  teacherId: ITeacherItem;
  adminId: IAdminItem;
  createdBy: IAdminItem;
  branchId: IBranchItem;
  enrollments: IEnrollmentItem[];
  parent: IParentItem;
  fired: boolean;
  firedAt: string;
  firedBy: IAdminItem;
  graduated: string;
  enrollmentLogs: IEnrollmentLogItem[];
  createdAt: string;
}

export interface IEnrollmentWithStudent {
  student: IStudentItem;
  currentEnrollment: Partial<IEnrollmentItem>;
  enrollments: Partial<IEnrollmentItem>[];
}
export interface IStudentTableFilters {
  name: string;
  teacher: string[];
  admin: string[];
  branch: string[];
  enrollmentStatus: string[];
  status: string;
}

export interface IParentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  nationalId: string;
  nationalIdImg: string;
  relationship: string;
}

export interface IEnrollmentLogItem {
  id: string;
  action: string;
  note: string;
  student: IStudentItem;
  enrollmentId: IEnrollmentItem;
  adminId: IAdminItem;
  createdAt: string;
}
export enum EnrollmentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  LATE = 'late',
  DROPOUT = 'dropout',
  GRADUATED = 'graduated',
  REJECTED = 'rejected',
}

export type EnrollmentStatusType = keyof typeof EnrollmentStatus;

// I want value to be the key of the enum
export const EnrollmentStatusList = [
  { value: EnrollmentStatus.PENDING, label: 'بنتظار القبول', disabled: true },
  { value: EnrollmentStatus.DROPOUT, label: 'انقطع' },
  { value: EnrollmentStatus.LATE, label: 'متأخر', disabled: true },
  { value: EnrollmentStatus.GRADUATED, label: 'انتهي من الدورة' },
  { value: EnrollmentStatus.REJECTED, label: 'مرفوض', disabled: true },
  { value: EnrollmentStatus.ACTIVE, label: 'يدرس' }, // default
];

// Create display name mapping
export const EnrollmentStatusLabels: Record<EnrollmentStatus, string> = {
  [EnrollmentStatus.PENDING]: 'بنتظار القبول',
  [EnrollmentStatus.ACTIVE]: 'يدرس',
  [EnrollmentStatus.LATE]: 'متاخر',
  [EnrollmentStatus.REJECTED]: 'مرفوض',
  [EnrollmentStatus.DROPOUT]: 'سقط',
  [EnrollmentStatus.GRADUATED]: 'انتهي من المرحلة',
} as const;
