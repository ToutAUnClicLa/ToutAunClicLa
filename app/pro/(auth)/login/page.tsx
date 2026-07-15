"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ProApiError } from '@/lib/pro/api';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Label } from '@/components/pro/ui/label';

export default function ProLoginPage() {
  const router = useRouter();
  const { login } = useProAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/pro/dashboard');
    } catch (err) {
      const apiErr = err as ProApiError;
      const needsVerification =
        apiErr.data && typeof apiErr.data === 'object' && 'needsVerification' in apiErr.data;
      if (needsVerification) {
        toast.error(t('pro.auth.login.needsVerification'));
        router.push(`/pro/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(apiErr.message || t('pro.auth.login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {t('pro.auth.login.title')}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{t('pro.auth.login.subtitle')}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">{t('pro.auth.login.emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('pro.auth.login.emailPlaceholder')}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('pro.auth.login.passwordLabel')}</Label>
            <Link
              href="/pro/forgot-password"
              className="mb-1.5 text-xs font-medium text-primary hover:underline"
            >
              {t('pro.auth.login.forgotPassword')}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          {t('pro.auth.login.submit')}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {t('pro.auth.login.noAccount')}{' '}
        <Link href="/pro/register" className="font-medium text-primary hover:underline">
          {t('pro.auth.login.createAccount')}
        </Link>
      </p>
    </div>
  );
}
