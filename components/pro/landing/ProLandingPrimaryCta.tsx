'use client';

import Link from 'next/link';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/pro/ui/button';

type Variant = 'primary' | 'ghost';

export function ProLandingPrimaryCta({
  guestLabel,
  className,
  variant = 'primary',
}: {
  guestLabel: string;
  className?: string;
  variant?: Variant;
}) {
  const { proUser } = useProAuth();
  const { t } = useTranslation();
  const authed = Boolean(proUser);

  return (
    <Link href={authed ? '/pro/dashboard' : '/pro/register'}>
      <Button size="lg" variant={variant} className={className}>
        {authed ? t('pro.pricingPage.goToDashboard') : guestLabel}
      </Button>
    </Link>
  );
}
