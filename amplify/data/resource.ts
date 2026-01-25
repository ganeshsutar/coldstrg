import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

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
      financialYearStart: a.integer().default(4),
      billingStatus: a.enum(['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED']),
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
      role: a.enum(['ADMIN', 'OPERATOR']),
      status: a.enum(['PENDING', 'ACTIVE', 'SUSPENDED']),
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
      preferredLanguage: a.enum(['EN', 'HI']),
      theme: a.enum(['LIGHT', 'DARK', 'SYSTEM']),
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
