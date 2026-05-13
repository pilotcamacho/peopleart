import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Lead capture from the contact form.
  // Public create (no login required) + Admin read/delete.
  InvestorContact: a
    .model({
      fullName: a.string().required(),
      organisation: a.string(),
      email: a.string().required(),
      inquiryType: a
        .enum([
          'enterprise_training',
          'investor',
          'government',
          'strategic_partner',
          'media',
          'other',
        ])
        .required(),
      message: a.string().required(),
      preferredLanguage: a.enum(['en', 'es']),
      ipHash: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['create']),
      allow.groups(['Admin']).to(['read', 'delete']),
    ]),

  // Investor document metadata. s3Key is the S3 object key — never exposed to the client.
  // Admin manages; DataRoom + Admin can list and read metadata (not the file itself).
  DataRoomDocument: a
    .model({
      title: a.string().required(),
      description: a.string(),
      s3Key: a.string().required(),
      version: a.string(),
      isActive: a.boolean().required(),
    })
    .authorization((allow) => [
      allow.groups(['Admin']),
      allow.groups(['DataRoom']).to(['read']),
    ]),

  // Audit log written on every successful document download.
  DocumentDownload: a
    .model({
      documentId: a.string().required(),
      documentTitle: a.string().required(),
      userEmail: a.string().required(),
      ipHash: a.string(),
    })
    .authorization((allow) => [
      allow.owner().to(['create']),
      allow.groups(['Admin']).to(['read']),
    ]),

  // Records when a user was granted DataRoom group access and by whom.
  DataRoomAccess: a
    .model({
      userId: a.string().required(),
      email: a.string().required(),
      grantedBy: a.string().required(),
    })
    .authorization((allow) => [allow.groups(['Admin'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
