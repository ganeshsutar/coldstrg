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

const schema = a.schema({
  // Billing status enum reference
  BillingStatus,
  MemberRole,
  MembershipStatus,
  CommodityType,
  RentBasis,
  LaborRateType,
  AuditAction,
  SoftwareMode,
  RentProcessingMode,
  AmadStatus,
  TransferStatus,

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
      rentRatePKT1: a.float(),
      rentRatePKT2: a.float(),
      rentRatePKT3: a.float(),
      rateWT: a.float(),
      gracePeriod: a.integer(),
      rentBasis: a.ref("RentBasis"),
      hsnCode: a.string(),
      loanRate: a.float(),
      isActive: a.boolean().default(true),
    })
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
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Amad model - Goods arrival record
  Amad: a
    .model({
      organizationId: a.id().required(),
      amadNo: a.integer().required(),
      date: a.date().required(),
      partyName: a.string().required(),
      villageName: a.string(),
      post: a.string(),
      district: a.string(),
      road: a.string(),
      floor: a.string(),
      room: a.string(),
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
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),

  // Rent model - Goods dispatch/Nikasi record
  Rent: a
    .model({
      organizationId: a.id().required(),
      serialNo: a.integer().required(),
      date: a.date().required(),
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
      fromPartyName: a.string(),
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
    .secondaryIndexes((index) => [index("organizationId")])
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
