"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmailVerification } from '@/components/features/auth/EmailVerification';

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">Email no proporcionado para verificación.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <EmailVerification email={email} />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}
