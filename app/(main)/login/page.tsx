"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShopAuthShell, ShopLoginForm } from '@/components/features/auth/ShopAuthForms';
import { useTranslation } from '@/hooks/useTranslation';

function LoginContent() {
  const { t } = useTranslation();
  const search = useSearchParams();
  return (
    <ShopAuthShell title={t('auth.loginTitle')} description={t('auth.loginDescription')}>
      <ShopLoginForm next={search.get('next')} />
    </ShopAuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[90vh] bg-white" />}>
      <LoginContent />
    </Suspense>
  );
}
