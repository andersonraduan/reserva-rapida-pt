import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/store/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: UserRole | UserRole[];
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireRole, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuthStore();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};