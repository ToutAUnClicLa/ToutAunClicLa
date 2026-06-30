"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { ProApiError } from '@/lib/pro/api';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Label } from '@/components/pro/ui/label';

export default function ProLoginPage() {
  const router = useRouter();
  const { login } = useProAuth();
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
        toast.error('Verifica tu correo antes de entrar.');
        router.push(`/pro/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(apiErr.message || 'No se pudo iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Iniciar sesión</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Accede a tu panel profesional.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nom@exemple.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
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
          Entrar
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link href="/pro/register" className="font-medium text-primary hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}
