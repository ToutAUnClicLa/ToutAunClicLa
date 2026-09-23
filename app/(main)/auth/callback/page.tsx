"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { consumeShopAuthNext, loginPath } from '@/lib/shop-auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { handleGoogleCallback } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    setMessage(t('auth.callback.processingAuth'));
    
    const processCallback = async () => {
      try {
        setStatus('loading');
        setMessage(t('auth.callback.verifyingGoogle'));
        
        // Procesar callback de Google
        const response = await handleGoogleCallback();
        
        setStatus('success');
        const welcomeMessage = `${t('auth.callback.welcomeUser')}${response.user.nombre}!`;
        setMessage(welcomeMessage);
        
        // Mostrar toast de éxito una sola vez
        toast.success(welcomeMessage, {
          description: t('auth.callback.authenticationComplete')
        });
        
        // Esperar un momento antes de redirigir
        const next = consumeShopAuthNext();
        setTimeout(() => {
          router.push(next);
        }, 2000);
        
      } catch (error: any) {
        console.error('Error en callback:', error);
        setStatus('error');
        setMessage(error.message || t('auth.callback.authError'));
        const next = consumeShopAuthNext();
        
        setTimeout(() => {
          router.push(loginPath(next));
        }, 3000);
      }
    };

    processCallback();
  }, [handleGoogleCallback, router, t]);

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return t('auth.callback.processing');
      case 'success':
        return t('auth.callback.success');
      case 'error':
        return t('auth.callback.error');
      default:
        return t('auth.callback.processing');
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white">
      <div className="max-w-md w-full mx-4">
        <div className="rounded-xl border border-[var(--shop-hairline)] bg-white p-8">
          <div className="text-center space-y-6">
            {/* Logo o icono */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg">
              {status === 'loading' && (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-8 w-8 text-white" />
              )}
              {status === 'error' && (
                <XCircle className="h-8 w-8 text-white" />
              )}
            </div>

            {/* Título */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {getStatusTitle()}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {message}
              </p>
            </div>

            {/* Indicador de progreso */}
            {status === 'loading' && (
              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
                <p className="text-xs text-gray-500">
                  {t('auth.callback.takingSeconds')}
                </p>
              </div>
            )}

            {/* Mensaje de redirección */}
            {status === 'success' && (
              <div className="text-xs text-gray-500">
                {t('auth.callback.redirecting')}
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <div className="text-xs text-gray-500">
                  {t('auth.callback.redirecting')}
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                >
                  {t('auth.callback.goToHome')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
