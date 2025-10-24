import type { IRoleItem, IAdminItem, IBranchItem } from 'src/types/admin';

export type UserType = {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  role: IRoleItem;
  branch: IBranchItem;
} | null;

export type AuthState = {
  user: IAdminItem | null;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
