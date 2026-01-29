export const APP_NAME = "Cold Storage";

export const BILLING_STATUS = {
  TRIAL: "TRIAL",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  CANCELLED: "CANCELLED",
} as const;

export const MEMBERSHIP_ROLES = {
  ADMIN: "ADMIN",
  SUPERVISOR: "SUPERVISOR",
  OPERATOR: "OPERATOR",
} as const;

export const MEMBERSHIP_ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "OPERATOR", label: "Operator" },
] as const;

export const ROLE_BADGE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  SUPERVISOR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  OPERATOR: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export const AUDIT_ACTIONS = [
  { value: "CREATE", label: "Create" },
  { value: "UPDATE", label: "Update" },
  { value: "DELETE", label: "Delete" },
  { value: "LOGIN", label: "Login" },
  { value: "CONFIG", label: "Config" },
] as const;

export const ACTION_BADGE_COLORS: Record<string, string> = {
  CREATE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  UPDATE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  LOGIN: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  CONFIG: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export const SOFTWARE_MODES = [
  { value: "STANDARD", label: "Standard" },
  { value: "ADVANCED", label: "Advanced" },
] as const;

export const RENT_PROCESSING_MODES = [
  { value: "LEDGER", label: "Ledger" },
  { value: "BILL", label: "Bill" },
] as const;

export const DEFAULT_SYSTEM_CONFIG = {
  softwareMode: "STANDARD" as const,
  multiChamber: false,
  partialLot: false,
  mapRequired: false,
  separateVoucherNo: false,
  rentCalculationBasis: "MONTHLY",
  rentProcessingMode: "LEDGER" as const,
  additionalRentDays: 0,
  interestRate: 0,
  interestDaysInYear: 365,
  autoCalculateInterest: false,
  applyInterestOnRent: false,
  applyInterestOnLabor: false,
  applyInterestOnBardana: false,
  pkt1Name: "PKT1",
  pkt1Weight: 50,
  pkt2Name: "PKT2",
  pkt2Weight: 60,
  pkt3Name: "PKT3",
  pkt3Weight: 100,
  mixPackets: false,
  gradingRatePKT1: 0,
  gradingRatePKT2: 0,
  gradingRatePKT3: 0,
  loadingRatePKT1: 0,
  loadingRatePKT2: 0,
  loadingRatePKT3: 0,
  unloadingRatePKT1: 0,
  unloadingRatePKT2: 0,
  unloadingRatePKT3: 0,
  showBalance: true,
  showShadowBalance: false,
  searchOnName: true,
  searchOnCode: true,
  searchOnMobile: false,
};

export const MEMBERSHIP_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export const PARTY_TYPES = {
  KISSAN: "kissan",
  VYAPARI: "vyapari",
  AARTI: "aarti",
} as const;

export const VOUCHER_TYPES = {
  RECEIPT: "receipt",
  PAYMENT: "payment",
} as const;

export const PAYMENT_MODES = {
  CASH: "cash",
  BANK: "bank",
  UPI: "upi",
} as const;

export const COMMODITY_TYPES = [
  { value: "SEASONAL", label: "Seasonal" },
  { value: "REGULAR", label: "Regular" },
] as const;

export const RENT_BASIS = [
  { value: "QUINTAL", label: "Quintal" },
  { value: "PACKET", label: "Packet" },
  { value: "WEIGHT", label: "Weight" },
] as const;

export const RENT_ON = [
  { value: "QUANTITY", label: "Quantity (bags)" },
  { value: "WEIGHT", label: "Weight (quintals)" },
] as const;

export const CHARGE_RENT_TYPE = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "SEASONALLY", label: "Seasonally" },
  { value: "DAILY", label: "Daily" },
] as const;

export const RENT_CALCULATION_MODE = [
  { value: "NIKASI_TOTAL", label: "Nikasi Total" },
  { value: "SAUDA_BOLAN", label: "Sauda Bolan" },
] as const;

export const LABOR_RATE_TYPES = [
  { value: "LOADING", label: "Loading" },
  { value: "UNLOADING", label: "Unloading" },
  { value: "RELOADING", label: "Reloading" },
  { value: "GRADING", label: "Grading" },
  { value: "DUMPING", label: "Dumping" },
  { value: "DALA", label: "Dala" },
] as const;

export const SEED_BANKS = [
  { name: "State Bank of India", ifscPattern: "SBIN" },
  { name: "Punjab National Bank", ifscPattern: "PUNB" },
  { name: "Bank of Baroda", ifscPattern: "BARB" },
  { name: "Bank of India", ifscPattern: "BKID" },
  { name: "Canara Bank", ifscPattern: "CNRB" },
  { name: "Union Bank of India", ifscPattern: "UBIN" },
  { name: "Indian Bank", ifscPattern: "IDIB" },
  { name: "Central Bank of India", ifscPattern: "CBIN" },
  { name: "Indian Overseas Bank", ifscPattern: "IOBA" },
  { name: "UCO Bank", ifscPattern: "UCBA" },
  { name: "Bank of Maharashtra", ifscPattern: "MAHB" },
  { name: "Punjab & Sind Bank", ifscPattern: "PSIB" },
  { name: "HDFC Bank", ifscPattern: "HDFC" },
  { name: "ICICI Bank", ifscPattern: "ICIC" },
  { name: "Axis Bank", ifscPattern: "UTIB" },
  { name: "Kotak Mahindra Bank", ifscPattern: "KKBK" },
  { name: "IndusInd Bank", ifscPattern: "INDB" },
  { name: "Yes Bank", ifscPattern: "YESB" },
  { name: "IDBI Bank", ifscPattern: "IBKL" },
  { name: "Federal Bank", ifscPattern: "FDRL" },
  { name: "South Indian Bank", ifscPattern: "SIBL" },
  { name: "RBL Bank", ifscPattern: "RATN" },
  { name: "Bandhan Bank", ifscPattern: "BDBL" },
  { name: "IDFC First Bank", ifscPattern: "IDFB" },
  { name: "Jammu & Kashmir Bank", ifscPattern: "JAKA" },
  { name: "Karnataka Bank", ifscPattern: "KARB" },
  { name: "Karur Vysya Bank", ifscPattern: "KVBL" },
  { name: "City Union Bank", ifscPattern: "CIUB" },
  { name: "Tamilnad Mercantile Bank", ifscPattern: "TMBL" },
  { name: "DCB Bank", ifscPattern: "DCBL" },
  { name: "CSB Bank", ifscPattern: "CSBK" },
  { name: "Dhanlaxmi Bank", ifscPattern: "DLXB" },
  { name: "Lakshmi Vilas Bank", ifscPattern: "LAVB" },
  { name: "Nainital Bank", ifscPattern: "NTBL" },
  { name: "Saraswat Bank", ifscPattern: "SRCB" },
  { name: "Allahabad Bank", ifscPattern: "ALLA" },
  { name: "Andhra Bank", ifscPattern: "ANDB" },
  { name: "Corporation Bank", ifscPattern: "CORP" },
] as const;

export const SEED_COMMODITIES = [
  {
    name: "POTATO",
    commodityType: "SEASONAL" as const,
    rentRatePKT3: 62.5,
    gracePeriod: 0,
    rentBasis: "QUINTAL" as const,
    hsnCode: "07019000",
  },
];

export const SEED_GST_RATES = [
  { description: "Exempt", cgstRate: 0, sgstRate: 0, igstRate: 0 },
  { description: "GST 5%", cgstRate: 2.5, sgstRate: 2.5, igstRate: 5 },
  { description: "GST 12%", cgstRate: 6, sgstRate: 6, igstRate: 12 },
  { description: "GST 18%", cgstRate: 9, sgstRate: 9, igstRate: 18 },
  { description: "GST 28%", cgstRate: 14, sgstRate: 14, igstRate: 28 },
];

export const SEED_LABOR_RATES = [
  { rateType: "LOADING" as const, ratePKT1: 5.0 },
  { rateType: "UNLOADING" as const, ratePKT1: 5.0 },
  { rateType: "GRADING" as const, ratePKT1: 3.0 },
  { rateType: "RELOADING" as const, ratePKT1: 4.0 },
  { rateType: "DUMPING" as const, ratePKT1: 2.0 },
  { rateType: "DALA" as const, ratePKT1: 10.0 },
];

// ============== WAREHOUSE / CHAMBER CONSTANTS ==============

export const RACK_STATUS = {
  EMPTY: "EMPTY",
  PARTIAL: "PARTIAL",
  FULL: "FULL",
  RESERVED: "RESERVED",
  MAINTENANCE: "MAINTENANCE",
} as const;

export const RACK_STATUS_OPTIONS = [
  { value: "EMPTY", label: "Empty" },
  { value: "PARTIAL", label: "Partial" },
  { value: "FULL", label: "Full" },
  { value: "RESERVED", label: "Reserved" },
  { value: "MAINTENANCE", label: "Maintenance" },
] as const;

export const RACK_STATUS_COLORS: Record<string, string> = {
  EMPTY: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  PARTIAL: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  FULL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  RESERVED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  MAINTENANCE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export const RACK_STATUS_BG_COLORS: Record<string, string> = {
  EMPTY: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
  PARTIAL: "bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-700 dark:hover:bg-yellow-600",
  FULL: "bg-green-200 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600",
  RESERVED: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-600",
  MAINTENANCE: "bg-red-200 hover:bg-red-300 dark:bg-red-700 dark:hover:bg-red-600",
};

export const TEMPERATURE_STATUS = {
  NORMAL: "NORMAL",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
  OFFLINE: "OFFLINE",
} as const;

export const TEMPERATURE_STATUS_OPTIONS = [
  { value: "NORMAL", label: "Normal" },
  { value: "WARNING", label: "Warning" },
  { value: "CRITICAL", label: "Critical" },
  { value: "OFFLINE", label: "Offline" },
] as const;

export const TEMPERATURE_STATUS_COLORS: Record<string, string> = {
  NORMAL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  WARNING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  OFFLINE: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export const SHIFTING_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const SHIFTING_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const SHIFTING_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export const SHIFTING_REASONS = [
  { value: "MAINTENANCE", label: "Chamber Maintenance" },
  { value: "OPTIMIZATION", label: "Space Optimization" },
  { value: "TEMPERATURE", label: "Temperature Issues" },
  { value: "DISPATCH", label: "Preparing for Dispatch" },
  { value: "CONSOLIDATION", label: "Stock Consolidation" },
  { value: "OTHER", label: "Other" },
] as const;

export const DEFAULT_CHAMBER_CONFIG = {
  floors: 1,
  totalRacks: 100,
  racksPerRow: 10,
  rackCapacity: 100,
  targetTemperature: -18,
  minTemperature: -25,
  maxTemperature: -15,
};

export const TEMPERATURE_THRESHOLDS = {
  NORMAL_MAX: -15,
  WARNING_MAX: -10,
  CRITICAL_MAX: -5,
};

// ============== ACCOUNTING CONSTANTS ==============

export const ACCOUNT_TYPES = {
  GROUP: "GROUP",
  ACCOUNT: "ACCOUNT",
} as const;

export const ACCOUNT_TYPE_OPTIONS = [
  { value: "GROUP", label: "Group" },
  { value: "ACCOUNT", label: "Account" },
] as const;

export const ACCOUNT_NATURE = {
  DR: "DR",
  CR: "CR",
} as const;

export const ACCOUNT_NATURE_OPTIONS = [
  { value: "DR", label: "Debit" },
  { value: "CR", label: "Credit" },
] as const;

export const VOUCHER_TYPES_ENUM = {
  CR: "CR",
  DR: "DR",
  JV: "JV",
  CV: "CV",
  BH: "BH",
} as const;

export const VOUCHER_TYPE_OPTIONS = [
  { value: "CR", label: "Cash Receipt", shortLabel: "CR" },
  { value: "DR", label: "Cash Payment", shortLabel: "DR" },
  { value: "JV", label: "Journal Voucher", shortLabel: "JV" },
  { value: "CV", label: "Contra Voucher", shortLabel: "CV" },
  { value: "BH", label: "Bank", shortLabel: "BH" },
] as const;

export const VOUCHER_TYPE_COLORS: Record<string, string> = {
  CR: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  DR: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  JV: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  CV: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  BH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export const PAYMENT_MODE_ENUM = {
  CASH: "CASH",
  CHEQUE: "CHEQUE",
  BANK: "BANK",
  UPI: "UPI",
} as const;

export const PAYMENT_MODE_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "UPI", label: "UPI" },
] as const;

// Component colors for balance breakdown visualization
export const COMPONENT_COLORS = {
  rent: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    bar: "bg-blue-500",
  },
  loan: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    bar: "bg-amber-500",
  },
  bardana: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    bar: "bg-purple-500",
  },
  interest: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    bar: "bg-red-500",
  },
  other: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    bar: "bg-gray-500",
  },
} as const;

// Seed chart of accounts hierarchy
export const SEED_CHART_OF_ACCOUNTS = [
  // Assets
  { code: "1000", name: "Assets", accountType: "GROUP", nature: "DR", level: 0 },
  { code: "1100", name: "Current Assets", accountType: "GROUP", nature: "DR", level: 1, under: "1000" },
  { code: "1110", name: "Cash", accountType: "ACCOUNT", nature: "DR", level: 2, under: "1100" },
  { code: "1120", name: "Bank Accounts", accountType: "GROUP", nature: "DR", level: 2, under: "1100" },
  { code: "1130", name: "Sundry Debtors", accountType: "GROUP", nature: "DR", level: 2, under: "1100" },
  { code: "1200", name: "Fixed Assets", accountType: "GROUP", nature: "DR", level: 1, under: "1000" },

  // Liabilities
  { code: "2000", name: "Liabilities", accountType: "GROUP", nature: "CR", level: 0 },
  { code: "2100", name: "Current Liabilities", accountType: "GROUP", nature: "CR", level: 1, under: "2000" },
  { code: "2110", name: "Sundry Creditors", accountType: "GROUP", nature: "CR", level: 2, under: "2100" },
  { code: "2200", name: "Loans (Liability)", accountType: "GROUP", nature: "CR", level: 1, under: "2000" },

  // Capital
  { code: "3000", name: "Capital Account", accountType: "GROUP", nature: "CR", level: 0 },

  // Income
  { code: "4000", name: "Income", accountType: "GROUP", nature: "CR", level: 0 },
  { code: "4100", name: "Direct Income", accountType: "GROUP", nature: "CR", level: 1, under: "4000" },
  { code: "4110", name: "Rent Income", accountType: "ACCOUNT", nature: "CR", level: 2, under: "4100" },
  { code: "4120", name: "Labor Income", accountType: "ACCOUNT", nature: "CR", level: 2, under: "4100" },
  { code: "4130", name: "Interest Income", accountType: "ACCOUNT", nature: "CR", level: 2, under: "4100" },
  { code: "4200", name: "Indirect Income", accountType: "GROUP", nature: "CR", level: 1, under: "4000" },

  // Expenses
  { code: "5000", name: "Expenses", accountType: "GROUP", nature: "DR", level: 0 },
  { code: "5100", name: "Direct Expenses", accountType: "GROUP", nature: "DR", level: 1, under: "5000" },
  { code: "5110", name: "Labor Expense", accountType: "ACCOUNT", nature: "DR", level: 2, under: "5100" },
  { code: "5120", name: "Electricity Expense", accountType: "ACCOUNT", nature: "DR", level: 2, under: "5100" },
  { code: "5200", name: "Indirect Expenses", accountType: "GROUP", nature: "DR", level: 1, under: "5000" },
  { code: "5210", name: "Salary Expense", accountType: "ACCOUNT", nature: "DR", level: 2, under: "5200" },
  { code: "5220", name: "Rent Expense", accountType: "ACCOUNT", nature: "DR", level: 2, under: "5200" },
] as const;
