import type { IBranchItem } from './admin';

export interface ITeacherItem {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  nationalId: string;
  nationalIdImg: string;
  avatar: string;
  username: string;

  branchId: IBranchItem;
}

export interface ITeacherTableFilters {
  name: string;
}
