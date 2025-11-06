export interface IAdminItem {
  id: string;
  avatar: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  nationalId: string;
  nationalIdImg: string;
  roleId: IRoleItem;
  branchIds: IBranchItem[] | string[];
}

export interface IAdminTableFilters {
  name: string;
}

export interface IRoleItem {
  id: string;
  name: string;
  isDefault?: boolean;
  permissions?: {
    code: string;
  }[];
}

export interface IRoleTableFilters {
  name: string;
}

export interface IBranchItem {
  id: string;
  name: string;
  phone?: string;
  address?: string;
}
export interface IBranchTableFilters {
  name: string;
}
