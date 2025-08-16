import { UserRole } from '@/store/auth';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  client: 1,
  professional: 2,
  space_admin: 3,
  master_admin: 4,
};

export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const canManageServices = (role: UserRole): boolean => {
  return hasPermission(role, 'professional');
};

export const canManageSpace = (role: UserRole): boolean => {
  return hasPermission(role, 'space_admin');
};

export const canManageSystem = (role: UserRole): boolean => {
  return hasPermission(role, 'master_admin');
};