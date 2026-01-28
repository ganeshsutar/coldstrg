import type { OrganizationMembership } from "@/features/organizations/types";

// Member types for user management
export interface MemberWithDetails extends OrganizationMembership {
  displayName?: string;
  email?: string;
}

export interface UpdateMemberInput {
  id: string;
  organizationId: string;
  role?: "ADMIN" | "SUPERVISOR" | "OPERATOR";
  status?: "PENDING" | "ACTIVE" | "SUSPENDED";
  moduleAccessAccounts?: boolean;
  moduleAccessColdStorageReports?: boolean;
  moduleAccessMISReports?: boolean;
  moduleAccessPayroll?: boolean;
  moduleAccessMultiRoom?: boolean;
  loanPerBagLimit?: number | null;
  backdateEntryDays?: number | null;
}

// Role permission types
export interface RolePermission {
  id: string;
  organizationId: string;
  role: "ADMIN" | "SUPERVISOR" | "OPERATOR";
  // Basic permissions
  canAdd: boolean;
  canModify: boolean;
  canDelete: boolean;
  canPrint: boolean;
  canChangeSettings: boolean;
  // Module access
  accessInventory: boolean;
  accessAccounts: boolean;
  accessBilling: boolean;
  accessTrading: boolean;
  accessBardana: boolean;
  accessLoans: boolean;
  accessPayroll: boolean;
  accessReports: boolean;
  accessSystem: boolean;
  // Special permissions
  canBackdateEntry: boolean;
  canApproveLoans: boolean;
  canYearEndClose: boolean;
  canManageUsers: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRolePermissionInput {
  organizationId: string;
  role: "ADMIN" | "SUPERVISOR" | "OPERATOR";
  canAdd?: boolean;
  canModify?: boolean;
  canDelete?: boolean;
  canPrint?: boolean;
  canChangeSettings?: boolean;
  accessInventory?: boolean;
  accessAccounts?: boolean;
  accessBilling?: boolean;
  accessTrading?: boolean;
  accessBardana?: boolean;
  accessLoans?: boolean;
  accessPayroll?: boolean;
  accessReports?: boolean;
  accessSystem?: boolean;
  canBackdateEntry?: boolean;
  canApproveLoans?: boolean;
  canYearEndClose?: boolean;
  canManageUsers?: boolean;
}

export interface UpdateRolePermissionInput extends CreateRolePermissionInput {
  id: string;
}

// System config types
export interface SystemConfig {
  id: string;
  organizationId: string;
  // General
  softwareMode?: "STANDARD" | "ADVANCED" | null;
  multiChamber?: boolean | null;
  partialLot?: boolean | null;
  mapRequired?: boolean | null;
  separateVoucherNo?: boolean | null;
  // Rent
  rentCalculationBasis?: string | null;
  rentProcessingMode?: "LEDGER" | "BILL" | null;
  additionalRentDays?: number | null;
  // Interest
  interestRate?: number | null;
  interestDaysInYear?: number | null;
  autoCalculateInterest?: boolean | null;
  applyInterestOnRent?: boolean | null;
  applyInterestOnLabor?: boolean | null;
  applyInterestOnBardana?: boolean | null;
  // Packets
  pkt1Name?: string | null;
  pkt1Weight?: number | null;
  pkt2Name?: string | null;
  pkt2Weight?: number | null;
  pkt3Name?: string | null;
  pkt3Weight?: number | null;
  mixPackets?: boolean | null;
  // Charges
  gradingRatePKT1?: number | null;
  gradingRatePKT2?: number | null;
  gradingRatePKT3?: number | null;
  loadingRatePKT1?: number | null;
  loadingRatePKT2?: number | null;
  loadingRatePKT3?: number | null;
  unloadingRatePKT1?: number | null;
  unloadingRatePKT2?: number | null;
  unloadingRatePKT3?: number | null;
  // Display
  showBalance?: boolean | null;
  showShadowBalance?: boolean | null;
  searchOnName?: boolean | null;
  searchOnCode?: boolean | null;
  searchOnMobile?: boolean | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSystemConfigInput {
  id: string;
  organizationId: string;
  softwareMode?: "STANDARD" | "ADVANCED";
  multiChamber?: boolean;
  partialLot?: boolean;
  mapRequired?: boolean;
  separateVoucherNo?: boolean;
  rentCalculationBasis?: string;
  rentProcessingMode?: "LEDGER" | "BILL";
  additionalRentDays?: number;
  interestRate?: number;
  interestDaysInYear?: number;
  autoCalculateInterest?: boolean;
  applyInterestOnRent?: boolean;
  applyInterestOnLabor?: boolean;
  applyInterestOnBardana?: boolean;
  pkt1Name?: string;
  pkt1Weight?: number;
  pkt2Name?: string;
  pkt2Weight?: number;
  pkt3Name?: string;
  pkt3Weight?: number;
  mixPackets?: boolean;
  gradingRatePKT1?: number;
  gradingRatePKT2?: number;
  gradingRatePKT3?: number;
  loadingRatePKT1?: number;
  loadingRatePKT2?: number;
  loadingRatePKT3?: number;
  unloadingRatePKT1?: number;
  unloadingRatePKT2?: number;
  unloadingRatePKT3?: number;
  showBalance?: boolean;
  showShadowBalance?: boolean;
  searchOnName?: boolean;
  searchOnCode?: boolean;
  searchOnMobile?: boolean;
}

// Audit log types
export type AuditActionType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "CONFIG";

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  userName?: string | null;
  action: AuditActionType;
  module?: string | null;
  details?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuditLogInput {
  organizationId: string;
  userId: string;
  userName?: string;
  action: AuditActionType;
  module?: string;
  details?: string;
  entityId?: string;
  entityType?: string;
}

// UI helper types
export interface PermissionRow {
  key: string;
  label: string;
  section: "basic" | "module" | "special";
}

export type ConfigSubTab = "general" | "rent" | "interest" | "packets" | "charges" | "display";
