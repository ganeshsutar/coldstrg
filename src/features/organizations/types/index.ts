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
  gstNo?: string | null;
  timezone?: string | null;
  financialYearStart?: number | null;
  billingStatus?: "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELLED" | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMembership {
  id: string;
  userId: string;
  organizationId: string;
  role: "ADMIN" | "OPERATOR";
  isDefault?: boolean | null;
  status?: "PENDING" | "ACTIVE" | "SUSPENDED" | null;
  joinedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  organization?: Organization | null;
}

export interface OrganizationContextValue {
  currentOrganization: Organization | null;
  memberships: OrganizationMembership[];
  isLoading: boolean;
  error: string | null;
  setCurrentOrganization: (org: Organization) => void;
  refreshMemberships: () => Promise<void>;
  createDefaultOrganization: () => Promise<void>;
}
