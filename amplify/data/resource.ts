import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Enum definitions (schema-level)
  BillingStatus: a.enum(['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED']),
  MembershipRole: a.enum(['ADMIN', 'OPERATOR']),
  MembershipStatus: a.enum(['PENDING', 'ACTIVE', 'SUSPENDED']),
  Language: a.enum(['EN', 'HI']),
  Theme: a.enum(['LIGHT', 'DARK', 'SYSTEM']),

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
      financialYearStart: a.integer().default(4),
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
      userId: a.id().required(),
      organizationId: a.id().required(),
      organization: a.belongsTo('Organization', 'organizationId'),
      role: a.ref('MembershipRole'),
      status: a.ref('MembershipStatus'),
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
