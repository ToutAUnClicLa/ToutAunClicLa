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

export default function ProRegisterPage() {
  const router = useRouter();
  const { register } = useProAuth();
  const { t } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ nombre, apellido: apellido || undefined, email, password });
      toast.success(t('pro.auth.register.success'));
      router.push(`/pro/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(t(proAuthErrorKey(err, 'pro.auth.register.error')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {t('pro.auth.register.title')}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{t('pro.auth.register.subtitle')}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="nombre">{t('pro.auth.register.firstNameLabel')}</Label>
            <Input id="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="apellido">{t('pro.auth.register.lastNameLabel')}</Label>
            <Input id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">{t('pro.auth.register.emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('pro.auth.register.emailPlaceholder')}
          />
        </div>
        <div>
          <Label htmlFor="password">{t('pro.auth.register.passwordLabel')}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('pro.auth.register.passwordPlaceholder')}
          />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          {t('pro.auth.register.submit')}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {t('pro.auth.register.haveAccount')}{' '}
        <Link href="/pro/login" className="font-medium text-primary hover:underline">
          {t('pro.auth.register.signIn')}
        </Link>
      </p>
    </div>
  );
}
