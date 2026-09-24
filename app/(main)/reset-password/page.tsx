"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShopAuthShell, ShopResetForm } from '@/components/features/auth/ShopAuthForms';
import { useTranslation } from '@/hooks/useTranslation';

function ResetContent() {
  const { t } = useTranslation();
  const search = useSearchParams();
  return (
    <ShopAuthShell title={t('auth.resetPasswordTitle')} description={t('auth.enterResetCode')}>
      <ShopResetForm email={search.get('email')} />
    </ShopAuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-white" />}>
      <ResetContent />
    </Suspense>
  );
}
