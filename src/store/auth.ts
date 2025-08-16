import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'client' | 'professional' | 'space_admin' | 'master_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);