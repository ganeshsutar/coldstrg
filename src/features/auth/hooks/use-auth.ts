import { useCallback } from 'react';
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  fetchUserAttributes,
  resendSignUpCode,
} from 'aws-amplify/auth';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthUser, OrganizationWithRole } from '../types';

interface RegisterData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

// Mock organization for demo purposes
const mockOrganization: OrganizationWithRole = {
  id: 'mock-org-1',
  name: 'Demo Organization',
  nameHindi: 'डेमो संगठन',
  slug: 'demo-org',
  address: '123 Demo Street',
  city: 'Delhi',
  state: 'Delhi',
  phone: '+91 9876543210',
  email: 'demo@example.com',
  gstin: '07AAACR5055K1Z5',
  logoUrl: null,
  timezone: 'Asia/Kolkata',
  financialYearStart: 4,
  billingStatus: 'ACTIVE',
  settings: null,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  role: 'ADMIN',
  membershipId: 'mock-membership-1',
  isDefault: true,
};

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    organizations,
    currentOrganization,
    setUser,
    setIsLoading,
    setOrganizations,
    setCurrentOrganization,
    logout: storeLogout,
  } = useAuthStore();

  // Mock: Return dummy organization array
  const fetchOrganizations = useCallback(async (): Promise<OrganizationWithRole[]> => {
    return [mockOrganization];
  }, []);

  // Mock: Return dummy organization
  const createDefaultOrganization = useCallback(async (): Promise<OrganizationWithRole | null> => {
    return mockOrganization;
  }, []);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const cognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      const authUser: AuthUser = {
        userId: cognitoUser.userId,
        email: attributes.email || '',
        fullName: attributes.name || '',
        phoneNumber: attributes.phone_number,
        emailVerified: attributes.email_verified === 'true',
      };

      setUser(authUser);

      // Use mock organizations
      const orgs = await fetchOrganizations();
      setOrganizations(orgs);

      // Set current organization to mock
      const currentOrg = orgs[0] || null;

      if (currentOrg) {
        setCurrentOrganization(currentOrg);
      }

      return { user: authUser, organizations: orgs };
    } catch {
      setUser(null);
      setOrganizations([]);
      setCurrentOrganization(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrganizations, setCurrentOrganization, setIsLoading, setOrganizations, setUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await signIn({ username: email, password });

      if (result.isSignedIn) {
        return checkAuth();
      }

      return result;
    },
    [checkAuth]
  );

  const register = useCallback(async ({ fullName, email, phone, password }: RegisterData) => {
    const result = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name: fullName,
          ...(phone && { phone_number: phone }),
        },
      },
    });

    return result;
  }, []);

  const verifyEmail = useCallback(
    async (email: string, code: string) => {
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      return result;
    },
    []
  );

  const resendVerificationCode = useCallback(async (email: string) => {
    await resendSignUpCode({ username: email });
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const result = await resetPassword({ username: email });
    return result;
  }, []);

  const confirmNewPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    },
    []
  );

  const logout = useCallback(async () => {
    await signOut();
    storeLogout();
  }, [storeLogout]);

  // Mock: Just update state with selected org
  const switchOrganization = useCallback(
    async (organization: OrganizationWithRole) => {
      setCurrentOrganization(organization);
    },
    [setCurrentOrganization]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    organizations,
    currentOrganization,
    checkAuth,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    confirmNewPassword,
    logout,
    switchOrganization,
    createDefaultOrganization,
    fetchOrganizations,
  };
}
