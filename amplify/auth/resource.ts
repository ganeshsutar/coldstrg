import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'COLDVAULT - Verify your email',
      verificationEmailBody: (code) =>
        `Your verification code is: ${code()}. This code expires in 24 hours.`,
    },
  },
  userAttributes: {
    fullName: {
      required: true,
      mutable: true,
    },
    phoneNumber: {
      required: false,
      mutable: true,
    },
  },
  accountRecovery: 'EMAIL_ONLY',
});
