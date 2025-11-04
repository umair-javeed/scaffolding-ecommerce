'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signOut, signUp, confirmSignUp, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// Configure Amplify immediately when this module loads
if (typeof window !== 'undefined') {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_tv8uaa8YJ',
        userPoolClientId: '64b8d4lmcsicnadks6u9m8jke',
        region: 'us-east-1',
        loginWith: {
          email: true,
        },
        signUpVerificationMethod: 'code' as const,
        userAttributes: {
          email: { required: true },
          name: { required: true },
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
  }, { ssr: true });
}

interface User {
  username: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const email = session.tokens?.idToken?.payload.email as string;
      const name = session.tokens?.idToken?.payload.name as string;
      
      setUser({
        username: currentUser.username,
        email,
        name,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(email: string, password: string) {
    try {
      await signIn({ username: email, password });
      await checkUser();
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  async function handleSignUp(email: string, password: string, name: string) {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  }

  async function handleConfirmSignUp(email: string, code: string) {
    try {
      await confirmSignUp({ 
        username: email, 
        confirmationCode: code 
      });
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      throw new Error(error.message || 'Failed to verify code');
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    signOut: handleSignOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}