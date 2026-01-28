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
