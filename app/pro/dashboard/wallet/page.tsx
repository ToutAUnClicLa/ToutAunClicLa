"use client";

import { Share2, Smartphone, Wallet } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { BackButton } from '@/components/pro/ui/back-button';

export default function WalletPreviewPage() {
  const { t } = useTranslation();

  return (
    <div>
      <BackButton href="/pro/dashboard" label={t('pro.dashboard.wallet.back')} />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t('pro.dashboard.wallet.title')}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
          {t('pro.dashboard.wallet.subtitle')}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center rounded-[14px] border border-dashed border-border bg-card p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Wallet className="h-5 w-5" aria-hidden />
        </span>
        <span className="mt-4 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
          {t('pro.dashboard.wallet.comingSoonBadge')}
        </span>
        <h2 className="mt-3 text-base font-semibold text-foreground">
          {t('pro.dashboard.wallet.comingSoonTitle')}
        </h2>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {t('pro.dashboard.wallet.comingSoonText')}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[14px] border border-border bg-card p-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
            <Smartphone className="h-4 w-4" aria-hidden />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            {t('pro.dashboard.wallet.featureWalletTitle')}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('pro.dashboard.wallet.featureWalletDesc')}
          </p>
        </div>
        <div className="rounded-[14px] border border-border bg-card p-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
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
