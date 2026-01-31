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
  fax?: string | null;
  gstNo?: string | null;
  panNo?: string | null;
  tanNo?: string | null;
  cinNo?: string | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
  bankIfsc?: string | null;
  bankBranch?: string | null;
  timezone?: string | null;
  financialYearStart?: number | null;
  financialYearEnd?: number | null;
  billingStatus?: "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELLED" | null;
  isActive?: boolean | null;
  // Setup wizard fields
  isConfigured?: boolean | null;
  configuredAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMembership {
  id: string;
  userId: string;
  email?: string | null;
  organizationId: string;
  role: "ADMIN" | "SUPERVISOR" | "OPERATOR";
  isDefault?: boolean | null;
  status?: "PENDING" | "ACTIVE" | "SUSPENDED" | null;
  joinedAt?: string | null;
  lastLoginAt?: string | null;
  // Module access
  moduleAccessAccounts?: boolean | null;
  moduleAccessColdStorageReports?: boolean | null;
  moduleAccessMISReports?: boolean | null;
  moduleAccessPayroll?: boolean | null;
  moduleAccessMultiRoom?: boolean | null;
  // Limits
  loanPerBagLimit?: number | null;
  backdateEntryDays?: number | null;
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
