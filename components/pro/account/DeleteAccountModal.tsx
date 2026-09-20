"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ProApiError } from '@/lib/pro/api';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Label } from '@/components/pro/ui/label';

interface DeleteAccountModalProps {
  isSocial: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ isSocial, onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const { deleteAccount } = useProAuth();
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const onConfirm = async () => {
    setLoading(true);
    setFieldError('');
    try {
      const payload = isSocial ? { confirmarEmail: value } : { password: value };
      await deleteAccount(payload);
      toast.success(t('pro.dashboard.account.deleteSuccess'));
      router.replace('/pro');
    } catch (err) {
      const apiErr = err as ProApiError;
      const errorCode =
        apiErr.data && typeof apiErr.data === 'object'
          ? (apiErr.data as { error?: string }).error
          : undefined;
      if (errorCode === 'Invalid password') {
        setFieldError(t('pro.dashboard.account.invalidPassword'));
      } else if (errorCode === 'Confirmation required') {
        setFieldError(t('pro.dashboard.account.confirmationMismatch'));
      } else if (errorCode === 'Stripe cancellation failed') {
        toast.error(t('pro.dashboard.account.stripeError'));
      } else {
        toast.error(t('pro.dashboard.account.deleteError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-md)]">
        <h2 className="text-lg font-semibold text-foreground">
          {t('pro.dashboard.account.modalTitle')}
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{t('pro.dashboard.account.itemProfile')}</li>
          <li>{t('pro.dashboard.account.itemSocials')}</li>
          <li>{t('pro.dashboard.account.itemStats')}</li>
          <li>{t('pro.dashboard.account.itemSubscription')}</li>
          <li>{t('pro.dashboard.account.itemGallery')}</li>
        </ul>
        <p className="mt-3 text-sm font-medium text-destructive">
          {t('pro.dashboard.account.irreversible')}
        </p>

        <div className="mt-5">
          <Label htmlFor="delete-confirm">
            {isSocial
              ? t('pro.dashboard.account.confirmEmailLabel')
              : t('pro.dashboard.account.confirmPasswordLabel')}
          </Label>
          <Input
            id="delete-confirm"
            type={isSocial ? 'text' : 'password'}
            autoComplete={isSocial ? 'off' : 'current-password'}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setFieldError('');
            }}
            placeholder={
              isSocial ? t('pro.dashboard.account.confirmEmailPlaceholder') : undefined
            }
            className={fieldError ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {fieldError && <p className="mt-1.5 text-sm text-destructive">{fieldError}</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            {t('pro.dashboard.account.cancel')}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            loading={loading}
            disabled={!value.trim()}
            onClick={onConfirm}
          >
            {t('pro.dashboard.account.confirmDelete')}
          </Button>
        </div>
      </div>
    </div>
  );
}
