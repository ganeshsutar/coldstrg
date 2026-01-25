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
import { client } from '@/lib/amplify';
import type { AuthUser, OrganizationWithRole, Organization } from '../types';

interface RegisterData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

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

  const fetchOrganizations = useCallback(
    async (userId: string): Promise<OrganizationWithRole[]> => {
      try {
        const { data: memberships } = await client.models.Membership.membershipsByUserId(
          { userId },
          { selectionSet: ['id', 'organizationId', 'role', 'isDefault'] }
        );

        if (!memberships || memberships.length === 0) {
          return [];
        }

        // Fetch organizations separately
        const orgsWithRoles: OrganizationWithRole[] = [];
        for (const m of memberships) {
          const { data: org } = await client.models.Organization.get({ id: m.organizationId });
          if (org) {
            orgsWithRoles.push({
              ...(org as unknown as Organization),
              role: m.role as 'ADMIN' | 'OPERATOR',
              membershipId: m.id,
              isDefault: m.isDefault ?? false,
            });
          }
        }

        return orgsWithRoles;
      } catch (error) {
        console.error('Error fetching organizations:', error);
        return [];
      }
    },
    []
  );

  const getUserSettings = useCallback(async (userId: string) => {
    try {
      const { data: settings } = await client.models.UserSettings.get({ userId });
      return settings;
    } catch {
      return null;
    }
  }, []);

  const updateLastOrganization = useCallback(async (userId: string, organizationId: string) => {
    try {
      const { data: existing } = await client.models.UserSettings.get({ userId });

      if (existing) {
        await client.models.UserSettings.update({
          userId,
          lastOrganizationId: organizationId,
        });
      } else {
        await client.models.UserSettings.create({
          userId,
          lastOrganizationId: organizationId,
        });
      }
    } catch (error) {
      console.error('Error updating last organization:', error);
    }
  }, []);

  const createDefaultOrganization = useCallback(
    async (userId: string, userName: string): Promise<OrganizationWithRole | null> => {
      try {
        // Create slug from name
        const slug = userName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .slice(0, 50) + '-org';

        // Create organization
        const { data: org } = await client.models.Organization.create({
          name: `${userName}'s Organization`,
          slug,
          isActive: true,
        });

        if (!org) {
          throw new Error('Failed to create organization');
        }

        // Create membership as ADMIN
        const { data: membership } = await client.models.Membership.create({
          userId,
          organizationId: org.id,
          role: 'ADMIN',
          status: 'ACTIVE',
          isDefault: true,
          joinedAt: new Date().toISOString(),
        });

        if (!membership) {
          throw new Error('Failed to create membership');
        }

        // Create user settings
        await client.models.UserSettings.create({
          userId,
          lastOrganizationId: org.id,
        });

        const orgData = org as unknown as Organization;
        return {
          ...orgData,
          role: 'ADMIN',
          membershipId: membership.id,
          isDefault: true,
        };
      } catch (error) {
        console.error('Error creating default organization:', error);
        return null;
      }
    },
    []
  );

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

      // Fetch organizations
      const orgs = await fetchOrganizations(cognitoUser.userId);
      setOrganizations(orgs);

      // Get user settings to find last organization
      const settings = await getUserSettings(cognitoUser.userId);

      // Set current organization based on priority:
      // 1. Last used organization
      // 2. Default organization
      // 3. First organization
      let currentOrg: OrganizationWithRole | null = null;

      if (settings?.lastOrganizationId) {
        currentOrg = orgs.find((o) => o.id === settings.lastOrganizationId) || null;
      }

      if (!currentOrg) {
        currentOrg = orgs.find((o) => o.isDefault) || orgs[0] || null;
      }

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
  }, [fetchOrganizations, getUserSettings, setCurrentOrganization, setIsLoading, setOrganizations, setUser]);

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

  const switchOrganization = useCallback(
    async (organization: OrganizationWithRole) => {
      setCurrentOrganization(organization);
      if (user) {
        await updateLastOrganization(user.userId, organization.id);
      }
    },
    [setCurrentOrganization, updateLastOrganization, user]
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
