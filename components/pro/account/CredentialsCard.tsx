"use client";

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { changePassword } from '@/lib/pro/endpoints';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Label } from '@/components/pro/ui/label';

export function CredentialsCard() {
  const { proUser } = useProAuth();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  if (!proUser) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error(t('pro.dashboard.account.passwordTooShort'));
      return;
    }
    if (newPassword !== confirm) {
      toast.error(t('pro.dashboard.account.passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success(t('pro.dashboard.account.passwordUpdated'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch {
      toast.error(t('pro.dashboard.account.passwordError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pro-card mt-8">
      <h2 className="text-base font-semibold text-foreground">
        {t('pro.dashboard.account.credentialsTitle')}
      </h2>
      <div className="mt-4">
        <Label htmlFor="account-email">{t('pro.dashboard.account.emailLabel')}</Label>
        <Input id="account-email" type="email" value={proUser.email} readOnly />
      </div>

      {proUser.autenticacion_social ? (
        <p className="mt-4 text-sm text-muted-foreground">{t('pro.dashboard.account.socialHint')}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="current-password">{t('pro.dashboard.account.currentPasswordLabel')}</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new-password">{t('pro.dashboard.account.newPasswordLabel')}</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">{t('pro.dashboard.account.confirmPasswordLabelChange')}</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" loading={loading}>
              {t('pro.dashboard.account.savePassword')}
            </Button>
            <Link
              href={`/pro/forgot-password?email=${encodeURIComponent(proUser.email)}`}
              className="inline-flex min-h-11 items-center text-sm font-medium text-primary"
            >
              {t('pro.dashboard.account.forgotPassword')}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
