export type MemberRole = 'ADMIN' | 'OPERATOR';
export type MemberStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';
export type Language = 'EN' | 'HI';
export type Theme = 'LIGHT' | 'DARK' | 'SYSTEM';
export type BillingStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

export interface Organization {
  id: string;
  name: string;
  nameHindi?: string | null;
  slug: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  email?: string | null;
  gstin?: string | null;
  logoUrl?: string | null;
  timezone?: string | null;
  financialYearStart?: number | null;
  billingStatus?: BillingStatus | null;
  settings?: Record<string, unknown> | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: MemberRole;
  status?: MemberStatus | null;
  isDefault?: boolean | null;
  joinedAt?: string | null;
  invitedBy?: string | null;
  invitedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  userId: string;
  lastOrganizationId?: string | null;
  preferredLanguage?: Language | null;
  theme?: Theme | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  emailVerified: boolean;
}

export interface OrganizationWithRole extends Organization {
  role: MemberRole;
  membershipId: string;
  isDefault: boolean;
}
