export type WizardStep = 1 | 2 | 3 | 4;

export type SeedingStatus = "pending" | "seeding" | "done" | "error";

export interface TableProgress {
  total: number;
  completed: number;
  skipped: number;
  status: SeedingStatus;
  currentItem?: string;
  error?: string;
}

export interface SeedingProgress {
  systemConfig: TableProgress;
  rolePermissions: TableProgress;
  gstRates: TableProgress;
  laborRates: TableProgress;
  accounts: TableProgress;
  banks: TableProgress;
  commodities: TableProgress;
}

export interface WizardFormData {
  // Step 1 - Organization Details
  name: string;
  nameHindi: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;

  // Step 2 - Business Registration
  gstNo: string;
  panNo: string;
  financialYearStart: number;
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankBranch: string;

  // Step 3 - System Settings
  softwareMode: "STANDARD" | "ADVANCED";
  rentProcessingMode: "LEDGER" | "BILL";
  multiChamber: boolean;
  partialLot: boolean;
  mapRequired: boolean;
  pkt1Name: string;
  pkt1Weight: number;
  pkt2Name: string;
  pkt2Weight: number;
  pkt3Name: string;
  pkt3Weight: number;
}

export interface WizardState extends WizardFormData {
  step: WizardStep;
  isSeeding: boolean;
  seedingComplete: boolean;
  seedingProgress: SeedingProgress;
}

export const INITIAL_SEEDING_PROGRESS: SeedingProgress = {
  systemConfig: { total: 1, completed: 0, skipped: 0, status: "pending" },
  rolePermissions: { total: 3, completed: 0, skipped: 0, status: "pending" },
  gstRates: { total: 5, completed: 0, skipped: 0, status: "pending" },
  laborRates: { total: 6, completed: 0, skipped: 0, status: "pending" },
  accounts: { total: 56, completed: 0, skipped: 0, status: "pending" },
  banks: { total: 39, completed: 0, skipped: 0, status: "pending" },
  commodities: { total: 1, completed: 0, skipped: 0, status: "pending" },
};

export const INITIAL_WIZARD_FORM_DATA: WizardFormData = {
  // Step 1
  name: "",
  nameHindi: "",
  address: "",
  city: "",
  state: "",
  phone: "",
  email: "",

  // Step 2
  gstNo: "",
  panNo: "",
  financialYearStart: 4, // April
  bankName: "",
  bankAccountNo: "",
  bankIfsc: "",
  bankBranch: "",

  // Step 3
  softwareMode: "STANDARD",
  rentProcessingMode: "LEDGER",
  multiChamber: false,
  partialLot: false,
  mapRequired: false,
  pkt1Name: "PKT1",
  pkt1Weight: 50,
  pkt2Name: "PKT2",
  pkt2Weight: 60,
  pkt3Name: "PKT3",
  pkt3Weight: 100,
};

export const INITIAL_WIZARD_STATE: WizardState = {
  ...INITIAL_WIZARD_FORM_DATA,
  step: 1,
  isSeeding: false,
  seedingComplete: false,
  seedingProgress: INITIAL_SEEDING_PROGRESS,
};

// List of Indian states for dropdown
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

// Months for financial year start dropdown
export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const;

// Total records to be seeded
export const TOTAL_SEED_RECORDS =
  INITIAL_SEEDING_PROGRESS.systemConfig.total +
  INITIAL_SEEDING_PROGRESS.rolePermissions.total +
  INITIAL_SEEDING_PROGRESS.gstRates.total +
  INITIAL_SEEDING_PROGRESS.laborRates.total +
  INITIAL_SEEDING_PROGRESS.accounts.total +
  INITIAL_SEEDING_PROGRESS.banks.total +
  INITIAL_SEEDING_PROGRESS.commodities.total;
