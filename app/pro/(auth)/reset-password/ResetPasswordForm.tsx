"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ProApiError } from '@/lib/pro/api';
import { proAuthErrorKey } from '@/lib/pro/authErrors';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Label } from '@/components/pro/ui/label';

const CODE_RE = /^[0-9]{6}$/;

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const { resetPassword } = useProAuth();
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!CODE_RE.test(code)) {
      toast.error(t('pro.auth.resetPassword.invalidCodeFormat'));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t('pro.auth.resetPassword.passwordTooShort'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('pro.auth.resetPassword.passwordMismatch'));
      return;
    }

    setLoading(true);
    setExpired(false);
    try {
      await resetPassword(email, code, newPassword);
      toast.success(t('pro.auth.resetPassword.success'));
      router.replace('/pro/login');
    } catch (err) {
      const apiErr = err as ProApiError;
      const key = proAuthErrorKey(apiErr, 'pro.auth.resetPassword.error');
      if (key === 'pro.auth.resetPassword.expired') setExpired(true);
      toast.error(t(key));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {t('pro.auth.resetPassword.title')}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {t('pro.auth.resetPassword.subtitlePrefix')}{' '}
        <span className="font-medium text-foreground">
          {email || t('pro.auth.resetPassword.subtitleFallback')}
        </span>
        .
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="code">{t('pro.auth.resetPassword.codeLabel')}</Label>
          <Input
            id="code"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="text-center text-lg tracking-[0.4em] tabular-nums"
          />
        </div>
        <div>
          <Label htmlFor="newPassword">{t('pro.auth.resetPassword.newPasswordLabel')}</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('pro.auth.resetPassword.newPasswordPlaceholder')}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">
            {t('pro.auth.resetPassword.confirmPasswordLabel')}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('pro.auth.resetPassword.confirmPasswordPlaceholder')}
          />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          {t('pro.auth.resetPassword.submit')}
        </Button>
      </form>

      {expired && (
        <button
          onClick={() => router.push('/pro/forgot-password')}
          className="mt-4 w-full text-center text-sm font-medium text-primary hover:underline"
        >
          {t('pro.auth.resetPassword.requestNew')}
        </button>
      )}
    </div>
  );
}
