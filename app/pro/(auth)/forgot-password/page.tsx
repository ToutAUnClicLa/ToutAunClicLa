"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { proAuthErrorKey } from '@/lib/pro/authErrors';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Label } from '@/components/pro/ui/label';

export default function ProForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useProAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      toast.success(data.message || t('pro.auth.forgotPassword.success'));
      router.push(`/pro/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(t(proAuthErrorKey(err, 'pro.auth.forgotPassword.error')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {t('pro.auth.forgotPassword.title')}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {t('pro.auth.forgotPassword.subtitle')}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">{t('pro.auth.forgotPassword.emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('pro.auth.forgotPassword.emailPlaceholder')}
          />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          {t('pro.auth.forgotPassword.submit')}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/pro/login" className="font-medium text-primary hover:underline">
          {t('pro.auth.forgotPassword.backToLogin')}
        </Link>
      </p>
    </div>
  );
}
