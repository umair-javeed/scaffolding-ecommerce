'use client';

import { Suspense } from 'react';
import SignupForm from './SignupForm';
export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}