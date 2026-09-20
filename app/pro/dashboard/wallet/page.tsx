"use client";

import { Share2, Smartphone, Wallet } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { BackButton } from '@/components/pro/ui/back-button';
import { ProEmptyState, ProPageHeader } from '@/components/pro/ui/shell';

export default function WalletPreviewPage() {
  const { t } = useTranslation();

  return (
    <div>
      <BackButton href="/pro/dashboard" label={t('pro.dashboard.wallet.back')} />
      <ProPageHeader
        title={t('pro.dashboard.wallet.title')}
        subtitle={t('pro.dashboard.wallet.subtitle')}
      />

      <ProEmptyState
        icon={Wallet}
        title={t('pro.dashboard.wallet.comingSoonTitle')}
        text={t('pro.dashboard.wallet.comingSoonText')}
      >
        <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t('pro.dashboard.wallet.comingSoonBadge')}
        </span>
      </ProEmptyState>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="pro-card">
          <span className="pro-icon-tile">
            <Smartphone className="h-4 w-4" aria-hidden />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            {t('pro.dashboard.wallet.featureWalletTitle')}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('pro.dashboard.wallet.featureWalletDesc')}
          </p>
        </div>
        <div className="pro-card">
          <span className="pro-icon-tile">
            <Share2 className="h-4 w-4" aria-hidden />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            {t('pro.dashboard.wallet.featureAirdropTitle')}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('pro.dashboard.wallet.featureAirdropDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
