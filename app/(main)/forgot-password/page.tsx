"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShopAuthShell, ShopForgotForm } from '@/components/features/auth/ShopAuthForms';
import { useTranslation } from '@/hooks/useTranslation';

function ForgotContent() {
  const { t } = useTranslation();
  const search = useSearchParams();
  return (
    <ShopAuthShell
      title={t('auth.forgotPasswordTitle')}
      description={t('auth.resetPasswordDescriptionExtended')}
    >
      <ShopForgotForm email={search.get('email')} />
    </ShopAuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-white" />}>
      <ForgotContent />
    </Suspense>
  );
}
