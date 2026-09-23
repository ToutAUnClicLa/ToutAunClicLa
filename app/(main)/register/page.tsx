"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShopAuthShell, ShopRegisterForm } from '@/components/features/auth/ShopAuthForms';
import { useTranslation } from '@/hooks/useTranslation';

function RegisterContent() {
  const { t } = useTranslation();
  const search = useSearchParams();
  return (
    <ShopAuthShell title={t('auth.registerTitle')} description={t('auth.createFreeAccount')}>
      <ShopRegisterForm next={search.get('next')} />
    </ShopAuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-white" />}>
      <RegisterContent />
    </Suspense>
  );
}
