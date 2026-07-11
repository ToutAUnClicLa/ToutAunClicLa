"use client";

import Link from 'next/link';
import { ArrowUpRight, BarChart2, Contact, IdCard, UserRound, Wallet } from 'lucide-react';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { SubscriptionCard } from '@/components/pro/dashboard/SubscriptionCard';

const TILES = [
  { href: '/pro/dashboard/profile', Icon: UserRound, titleKey: 'profileCardTitle', descKey: 'profileCardDesc' },
  { href: '/pro/dashboard/card', Icon: IdCard, titleKey: 'cardCardTitle', descKey: 'cardCardDesc' },
  { href: '/pro/dashboard/vcard', Icon: Contact, titleKey: 'vcardCardTitle', descKey: 'vcardCardDesc' },
  { href: '/pro/dashboard/wallet', Icon: Wallet, titleKey: 'walletCardTitle', descKey: 'walletCardDesc' },
  { href: '/pro/dashboard/analytics', Icon: BarChart2, titleKey: 'analyticsCardTitle', descKey: 'analyticsCardDesc' },
] as const;

export default function DashboardPage() {
  const { proUser } = useProAuth();
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {t('pro.dashboard.greeting', { name: proUser?.nombre || '' })}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{t('pro.dashboard.intro')}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ href, Icon, titleKey, descKey }) => (
          <Link
            key={href}
            href={href}
            className="pro-card-hover group rounded-[14px] border border-border bg-card p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <ArrowUpRight
                className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden
              />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">
              {t(`pro.dashboard.${titleKey}`)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(`pro.dashboard.${descKey}`)}
            </p>
          </Link>
        ))}
        <SubscriptionCard />
      </div>
    </div>
  );
}
