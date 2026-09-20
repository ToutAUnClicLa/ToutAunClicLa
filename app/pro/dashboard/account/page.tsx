"use client";

import { useState } from 'react';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { BackButton } from '@/components/pro/ui/back-button';
import { Button } from '@/components/pro/ui/button';
import { DeleteAccountModal } from '@/components/pro/account/DeleteAccountModal';
import { CredentialsCard } from '@/components/pro/account/CredentialsCard';
import { ProPageHeader } from '@/components/pro/ui/shell';

export default function AccountPage() {
  const { proUser } = useProAuth();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  if (!proUser) return null;

  return (
    <div>
      <BackButton href="/pro/dashboard" label={t('pro.dashboard.account.back')} />
      <ProPageHeader
        title={t('pro.dashboard.account.title')}
        subtitle={t('pro.dashboard.account.subtitle')}
      />

      <CredentialsCard />

      <div className="pro-card mt-8 border-destructive/30 bg-destructive/5">
        <h2 className="text-base font-semibold text-destructive">
          {t('pro.dashboard.account.dangerZoneTitle')}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t('pro.dashboard.account.dangerZoneText')}
        </p>
        <Button variant="destructive" className="mt-4" onClick={() => setShowModal(true)}>
          {t('pro.dashboard.account.deleteButton')}
        </Button>
      </div>

      {showModal && (
        <DeleteAccountModal
          isSocial={proUser.autenticacion_social}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
