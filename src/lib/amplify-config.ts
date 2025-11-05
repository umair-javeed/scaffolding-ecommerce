import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_tv8uaa8YJ',
      userPoolClientId: '6988flgqnk5nemll247jsm6i7m',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code' as const,
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: true,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    }
  }
};

// Configure Amplify
Amplify.configure(amplifyConfig, { ssr: true });

export default amplifyConfig;