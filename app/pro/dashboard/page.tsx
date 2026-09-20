"use client";

import Link from 'next/link';
import { ArrowUpRight, BarChart2, Contact, IdCard, Settings, UserRound, Wallet } from 'lucide-react';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { SubscriptionCard } from '@/components/pro/dashboard/SubscriptionCard';
import { ProPageHeader } from '@/components/pro/ui/shell';

const TILES = [
  { href: '/pro/dashboard/profile', Icon: UserRound, titleKey: 'profileCardTitle', descKey: 'profileCardDesc' },
  { href: '/pro/dashboard/card', Icon: IdCard, titleKey: 'cardCardTitle', descKey: 'cardCardDesc' },
  { href: '/pro/dashboard/vcard', Icon: Contact, titleKey: 'vcardCardTitle', descKey: 'vcardCardDesc' },
  { href: '/pro/dashboard/wallet', Icon: Wallet, titleKey: 'walletCardTitle', descKey: 'walletCardDesc' },
  { href: '/pro/dashboard/analytics', Icon: BarChart2, titleKey: 'analyticsCardTitle', descKey: 'analyticsCardDesc' },
  { href: '/pro/dashboard/account', Icon: Settings, titleKey: 'accountCardTitle', descKey: 'accountCardDesc' },
] as const;

export default function DashboardPage() {
  const { proUser } = useProAuth();
  const { t } = useTranslation();

  return (
    <div>
      <ProPageHeader
        className="mt-0"
        title={t('pro.dashboard.greeting', { name: proUser?.nombre || '' })}
        subtitle={t('pro.dashboard.intro')}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ href, Icon, titleKey, descKey }) => (
          <Link
            key={href}
            href={href}
            className="pro-card pro-card-hover group"
          >
            <div className="flex items-start justify-between">
              <span className="pro-icon-tile">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <ArrowUpRight
                className="h-4 w-4 text-muted-foreground transition-colors duration-[180ms] ease-out group-hover:text-primary"
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
