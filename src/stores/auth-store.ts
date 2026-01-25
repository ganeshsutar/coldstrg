import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, OrganizationWithRole } from '@/features/auth/types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  organizations: OrganizationWithRole[];
  currentOrganization: OrganizationWithRole | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setOrganizations: (organizations: OrganizationWithRole[]) => void;
  setCurrentOrganization: (organization: OrganizationWithRole | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      organizations: [],
      currentOrganization: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setIsLoading: (isLoading) => set({ isLoading }),

      setOrganizations: (organizations) => set({ organizations }),

      setCurrentOrganization: (currentOrganization) =>
        set({ currentOrganization }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          organizations: [],
          currentOrganization: null,
        }),
    }),
    {
      name: 'coldvault-auth',
      partialize: (state) => ({
        currentOrganization: state.currentOrganization,
      }),
    }
  )
);
