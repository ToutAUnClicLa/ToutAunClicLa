"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/ui/card';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface EmailVerificationProps {
  email: string;
  onSuccess?: () => void;
}

export function EmailVerification({ email, onSuccess }: EmailVerificationProps) {
  const router = useRouter();
  const { verifyEmail, resendVerification } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verifyEmail(verificationCode, email);
      toast.success('Email verificado correctamente. ¡Bienvenido!');
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Error de verificación:', err);
      setError(err.message || 'Código de verificación inválido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError(null);

    try {
      await resendVerification(email);
      toast.success('Código reenviado correctamente');
    } catch (err: any) {
      console.error('Error al reenviar código:', err);
      toast.error('Error al reenviar código');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Verifica tu email</CardTitle>
        <CardDescription>
          Enviamos un código de 6 dígitos a:<br />
          <span className="font-medium text-gray-900">{email}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleVerifyCode} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
              Código de verificación
            </label>
            <Input
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="123456"
              maxLength={6}
              autoFocus
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Verificando...
              </span>
            ) : (
              'Verificar código'
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              disabled={isResending}
            >
              {isResending ? 'Reenviando...' : 'Reenviar código'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
