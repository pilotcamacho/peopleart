import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcome to PeopleArt — Verify your email',
      verificationEmailBody: (createCode) =>
        `Your PeopleArt verification code is: ${createCode()}`,
    },
  },
  groups: ['Admin', 'DataRoom'],
  multifactor: {
    mode: 'OPTIONAL',
    totp: true,
  },
});
