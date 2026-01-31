import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Billing status enum for organizations
const BillingStatus = a.enum(["TRIAL", "ACTIVE", "SUSPENDED", "CANCELLED"]);

// Role enum for organization memberships
const MemberRole = a.enum(["ADMIN", "SUPERVISOR", "OPERATOR"]);

// Membership status enum
const MembershipStatus = a.enum(["PENDING", "ACTIVE", "SUSPENDED"]);

// Commodity type enum
const CommodityType = a.enum(["SEASONAL", "REGULAR"]);

// Rent basis enum
const RentBasis = a.enum(["QUINTAL", "PACKET", "WEIGHT"]);

// Rent on enum (what rent is charged on)
const RentOn = a.enum(["QUANTITY", "WEIGHT"]);

// Charge rent type enum (billing frequency)
const ChargeRentType = a.enum(["MONTHLY", "SEASONALLY", "DAILY"]);

// Rent calculation mode enum
const RentCalculationMode = a.enum(["NIKASI_TOTAL", "SAUDA_BOLAN"]);

// Labor rate type enum
const LaborRateType = a.enum([
  "LOADING",
  "UNLOADING",
  "RELOADING",
  "GRADING",
  "DUMPING",
  "DALA",
]);

// Audit action enum
const AuditAction = a.enum(["CREATE", "UPDATE", "DELETE", "LOGIN", "CONFIG"]);

// Software mode enum
const SoftwareMode = a.enum(["STANDARD", "ADVANCED"]);

// Rent processing mode enum
const RentProcessingMode = a.enum(["LEDGER", "BILL"]);

// Amad status enum
const AmadStatus = a.enum(["IN_STOCK", "PARTIAL_DISPATCH", "DISPATCHED", "PENDING"]);

// Stock transfer status enum
const TransferStatus = a.enum(["PENDING", "COMPLETED", "CANCELLED"]);

// Rack status enum for chamber management
const RackStatus = a.enum(["EMPTY", "PARTIAL", "FULL", "RESERVED", "MAINTENANCE"]);

// Temperature status enum
const TemperatureStatus = a.enum(["NORMAL", "WARNING", "CRITICAL", "OFFLINE"]);

// Shifting status enum
const ShiftingStatus = a.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);

// ============== BARDANA ENUMS ==============

// Bardana issue type enum (regular or advance)
const BardanaIssueType = a.enum(["REGULAR", "ADVANCE"]);

// Bardana transaction status enum
const BardanaStatus = a.enum(["DRAFT", "CONFIRMED", "CANCELLED"]);

// Bardana condition enum (for returns)
const BardanaCondition = a.enum(["GOOD", "FAIR", "DAMAGED", "UNUSABLE"]);

// ============== LOANS ENUMS ==============

// Advance status enum (pre-season advances)
const AdvanceStatus = a.enum(["PENDING", "CONVERTED", "ADJUSTED", "CLOSED"]);

// Loan status enum (loans against goods)
const LoanStatus = a.enum(["ACTIVE", "PARTIAL_REPAID", "CLOSED", "OVERDUE"]);

// Loan transaction type enum
const LoanTransactionType = a.enum(["DISBURSEMENT", "REPAYMENT", "INTEREST"]);

// ============== TRADING ENUMS ==============

// Deal (Sauda) status
const SaudaStatus = a.enum(["OPEN", "PARTIAL", "DISPATCHED", "CANCELLED", "COMPLETED"]);

// Gate pass status
const GatePassStatus = a.enum(["DRAFT", "PENDING", "DONE", "CANCELLED"]);

// Katai (grading) status
const KataiStatus = a.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);

// ============== BILLING ENUMS ==============

// Bill status enum
const BillStatus = a.enum([
  "DRAFT",
  "CONFIRMED",
  "PARTIAL_PAID",
  "PAID",
  "CANCELLED",
  "OVERDUE",
]);

// Receipt payment mode enum
const ReceiptPaymentMode = a.enum(["CASH", "CHEQUE", "BANK", "UPI"]);

// GST type enum (intra or inter state)
const GstType = a.enum(["INTRA_STATE", "INTER_STATE"]);

// Receipt status enum
const ReceiptStatus = a.enum(["DRAFT", "CONFIRMED", "CANCELLED"]);

// Price breakup component enum
const PriceComponent = a.enum([
  "RENT",
  "LOADING",
  "UNLOADING",
  "DALA",
  "KATAI",
  "INSURANCE",
  "RELOAD",
  "DUMP",
  "OTHER",
]);

// ============== PAYROLL ENUMS ==============

// Pay component type enum (fixed amount or percentage)
const PayComponentType = a.enum(["FIXED", "PERCENTAGE"]);

// Attendance status enum
const AttendanceStatus = a.enum([
  "PRESENT",
  "ABSENT",
  "HALF_DAY",
  "LEAVE",
  "HOLIDAY",
  "WEEKLY_OFF",
]);

// Salary process status enum
const SalaryProcessStatus = a.enum([
  "DRAFT",
  "PROCESSED",
  "APPROVED",
  "PAID",
  "CANCELLED",
]);

// Staff loan status enum
const StaffLoanStatus = a.enum(["ACTIVE", "COMPLETED", "CANCELLED"]);

// Employee status enum
const EmployeeStatus = a.enum(["ACTIVE", "ON_LEAVE", "RESIGNED", "TERMINATED"]);

// ============== ACCOUNTING ENUMS ==============

// Account type enum (Group or Account in chart of accounts)
const AccountType = a.enum(["GROUP", "ACCOUNT"]);

// Account nature enum (Debit or Credit)
const AccountNature = a.enum(["DR", "CR"]);

// Party type enum (classification for party accounts)
const PartyType = a.enum([
  "KISAN", "KISAN_D", "AARTI", "STAFF",
  "LOADING_CONTRACTOR", "CHATAI_CONTRACTOR",
  "MANDI", "FINANCER", "GUARANTOR", "OTHERS",
]);

// Voucher type enum
const VoucherType = a.enum(["CR", "DR", "JV", "CV", "BH"]);

// Payment mode enum
const PaymentMode = a.enum(["CASH", "CHEQUE", "BANK", "UPI"]);

const schema = a.schema({
  // Billing status enum reference
  BillingStatus,
  MemberRole,
  MembershipStatus,
  CommodityType,
  RentBasis,
  RentOn,
  ChargeRentType,
  RentCalculationMode,
  LaborRateType,
  AuditAction,
  SoftwareMode,
  RentProcessingMode,
  AmadStatus,
  TransferStatus,
  RackStatus,
  TemperatureStatus,
  ShiftingStatus,
  AccountType,
  AccountNature,
  PartyType,
  VoucherType,
  PaymentMode,
  BardanaIssueType,
  BardanaStatus,
  BardanaCondition,
  AdvanceStatus,
  LoanStatus,
  LoanTransactionType,
  SaudaStatus,
  GatePassStatus,
  KataiStatus,
  BillStatus,
  ReceiptPaymentMode,
  GstType,
  ReceiptStatus,
  PriceComponent,
  PayComponentType,
  AttendanceStatus,
  SalaryProcessStatus,
  StaffLoanStatus,
  EmployeeStatus,

  // Organization model - represents a cold storage facility/tenant
  Organization: a
    .model({
      name: a.string().required(),
      nameHindi: a.string(),
      slug: a.string().required(),
      address: a.string(),
      city: a.string(),
      state: a.string(),
      phone: a.string(),
      email: a.email(),
      fax: a.string(),
      gstNo: a.string(),
      panNo: a.string(),
      tanNo: a.string(),
      cinNo: a.string(),
      bankName: a.string(),
      bankAccountNo: a.string(),
      bankIfsc: a.string(),
      bankBranch: a.string(),
      timezone: a.string().default("Asia/Kolkata"),
      financialYearStart: a.integer().default(4), // April
      financialYearEnd: a.integer().default(3), // March
      billingStatus: a.ref("BillingStatus"),
      isActive: a.boolean().default(true),
      // Relationships
      memberships: a.hasMany("OrganizationMembership", "organizationId"),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("slug")])
    .authorization((allow) => [
      allow.authenticated(),
    ]),

  // Organization Membership - junction table for user-organization relationship
  OrganizationMembership: a
    .model({
      userId: a.string().required(), // Cognito user sub
      organizationId: a.id().required(),
      role: a.ref("MemberRole").required(),
      isDefault: a.boolean().default(false),
      status: a.ref("MembershipStatus"),
      joinedAt: a.datetime(),
      lastLoginAt: a.datetime(),
      // Module access
      moduleAccessAccounts: a.boolean().default(false),
      moduleAccessColdStorageReports: a.boolean().default(false),
      moduleAccessMISReports: a.boolean().default(false),
      moduleAccessPayroll: a.boolean().default(false),
      moduleAccessMultiRoom: a.boolean().default(false),
      // Limits
      loanPerBagLimit: a.float(),
      backdateEntryDays: a.integer(),
      // Relationships
      organization: a.belongsTo("Organization", "organizationId"),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("userId"),
      index("organizationId"),
    ])
    .authorization((allow) => [
      // Users can manage their own memberships
      allow.ownerDefinedIn("userId").to(["create", "read", "update", "delete"]),
      // Authenticated users can read memberships (for org admin views)
      allow.authenticated().to(["read"]),
    ]),

  // Commodity model - agricultural commodities stored in the facility
  Commodity: a
    .model({
      organizationId: a.id().required(),
      name: a.string().required(),
      nameHindi: a.string(),
      code: a.string().required(),
      commodityType: a.ref("CommodityType"),
      // Rent rates
      rentRatePKT1: a.float(),
      rentRatePKT2: a.float(),
      rentRatePKT3: a.float(),
      rateWT: a.float(),
      // Grace period settings
      gracePeriod: a.integer(),
      zeroRentDays: a.integer().default(0),
      halfRentDays: a.integer().default(0),
      // Rent calculation settings
      rentBasis: a.ref("RentBasis"),
      rentOn: a.ref("RentOn"),
      chargeRentType: a.ref("ChargeRentType"),
      rentCalculationMode: a.ref("RentCalculationMode"),
      // Pricing fields
      ratePerUnitField: a.float(),
      ratePerUnitMandi: a.float(),
      purchasePrice: a.float(),
      salePrice: a.float(),
      mrp: a.float(),
      loanRate: a.float(),
      // Stock & identification
      hsnCode: a.string(),
      barcode: a.string(),
      openingStock: a.integer().default(0),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Village model - flat village data with state/district for grouping
  Village: a
    .model({
      organizationId: a.id().required(),
      name: a.string().required(),
      nameHindi: a.string(),
      code: a.string().required(),
      stateName: a.string().required(),
      districtName: a.string().required(),
      pincode: a.string(),
      road: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Bank model - bank master data
  Bank: a
    .model({
      organizationId: a.id().required(),
      name: a.string().required(),
      code: a.string().required(),
      ifscPattern: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // GstRate model - GST rate configuration
  GstRate: a
    .model({
      organizationId: a.id().required(),
      cgstRate: a.float().required(),
      sgstRate: a.float().required(),
      igstRate: a.float().required(),
      hsnCode: a.string(),
      description: a.string(),
      effectiveDate: a.date().required(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // LaborRate model - labor rate history (append-only for history tracking)
  LaborRate: a
    .model({
      organizationId: a.id().required(),
      rateType: a.ref("LaborRateType").required(),
      ratePKT1: a.float().required(),
      ratePKT2: a.float(),
      ratePKT3: a.float(),
      effectiveDate: a.date().required(),
      reason: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // RolePermission model - permissions per role per organization
  RolePermission: a
    .model({
      organizationId: a.id().required(),
      role: a.ref("MemberRole").required(),
      // Basic permissions
      canAdd: a.boolean().default(false),
      canModify: a.boolean().default(false),
      canDelete: a.boolean().default(false),
      canPrint: a.boolean().default(false),
      canChangeSettings: a.boolean().default(false),
      // Module access
      accessInventory: a.boolean().default(false),
      accessAccounts: a.boolean().default(false),
      accessBilling: a.boolean().default(false),
      accessTrading: a.boolean().default(false),
      accessBardana: a.boolean().default(false),
      accessLoans: a.boolean().default(false),
      accessPayroll: a.boolean().default(false),
      accessReports: a.boolean().default(false),
      accessSystem: a.boolean().default(false),
      // Special permissions
      canBackdateEntry: a.boolean().default(false),
      canApproveLoans: a.boolean().default(false),
      canYearEndClose: a.boolean().default(false),
      canManageUsers: a.boolean().default(false),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // SystemConfig model - single configuration record per organization
  SystemConfig: a
    .model({
      organizationId: a.id().required(),
      // General settings
      softwareMode: a.ref("SoftwareMode"),
      multiChamber: a.boolean().default(false),
      partialLot: a.boolean().default(false),
      mapRequired: a.boolean().default(false),
      separateVoucherNo: a.boolean().default(false),
      // Rent settings
      rentCalculationBasis: a.string().default("MONTHLY"),
      rentProcessingMode: a.ref("RentProcessingMode"),
      additionalRentDays: a.integer().default(0),
      // Interest settings
      interestRate: a.float().default(0),
      interestDaysInYear: a.integer().default(365),
      autoCalculateInterest: a.boolean().default(false),
      applyInterestOnRent: a.boolean().default(false),
      applyInterestOnLabor: a.boolean().default(false),
      applyInterestOnBardana: a.boolean().default(false),
      // Packet settings
      pkt1Name: a.string().default("PKT1"),
      pkt1Weight: a.float().default(50),
      pkt2Name: a.string().default("PKT2"),
      pkt2Weight: a.float().default(60),
      pkt3Name: a.string().default("PKT3"),
      pkt3Weight: a.float().default(100),
      mixPackets: a.boolean().default(false),
      // Charge rates
      gradingRatePKT1: a.float().default(0),
      gradingRatePKT2: a.float().default(0),
      gradingRatePKT3: a.float().default(0),
      loadingRatePKT1: a.float().default(0),
      loadingRatePKT2: a.float().default(0),
      loadingRatePKT3: a.float().default(0),
      unloadingRatePKT1: a.float().default(0),
      unloadingRatePKT2: a.float().default(0),
      unloadingRatePKT3: a.float().default(0),
      // Display settings
      showBalance: a.boolean().default(true),
      showShadowBalance: a.boolean().default(false),
      searchOnName: a.boolean().default(true),
      searchOnCode: a.boolean().default(true),
      searchOnMobile: a.boolean().default(false),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // AuditLog model - append-only audit trail
  AuditLog: a
    .model({
      organizationId: a.id().required(),
      userId: a.string().required(),
      userName: a.string(),
      action: a.ref("AuditAction").required(),
      module: a.string(),
      details: a.string(),
      entityId: a.string(),
      entityType: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions", "get", "update", "delete"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Amad model - Goods arrival record
  Amad: a
    .model({
      organizationId: a.id().required(),
      amadNo: a.integer().required(),
      date: a.date().required(),
      partyId: a.string(),
      partyName: a.string().required(),
      villageName: a.string(),
      post: a.string(),
      district: a.string(),
      road: a.string(),
      floor: a.string(),
      room: a.string(),
      chamberId: a.id(),
      chamberName: a.string(),
      position: a.string(),
      commodityId: a.string(),
      commodityName: a.string(),
      variety: a.string(),
      pkt1: a.integer().default(0),
      pkt2: a.integer().default(0),
      pkt3: a.integer().default(0),
      pwt1: a.float().default(0),
      pwt2: a.float().default(0),
      pwt3: a.float().default(0),
      totalWeight: a.float().default(0),
      totalPackets: a.integer().default(0),
      mark1: a.string(),
      mark2: a.string(),
      partyMark: a.string(),
      dalaCharges: a.float(),
      rentRate: a.float(),
      graceDays: a.integer(),
      graceDays1: a.integer(),
      takpattiNo: a.integer(),
      eWayBillNo: a.string(),
      eWayBillDate: a.date(),
      transferRef: a.string(),
      status: a.ref("AmadStatus"),
      dispatchedPackets: a.integer().default(0),
      grading: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Rent model - Goods dispatch/Nikasi record
  Rent: a
    .model({
      organizationId: a.id().required(),
      serialNo: a.integer().required(),
      date: a.date().required(),
      partyId: a.string(),
      partyName: a.string().required(),
      amadId: a.string(),
      amadNo: a.integer(),
      receiverName: a.string(),
      pkt1: a.integer().default(0),
      pkt2: a.integer().default(0),
      pkt3: a.integer().default(0),
      totalPackets: a.integer().default(0),
      totalWeight: a.float().default(0),
      storageDays: a.integer(),
      rent: a.float(),
      rate: a.float(),
      amount: a.float(),
      loadingAmt: a.float(),
      unloadingAmt: a.float(),
      dumpingAmt: a.float(),
      vehicleNo: a.string(),
      cgst: a.float(),
      sgst: a.float(),
      igst: a.float(),
      billAmount: a.float(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Takpatti model - Weighment slip
  Takpatti: a
    .model({
      organizationId: a.id().required(),
      takpattiNo: a.integer().required(),
      amadNo: a.integer(),
      amadId: a.string(),
      date: a.date().required(),
      pkt1: a.integer().default(0),
      pkt2: a.integer().default(0),
      pkt3: a.integer().default(0),
      totalPackets: a.integer().default(0),
      totalWeight: a.float().default(0),
      serialNo: a.integer(),
      room: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // StockTransfer model - Transfer between rooms/parties
  StockTransfer: a
    .model({
      organizationId: a.id().required(),
      transferNo: a.integer().required(),
      date: a.date().required(),
      amadId: a.string(),
      amadNo: a.integer(),
      fromPartyId: a.string(),
      fromPartyName: a.string(),
      toPartyId: a.string(),
      toPartyName: a.string(),
      commodityName: a.string(),
      pkt1: a.integer().default(0),
      pkt2: a.integer().default(0),
      pkt3: a.integer().default(0),
      totalPackets: a.integer().default(0),
      totalWeight: a.float().default(0),
      sourceRoom: a.string(),
      destRoom: a.string(),
      status: a.ref("TransferStatus"),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Chamber model - Room/chamber configuration
  Chamber: a
    .model({
      organizationId: a.id().required(),
      code: a.string().required(),
      roomNumber: a.integer().required(),
      name: a.string().required(),
      nameHindi: a.string(),
      floors: a.integer().default(1),
      totalRacks: a.integer().default(0),
      racksPerRow: a.integer().default(10),
      rackCapacity: a.integer().default(100), // Bags per rack
      targetTemperature: a.float().default(-18),
      minTemperature: a.float().default(-25),
      maxTemperature: a.float().default(-15),
      currentTemperature: a.float(),
      temperatureStatus: a.ref("TemperatureStatus"),
      description: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // ChamberFloor model - Floor-wise rack configuration
  ChamberFloor: a
    .model({
      organizationId: a.id().required(),
      chamberId: a.id().required(),
      floorNumber: a.integer().required(),
      floorName: a.string(),
      fromRack: a.integer().required(),
      toRack: a.integer().required(),
      racksPerRow: a.integer().default(10),
      description: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("chamberId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // Loading model - Goods placement in racks
  Loading: a
    .model({
      organizationId: a.id().required(),
      loadingNo: a.integer().required(),
      date: a.date().required(),
      amadId: a.id().required(),
      amadNo: a.integer(),
      partyId: a.string(),
      partyName: a.string(),
      commodityName: a.string(),
      chamberId: a.id().required(),
      chamberName: a.string(),
      floorNumber: a.integer().required(),
      rackNumber: a.integer().required(),
      pkt1: a.integer().default(0),
      pkt2: a.integer().default(0),
      pkt3: a.integer().default(0),
      totalQuantity: a.integer().default(0),
      totalWeight: a.float().default(0),
      rackStatus: a.ref("RackStatus"),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("amadId"),
      index("chamberId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // Unloading model - Goods removal from racks
  Unloading: a
    .model({
      organizationId: a.id().required(),
      unloadingNo: a.integer().required(),
      date: a.date().required(),
      amadId: a.id().required(),
      amadNo: a.integer(),
      rentId: a.id(),
      rentSerialNo: a.integer(),
      partyId: a.string(),
      partyName: a.string(),
      commodityName: a.string(),
      chamberId: a.id().required(),
      chamberName: a.string(),
      floorNumber: a.integer().required(),
      rackNumber: a.integer().required(),
      pkt1: a.integer().default(0),
      pkt2: a.integer().default(0),
      pkt3: a.integer().default(0),
      totalQuantity: a.integer().default(0),
      totalWeight: a.float().default(0),
      vehicleNo: a.string(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("amadId"),
      index("chamberId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // ShiftingHeader model - Internal goods shifting transaction header
  ShiftingHeader: a
    .model({
      organizationId: a.id().required(),
      shiftNo: a.integer().required(),
      shiftDate: a.date().required(),
      fromChamberId: a.id().required(),
      fromChamberName: a.string(),
      toChamberId: a.id().required(),
      toChamberName: a.string(),
      totalItems: a.integer().default(0),
      totalQuantity: a.integer().default(0),
      status: a.ref("ShiftingStatus"),
      reason: a.string(),
      remarks: a.string(),
      completedAt: a.datetime(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Shifting model - Internal goods shifting detail lines
  Shifting: a
    .model({
      organizationId: a.id().required(),
      shiftingHeaderId: a.id().required(),
      amadId: a.id().required(),
      amadNo: a.integer(),
      partyId: a.string(),
      partyName: a.string(),
      commodityName: a.string(),
      fromChamberId: a.id().required(),
      fromFloorNumber: a.integer().required(),
      fromRackNumber: a.integer().required(),
      toChamberId: a.id().required(),
      toFloorNumber: a.integer().required(),
      toRackNumber: a.integer().required(),
      pkt1: a.integer().default(0),
      pkt2: a.integer().default(0),
      pkt3: a.integer().default(0),
      totalQuantity: a.integer().default(0),
      totalWeight: a.float().default(0),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("shiftingHeaderId"),
      index("amadId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // TemperatureLog model - Temperature readings
  TemperatureLog: a
    .model({
      organizationId: a.id().required(),
      chamberId: a.id().required(),
      chamberName: a.string(),
      date: a.date().required(),
      time: a.time().required(),
      lowTemp: a.float().required(),
      highTemp: a.float().required(),
      avgTemp: a.float(),
      humidity: a.float(),
      status: a.ref("TemperatureStatus"),
      recordedBy: a.string(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("chamberId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // MeterReading model - Electricity meter readings
  MeterReading: a
    .model({
      organizationId: a.id().required(),
      chamberId: a.id(),
      chamberName: a.string(),
      meterNumber: a.string(),
      readingDate: a.date().required(),
      readingTime: a.time(),
      previousReading: a.float(),
      currentReading: a.float().required(),
      consumption: a.float(),
      unit: a.string().default("kWh"),
      photoUrl: a.string(),
      recordedBy: a.string(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("chamberId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // ============== ACCOUNTING MODELS ==============

  // Account model - Chart of Accounts / Party Master
  Account: a
    .model({
      organizationId: a.id().required(),
      code: a.string().required(),
      name: a.string().required(),
      nameHindi: a.string(),
      accountType: a.ref("AccountType").required(),
      nature: a.ref("AccountNature").required(),
      parentId: a.string(),
      level: a.integer().default(0),
      under: a.string(),
      partyType: a.ref("PartyType"),
      // Address fields
      address1: a.string(),
      address2: a.string(),
      city: a.string(),
      state: a.string(),
      phone: a.string(),
      // Balances
      openingBalance: a.float().default(0),
      dr: a.float().default(0),
      cr: a.float().default(0),
      balance: a.float().default(0),
      // Component balances - Rent
      rentDr: a.float().default(0),
      rentCr: a.float().default(0),
      // Component balances - Bardana
      barDr: a.float().default(0),
      barCr: a.float().default(0),
      // Component balances - Loan
      loanDr: a.float().default(0),
      loanCr: a.float().default(0),
      // Component balances - Interest
      intrstDr: a.float().default(0),
      intrstCr: a.float().default(0),
      // Component balances - Other
      othDr: a.float().default(0),
      othCr: a.float().default(0),
      // Packets arrived
      pkt1A: a.integer().default(0),
      pkt2A: a.integer().default(0),
      pkt3A: a.integer().default(0),
      // Packets dispatched (Nikasi)
      pkt1N: a.integer().default(0),
      pkt2N: a.integer().default(0),
      pkt3N: a.integer().default(0),
      // Identity fields
      aadhar: a.string(),
      pan: a.string(),
      gst: a.string(),
      // Settings
      interestRate: a.float(),
      drLimit: a.float(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("parentId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // Voucher model - Daybook Transactions
  Voucher: a
    .model({
      organizationId: a.id().required(),
      voucherNo: a.integer().required(),
      voucherType: a.ref("VoucherType").required(),
      date: a.date().required(),
      // Debit account
      drAccountId: a.string(),
      drAccountCode: a.string(),
      drAccountName: a.string(),
      // Credit account
      crAccountId: a.string(),
      crAccountCode: a.string(),
      crAccountName: a.string(),
      // Amounts
      amount: a.float().required(),
      rentAmount: a.float().default(0),
      loanAmount: a.float().default(0),
      interestAmount: a.float().default(0),
      bardanaAmount: a.float().default(0),
      otherAmount: a.float().default(0),
      // Payment details
      paymentMode: a.ref("PaymentMode"),
      chequeNo: a.string(),
      chequeDate: a.date(),
      bankName: a.string(),
      // Meta
      narration: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("drAccountId"),
      index("crAccountId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // PartyLedger model - Transaction Ledger
  PartyLedger: a
    .model({
      organizationId: a.id().required(),
      srNo: a.integer().required(),
      accountId: a.string().required(),
      accountCode: a.string(),
      accountName: a.string(),
      voucherType: a.ref("VoucherType"),
      billNo: a.string(),
      date: a.date().required(),
      // Amounts
      amount: a.float().default(0),
      rent: a.float().default(0),
      loan: a.float().default(0),
      interest: a.float().default(0),
      bardana: a.float().default(0),
      other: a.float().default(0),
      // References
      amadId: a.string(),
      amadNo: a.integer(),
      rentId: a.string(),
      rentNo: a.integer(),
      gpNo: a.string(),
      // Bardana
      barQtyIn: a.integer().default(0),
      barQtyOut: a.integer().default(0),
      roi: a.float(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("accountId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // Daybook model - Daily Summary
  Daybook: a
    .model({
      organizationId: a.id().required(),
      date: a.date().required(),
      description: a.string(),
      // Cash balances
      cashOpenDr: a.float().default(0),
      cashOpenCr: a.float().default(0),
      cashDr: a.float().default(0),
      cashCr: a.float().default(0),
      cashCloseDr: a.float().default(0),
      cashCloseCr: a.float().default(0),
      // Bank balances
      bankOpenDr: a.float().default(0),
      bankOpenCr: a.float().default(0),
      bankDr: a.float().default(0),
      bankCr: a.float().default(0),
      bankCloseDr: a.float().default(0),
      bankCloseCr: a.float().default(0),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // ============== BARDANA MODELS ==============

  // BardanaType model - Master for bag types
  BardanaType: a
    .model({
      organizationId: a.id().required(),
      code: a.string().required(),
      name: a.string().required(),
      nameHindi: a.string(),
      defaultRate: a.float().default(0),
      unit: a.string().default("bags"),
      openingStock: a.integer().default(0),
      currentStock: a.integer().default(0),
      description: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // BardanaStock model - Party-wise stock balances (denormalized)
  BardanaStock: a
    .model({
      organizationId: a.id().required(),
      partyId: a.string().required(),
      partyName: a.string(),
      partyVillage: a.string(),
      bardanaTypeId: a.string().required(),
      bardanaTypeName: a.string(),
      totalIssued: a.integer().default(0),
      totalReturned: a.integer().default(0),
      balance: a.integer().default(0),
      totalValue: a.float().default(0),
      lastIssueDate: a.date(),
      lastReturnDate: a.date(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("partyId"),
      index("bardanaTypeId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // BardanaIssueHeader model - Issue voucher header
  BardanaIssueHeader: a
    .model({
      organizationId: a.id().required(),
      voucherNo: a.integer().required(),
      issueDate: a.date().required(),
      partyId: a.string().required(),
      partyName: a.string(),
      partyVillage: a.string(),
      issueType: a.ref("BardanaIssueType").required(),
      // Advance-specific fields
      interestRatePm: a.float(),
      expectedArrivalDate: a.date(),
      expectedBags: a.integer(),
      referenceNo: a.string(),
      // Linked Amad (optional)
      amadId: a.string(),
      amadNo: a.integer(),
      // Totals
      totalQuantity: a.integer().default(0),
      totalAmount: a.float().default(0),
      // Status
      status: a.ref("BardanaStatus").required(),
      confirmedAt: a.datetime(),
      confirmedBy: a.string(),
      narration: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("partyId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // BardanaIssueItem model - Issue line items
  BardanaIssueItem: a
    .model({
      organizationId: a.id().required(),
      issueHeaderId: a.id().required(),
      bardanaTypeId: a.string().required(),
      bardanaTypeName: a.string(),
      quantity: a.integer().required(),
      rate: a.float().required(),
      amount: a.float().required(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("issueHeaderId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // BardanaReceiptHeader model - Return voucher header
  BardanaReceiptHeader: a
    .model({
      organizationId: a.id().required(),
      voucherNo: a.integer().required(),
      receiptDate: a.date().required(),
      partyId: a.string().required(),
      partyName: a.string(),
      partyVillage: a.string(),
      // Linked Rent/Nikasi (optional)
      rentId: a.string(),
      rentSerialNo: a.integer(),
      // Totals
      totalQuantity: a.integer().default(0),
      totalGoodQuantity: a.integer().default(0),
      totalFairQuantity: a.integer().default(0),
      totalDamagedQuantity: a.integer().default(0),
      totalAmount: a.float().default(0),
      totalDeduction: a.float().default(0),
      netAmount: a.float().default(0),
      // Status
      status: a.ref("BardanaStatus").required(),
      confirmedAt: a.datetime(),
      confirmedBy: a.string(),
      narration: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("partyId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // BardanaReceiptItem model - Return line items
  BardanaReceiptItem: a
    .model({
      organizationId: a.id().required(),
      receiptHeaderId: a.id().required(),
      bardanaTypeId: a.string().required(),
      bardanaTypeName: a.string(),
      quantity: a.integer().required(),
      condition: a.ref("BardanaCondition").required(),
      rate: a.float().required(),
      creditRate: a.float().required(), // Adjusted rate based on condition
      amount: a.float().required(),
      deduction: a.float().default(0),
      netAmount: a.float().required(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("receiptHeaderId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // ============== LOANS MODELS ==============

  // Advance model - Pre-season advances to farmers
  Advance: a
    .model({
      organizationId: a.id().required(),
      advanceNo: a.integer().required(),
      date: a.date().required(),
      expectedDate: a.date(),
      partyId: a.string().required(),
      partyName: a.string(),
      expectedBags: a.integer(),
      amount: a.float().required(),
      interestRate: a.float().default(0),
      bardanaVoucherId: a.string(),
      paymentMode: a.ref("PaymentMode"),
      status: a.ref("AdvanceStatus").required(),
      narration: a.string(),
      convertedAmadId: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("partyId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // LoanAmount model - Loans against stored goods
  LoanAmount: a
    .model({
      organizationId: a.id().required(),
      loanNo: a.integer().required(),
      date: a.date().required(),
      partyId: a.string().required(),
      partyName: a.string(),
      amadId: a.string().required(),
      amadNo: a.integer(),
      collateralBags: a.integer(),
      disbursedAmount: a.float().required(),
      interestRate: a.float().default(0),
      repaidAmount: a.float().default(0),
      outstandingBalance: a.float().default(0),
      paymentMode: a.ref("PaymentMode"),
      status: a.ref("LoanStatus").required(),
      narration: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("partyId"),
      index("amadId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // LoanPartyLedger model - Loan transaction history
  LoanPartyLedger: a
    .model({
      organizationId: a.id().required(),
      serialNo: a.integer().required(),
      partyId: a.string().required(),
      date: a.date().required(),
      transactionType: a.ref("LoanTransactionType").required(),
      debitAmount: a.float().default(0),
      creditAmount: a.float().default(0),
      balance: a.float().default(0),
      interestRate: a.float(),
      amadId: a.string(),
      advanceId: a.string(),
      loanAmountId: a.string(),
      narration: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("partyId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // ============== TRADING MODELS ==============

  // Sauda model - Trading deals/contracts
  Sauda: a
    .model({
      organizationId: a.id().required(),
      saudaNo: a.integer().required(),
      saudaDate: a.date().required(),
      dueDate: a.date(),
      dueDays: a.integer().default(30),
      // Seller (Party with stock)
      sellerPartyId: a.string().required(),
      sellerPartyName: a.string(),
      sellerVillage: a.string(),
      // Buyer (Vyapari/Trader)
      buyerPartyId: a.string().required(),
      buyerPartyName: a.string(),
      buyerContact: a.string(),
      buyerLocation: a.string(),
      // Commodity details
      commodityId: a.string(),
      commodityName: a.string(),
      variety: a.string(), // Kism
      // Quantities
      quantity: a.integer().required(), // Total bags
      rate: a.float().required(), // Rate per quintal
      amount: a.float().default(0), // Calculated total
      // Progress tracking
      dispatchedQty: a.integer().default(0),
      balanceQty: a.integer().default(0),
      // Terms
      paymentTerms: a.string(),
      deliveryLocation: a.string(),
      // Status
      status: a.ref("SaudaStatus").required(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("sellerPartyId"),
      index("buyerPartyId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // GatePass model - Gate pass/delivery note header
  GatePass: a
    .model({
      organizationId: a.id().required(),
      gpNo: a.integer().required(),
      gpDate: a.date().required(),
      gpTime: a.string(), // Time of dispatch
      // Seller (Party dispatching)
      sellerPartyId: a.string().required(),
      sellerPartyName: a.string(),
      sellerVillage: a.string(),
      // Receiver (Buyer/Sakindar)
      buyerPartyId: a.string(),
      buyerPartyName: a.string(),
      buyerLocation: a.string(),
      // Link to deal (optional)
      saudaId: a.string(),
      saudaNo: a.integer(),
      // Transport details
      transport: a.string(),
      vehicleNo: a.string(),
      driverName: a.string(),
      driverContact: a.string(),
      biltiNo: a.string(), // Consignment note/LR number
      // Totals
      totalPkt1: a.integer().default(0),
      totalPkt2: a.integer().default(0),
      totalPkt3: a.integer().default(0),
      totalPackets: a.integer().default(0),
      totalWeight: a.float().default(0),
      rate: a.float(),
      amount: a.float().default(0),
      // Status
      status: a.ref("GatePassStatus").required(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("sellerPartyId"),
      index("saudaId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // GatePassDetail model - Gate pass line items (Amad-wise)
  GatePassDetail: a
    .model({
      organizationId: a.id().required(),
      gatePassId: a.id().required(),
      // Amad reference
      amadId: a.string().required(),
      amadNo: a.integer(),
      amadDate: a.date(),
      // Commodity info (denormalized)
      commodityName: a.string(),
      variety: a.string(),
      marks: a.string(), // Marka/identification
      // Quantities
      pkt1: a.integer().default(0),
      pkt2: a.integer().default(0),
      pkt3: a.integer().default(0),
      totalPackets: a.integer().default(0),
      weight: a.float().default(0),
      rate: a.float(),
      amount: a.float().default(0),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("gatePassId"),
      index("amadId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // Katai model - Grading/sorting records
  Katai: a
    .model({
      organizationId: a.id().required(),
      kataiNo: a.integer().required(),
      kataiDate: a.date().required(),
      // Party
      partyId: a.string().required(),
      partyName: a.string(),
      // Amad reference
      amadId: a.string().required(),
      amadNo: a.integer(),
      // Input
      bagsGraded: a.integer().required(),
      // Grading output (5 grades)
      motaBags: a.integer().default(0), // Large (>55mm)
      chattaBags: a.integer().default(0), // Medium (45-55mm)
      beejBags: a.integer().default(0), // Seed (<45mm)
      mixBags: a.integer().default(0), // Mixed
      gullaBags: a.integer().default(0), // Damaged/reject
      // Charges
      laborName: a.string(),
      laborRate: a.float().default(0),
      charges: a.float().default(0),
      // Status
      status: a.ref("KataiStatus").required(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("partyId"),
      index("amadId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // ============== BILLING MODELS ==============

  // RentBillHeader model - Rent bill with GST/TDS
  RentBillHeader: a
    .model({
      organizationId: a.id().required(),
      billNo: a.string().required(),
      billDate: a.date().required(),
      // Party details
      partyId: a.string().required(),
      partyName: a.string(),
      partyVillage: a.string(),
      partyGstin: a.string(),
      partyState: a.string(),
      // GST type
      gstType: a.ref("GstType"),
      // Charge amounts
      rentAmount: a.float().default(0),
      loadingCharges: a.float().default(0),
      unloadingCharges: a.float().default(0),
      dalaCharges: a.float().default(0),
      kataiCharges: a.float().default(0),
      insuranceAmount: a.float().default(0),
      reloadCharges: a.float().default(0),
      dumpCharges: a.float().default(0),
      otherCharges: a.float().default(0),
      // Tax calculation
      taxableAmount: a.float().default(0),
      cgstRate: a.float().default(0),
      cgstAmount: a.float().default(0),
      sgstRate: a.float().default(0),
      sgstAmount: a.float().default(0),
      igstRate: a.float().default(0),
      igstAmount: a.float().default(0),
      // Discounts and TDS
      discountAmount: a.float().default(0),
      tdsRate: a.float().default(0),
      tdsAmount: a.float().default(0),
      // Total amounts
      totalAmount: a.float().default(0),
      roundedAmount: a.float().default(0),
      roundOffAmount: a.float().default(0),
      amountInWords: a.string(),
      // Payment tracking
      status: a.ref("BillStatus"),
      paidAmount: a.float().default(0),
      balanceAmount: a.float().default(0),
      dueDate: a.date(),
      // Notes
      notes: a.string(),
      // Audit
      confirmedAt: a.datetime(),
      confirmedBy: a.string(),
      cancelledAt: a.datetime(),
      cancelledBy: a.string(),
      cancelReason: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("partyId"),
      index("billDate"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // RentBillItem model - Line items linking to Amads
  RentBillItem: a
    .model({
      organizationId: a.id().required(),
      rentBillId: a.id().required(),
      // Amad reference
      amadId: a.string().required(),
      amadNo: a.integer(),
      amadDate: a.date(),
      // Denormalized details
      commodityName: a.string(),
      partyName: a.string(),
      // Quantities
      pkt1: a.integer().default(0),
      pkt2: a.integer().default(0),
      pkt3: a.integer().default(0),
      bags: a.integer().default(0),
      weightQtl: a.float().default(0),
      // Billing period
      arrivalDate: a.date(),
      dispatchDate: a.date(),
      storageDays: a.integer().default(0),
      graceDays: a.integer().default(0),
      billableDays: a.integer().default(0),
      // Rate and amount
      ratePerQtl: a.float().default(0),
      ratePerBag: a.float().default(0),
      rentAmount: a.float().default(0),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("rentBillId"),
      index("amadId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // PriceBreakup model - Charge components
  PriceBreakup: a
    .model({
      organizationId: a.id().required(),
      rentBillId: a.id().required(),
      component: a.ref("PriceComponent").required(),
      description: a.string(),
      rate: a.float().default(0),
      quantity: a.float().default(0),
      unit: a.string(),
      amount: a.float().default(0),
      hsnCode: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("rentBillId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // Receipt model - Payment recording
  Receipt: a
    .model({
      organizationId: a.id().required(),
      receiptNo: a.string().required(),
      receiptDate: a.date().required(),
      // Party details
      partyId: a.string().required(),
      partyName: a.string(),
      // Payment details
      paymentMode: a.ref("ReceiptPaymentMode"),
      amount: a.float().required(),
      amountInWords: a.string(),
      // Cheque details
      chequeNo: a.string(),
      chequeDate: a.date(),
      bankName: a.string(),
      branchName: a.string(),
      isPdcCheque: a.boolean().default(false),
      isChequeCleared: a.boolean().default(false),
      chequeClearedDate: a.date(),
      // Bank transfer details
      upiRef: a.string(),
      bankRef: a.string(),
      // Narration
      narration: a.string(),
      // Status
      status: a.ref("ReceiptStatus"),
      confirmedAt: a.datetime(),
      confirmedBy: a.string(),
      cancelledAt: a.datetime(),
      cancelledBy: a.string(),
      cancelReason: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("partyId"),
      index("receiptDate"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // ReceiptAllocation model - Bill allocation
  ReceiptAllocation: a
    .model({
      organizationId: a.id().required(),
      receiptId: a.id().required(),
      rentBillId: a.id().required(),
      billNo: a.string(),
      allocatedAmount: a.float().required(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("receiptId"),
      index("rentBillId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // ============== PAYROLL MODELS ==============

  // PayPost model - Employee positions/designations with basic salary & leave entitlements
  PayPost: a
    .model({
      organizationId: a.id().required(),
      code: a.string().required(),
      name: a.string().required(),
      nameHindi: a.string(),
      basicSalary: a.float().default(0),
      // Leave entitlements
      casualLeave: a.integer().default(12),
      sickLeave: a.integer().default(12),
      earnedLeave: a.integer().default(15),
      // PF/ESI settings
      pfApplicable: a.boolean().default(true),
      esiApplicable: a.boolean().default(true),
      // Overtime settings
      otRate: a.float().default(0),
      otMultiplier: a.float().default(1.5),
      description: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // PayAllowance model - Master list of allowance types
  PayAllowance: a
    .model({
      organizationId: a.id().required(),
      code: a.string().required(),
      name: a.string().required(),
      nameHindi: a.string(),
      componentType: a.ref("PayComponentType").required(),
      defaultValue: a.float().default(0),
      // Calculation settings
      calculationBase: a.string(), // e.g., "BASIC" for percentage-based
      isTaxable: a.boolean().default(true),
      // Metadata
      description: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // PayDeduction model - Master list of deduction types
  PayDeduction: a
    .model({
      organizationId: a.id().required(),
      code: a.string().required(),
      name: a.string().required(),
      nameHindi: a.string(),
      componentType: a.ref("PayComponentType").required(),
      defaultValue: a.float().default(0),
      // Calculation settings
      calculationBase: a.string(), // e.g., "BASIC" for percentage-based
      isStatutory: a.boolean().default(false), // PF, ESI, TDS
      // Metadata
      description: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // PaySAllowance model - Staff-specific allowance configurations
  PaySAllowance: a
    .model({
      organizationId: a.id().required(),
      employeeId: a.id().required(),
      employeeCode: a.string(),
      employeeName: a.string(),
      allowanceId: a.id().required(),
      allowanceCode: a.string(),
      allowanceName: a.string(),
      componentType: a.ref("PayComponentType").required(),
      value: a.float().required(),
      effectiveFrom: a.date().required(),
      effectiveTo: a.date(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("employeeId"),
      index("allowanceId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // PaySDeduction model - Staff-specific deduction configurations
  PaySDeduction: a
    .model({
      organizationId: a.id().required(),
      employeeId: a.id().required(),
      employeeCode: a.string(),
      employeeName: a.string(),
      deductionId: a.id().required(),
      deductionCode: a.string(),
      deductionName: a.string(),
      componentType: a.ref("PayComponentType").required(),
      value: a.float().required(),
      effectiveFrom: a.date().required(),
      effectiveTo: a.date(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("employeeId"),
      index("deductionId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // PayIncrements model - Salary increment history with PF/ESI rates
  PayIncrements: a
    .model({
      organizationId: a.id().required(),
      employeeId: a.id().required(),
      employeeCode: a.string(),
      employeeName: a.string(),
      incrementDate: a.date().required(),
      // Previous values
      previousBasic: a.float().default(0),
      previousGross: a.float().default(0),
      // New values
      newBasic: a.float().required(),
      newGross: a.float().default(0),
      incrementAmount: a.float().default(0),
      incrementPercent: a.float().default(0),
      // PF/ESI rates at time of increment
      pfRate: a.float().default(12),
      esiRate: a.float().default(0.75),
      // Metadata
      reason: a.string(),
      approvedBy: a.string(),
      approvedAt: a.datetime(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("employeeId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // PaySATTN model - Monthly attendance summary and salary processing
  PaySATTN: a
    .model({
      organizationId: a.id().required(),
      employeeId: a.id().required(),
      employeeCode: a.string(),
      employeeName: a.string(),
      postId: a.id(),
      postName: a.string(),
      // Period
      year: a.integer().required(),
      month: a.integer().required(), // 1-12
      // Attendance summary
      totalDays: a.integer().default(0),
      workingDays: a.integer().default(0),
      presentDays: a.integer().default(0),
      absentDays: a.integer().default(0),
      halfDays: a.integer().default(0),
      leaveDays: a.integer().default(0),
      holidays: a.integer().default(0),
      weeklyOffs: a.integer().default(0),
      effectiveDays: a.float().default(0), // Present + (HalfDays * 0.5) + PaidLeaves
      // Overtime
      otHours: a.float().default(0),
      otAmount: a.float().default(0),
      // Salary breakdown
      basicSalary: a.float().default(0),
      grossSalary: a.float().default(0),
      totalAllowances: a.float().default(0),
      totalDeductions: a.float().default(0),
      // Statutory deductions
      pfAmount: a.float().default(0),
      esiAmount: a.float().default(0),
      tdsAmount: a.float().default(0),
      // Loan deductions
      loanDeduction: a.float().default(0),
      advanceDeduction: a.float().default(0),
      // Net pay
      netSalary: a.float().default(0),
      // Status
      status: a.ref("SalaryProcessStatus").required(),
      processedAt: a.datetime(),
      processedBy: a.string(),
      approvedAt: a.datetime(),
      approvedBy: a.string(),
      paidAt: a.datetime(),
      paidBy: a.string(),
      paymentMode: a.ref("PaymentMode"),
      paymentRef: a.string(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("employeeId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // PayLoan model - Staff loans with EMI tracking
  PayLoan: a
    .model({
      organizationId: a.id().required(),
      loanNo: a.integer().required(),
      loanDate: a.date().required(),
      employeeId: a.id().required(),
      employeeCode: a.string(),
      employeeName: a.string(),
      // Loan details
      loanAmount: a.float().required(),
      interestRate: a.float().default(0),
      tenure: a.integer().required(), // In months
      emiAmount: a.float().required(),
      // Payment tracking
      totalPaid: a.float().default(0),
      outstandingBalance: a.float().default(0),
      emisPaid: a.integer().default(0),
      emisRemaining: a.integer().default(0),
      // Dates
      startDate: a.date().required(),
      endDate: a.date(),
      lastEmiDate: a.date(),
      // Status
      status: a.ref("StaffLoanStatus").required(),
      // Metadata
      purpose: a.string(),
      approvedBy: a.string(),
      approvedAt: a.datetime(),
      narration: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("employeeId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // PayLedger model - Payroll transaction records
  PayLedger: a
    .model({
      organizationId: a.id().required(),
      serialNo: a.integer().required(),
      date: a.date().required(),
      employeeId: a.id().required(),
      employeeCode: a.string(),
      employeeName: a.string(),
      // Transaction type
      transactionType: a.string().required(), // SALARY, ADVANCE, LOAN_DISBURSEMENT, LOAN_REPAYMENT, BONUS
      // Reference
      referenceId: a.string(), // PaySATTN ID or PayLoan ID
      referenceNo: a.string(),
      // Amounts
      debitAmount: a.float().default(0), // Employee owes
      creditAmount: a.float().default(0), // Company pays
      balance: a.float().default(0),
      // Period (for salary entries)
      year: a.integer(),
      month: a.integer(),
      // Payment details
      paymentMode: a.ref("PaymentMode"),
      paymentRef: a.string(),
      narration: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("employeeId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // DWage model - Daily wage worker entries
  DWage: a
    .model({
      organizationId: a.id().required(),
      serialNo: a.integer().required(),
      date: a.date().required(),
      // Worker details
      workerName: a.string().required(),
      workerContact: a.string(),
      workType: a.string(), // Loading, Unloading, Grading, etc.
      // Work details
      hoursWorked: a.float().default(0),
      ratePerHour: a.float().default(0),
      unitsCompleted: a.integer().default(0),
      ratePerUnit: a.float().default(0),
      // Payment
      grossAmount: a.float().default(0),
      deductions: a.float().default(0),
      netAmount: a.float().default(0),
      // Status
      isPaid: a.boolean().default(false),
      paidAt: a.datetime(),
      paymentMode: a.ref("PaymentMode"),
      paymentRef: a.string(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Employee model - Staff/Employee master (extends Account for party linkage)
  Employee: a
    .model({
      organizationId: a.id().required(),
      code: a.string().required(),
      // Personal details
      firstName: a.string().required(),
      lastName: a.string(),
      nameHindi: a.string(),
      fatherName: a.string(),
      dateOfBirth: a.date(),
      gender: a.string(), // M, F, O
      maritalStatus: a.string(),
      // Contact
      phone: a.string(),
      email: a.email(),
      address: a.string(),
      city: a.string(),
      state: a.string(),
      pincode: a.string(),
      // Identity
      aadharNo: a.string(),
      panNo: a.string(),
      // Employment details
      postId: a.id(),
      postName: a.string(),
      joiningDate: a.date().required(),
      confirmationDate: a.date(),
      resignationDate: a.date(),
      relievingDate: a.date(),
      // Bank details
      bankName: a.string(),
      bankAccountNo: a.string(),
      bankIfsc: a.string(),
      bankBranch: a.string(),
      // Salary
      basicSalary: a.float().default(0),
      grossSalary: a.float().default(0),
      // PF/ESI
      pfNo: a.string(),
      esiNo: a.string(),
      uanNo: a.string(),
      pfApplicable: a.boolean().default(true),
      esiApplicable: a.boolean().default(true),
      // Leave balances
      casualLeaveBalance: a.float().default(0),
      sickLeaveBalance: a.float().default(0),
      earnedLeaveBalance: a.float().default(0),
      // Status
      status: a.ref("EmployeeStatus").required(),
      remarks: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("postId"),
    ])
    .authorization((allow) => [allow.authenticated()]),

  // Attendance model - Daily attendance records
  Attendance: a
    .model({
      organizationId: a.id().required(),
      employeeId: a.id().required(),
      employeeCode: a.string(),
      employeeName: a.string(),
      date: a.date().required(),
      status: a.ref("AttendanceStatus").required(),
      // Time tracking (optional)
      inTime: a.time(),
      outTime: a.time(),
      hoursWorked: a.float().default(0),
      // Overtime
      otHours: a.float().default(0),
      // Leave details (if on leave)
      leaveType: a.string(), // CL, SL, EL, LWP
      // Remarks
      remarks: a.string(),
      markedBy: a.string(),
      isActive: a.boolean().default(true),
    })
    .disableOperations(["subscriptions"])
    .secondaryIndexes((index) => [
      index("organizationId"),
      index("employeeId"),
    ])
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
