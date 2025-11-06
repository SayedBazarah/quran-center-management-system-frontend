// src/lib/auth/roles.ts
export type Role = string;

export function getRolePermissions(role: Role): string[] {
  return [];
}
export function hasAnyRole(userRoles: Role[] | null | undefined, allowed: Role[] | Role): boolean {
  if (!userRoles?.length) return false;
  const allow = Array.isArray(allowed) ? allowed : [allowed];
  const set = new Set(userRoles);
  return allow.some((r) => set.has(r));
}
