"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { ProApiError } from '@/lib/pro/api';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Label } from '@/components/pro/ui/label';

export default function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const { verifyEmail, resendCode } = useProAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyEmail(email, code);
      toast.success('Correo verificado.');
      router.replace('/pro/dashboard');
    } catch (err) {
      toast.error((err as ProApiError).message || 'Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    try {
      await resendCode(email);
      toast.success('Te enviamos un nuevo código.');
    } catch (err) {
      toast.error((err as ProApiError).message || 'No se pudo reenviar.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Verifica tu correo</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Ingresa el código de 6 dígitos que enviamos a{' '}
        <span className="font-medium text-foreground">{email || 'tu correo'}</span>.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="text-center text-lg tracking-[0.4em] font-mono"
          />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Verificar
        </Button>
      </form>

      <button
        onClick={onResend}
        disabled={resending}
        className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        {resending ? 'Reenviando…' : 'Reenviar código'}
      </button>
    </div>
  );
}
