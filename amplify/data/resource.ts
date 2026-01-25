import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Enums
const BillingStatus = a.enum(['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED']);
const MemberRole = a.enum(['ADMIN', 'OPERATOR']);
const MemberStatus = a.enum(['PENDING', 'ACTIVE', 'SUSPENDED']);
const Language = a.enum(['EN', 'HI']);
const Theme = a.enum(['LIGHT', 'DARK', 'SYSTEM']);

const schema = a.schema({
  // Organization - tenant entity
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
      gstin: a.string(),
      logoUrl: a.url(),
      timezone: a.string().default('Asia/Kolkata'),
      financialYearStart: a.integer().default(4), // April
      billingStatus: a.ref('BillingStatus'),
      settings: a.json(),
      isActive: a.boolean().default(true),
      memberships: a.hasMany('Membership', 'organizationId'),
    })
    .authorization((allow) => [
      allow.authenticated(),
      allow.publicApiKey().to(['read']),
    ]),

  // Membership - user-organization junction
  Membership: a
    .model({
      userId: a.string().required(),
      organizationId: a.id().required(),
      organization: a.belongsTo('Organization', 'organizationId'),
      role: a.ref('MemberRole').required(),
      status: a.ref('MemberStatus'),
      isDefault: a.boolean().default(false),
      joinedAt: a.datetime(),
      invitedBy: a.string(),
      invitedAt: a.datetime(),
    })
    .secondaryIndexes((index) => [
      index('userId').sortKeys(['organizationId']).queryField('membershipsByUserId'),
      index('organizationId').sortKeys(['userId']).queryField('membershipsByOrganizationId'),
    ])
    .authorization((allow) => [
      allow.authenticated(),
    ]),

  // UserSettings - per-user preferences
  UserSettings: a
    .model({
      userId: a.id().required(),
      lastOrganizationId: a.id(),
      preferredLanguage: a.ref('Language'),
      theme: a.ref('Theme'),
    })
    .identifier(['userId'])
    .authorization((allow) => [
      allow.authenticated(),
    ]),

  // Enum definitions
  BillingStatus,
  MemberRole,
  MemberStatus,
  Language,
  Theme,
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
