import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Billing status enum for organizations
const BillingStatus = a.enum(["TRIAL", "ACTIVE", "SUSPENDED", "CANCELLED"]);

// Role enum for organization memberships
const MemberRole = a.enum(["ADMIN", "OPERATOR"]);

// Membership status enum
const MembershipStatus = a.enum(["PENDING", "ACTIVE", "SUSPENDED"]);

const schema = a.schema({
  // Billing status enum reference
  BillingStatus,
  MemberRole,
  MembershipStatus,

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
      gstNo: a.string(),
      timezone: a.string().default("Asia/Kolkata"),
      financialYearStart: a.integer().default(4), // April
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
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
