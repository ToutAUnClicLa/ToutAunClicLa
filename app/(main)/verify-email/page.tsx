"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShopAuthShell, ShopVerifyForm } from '@/components/features/auth/ShopAuthForms';
import { useTranslation } from '@/hooks/useTranslation';

function VerifyContent() {
  const { t } = useTranslation();
  const search = useSearchParams();
  return (
    <ShopAuthShell title={t('auth.verificationTitle')} description={t('auth.verifyYourEmail')}>
      <ShopVerifyForm email={search.get('email')} next={search.get('next')} />
    </ShopAuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-white" />}>
      <VerifyContent />
    </Suspense>
  );
}
