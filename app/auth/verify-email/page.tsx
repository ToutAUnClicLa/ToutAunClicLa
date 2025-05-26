"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/common/ui/button';
import { AlertCircle, CheckCircle, Mail, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function verifyEmail() {
      try {
        const tokenFromUrl = searchParams.get('token');
        setToken(tokenFromUrl);
        
        if (!tokenFromUrl) {
          setError('No se proporcionó un token de verificación válido');
          setIsVerifying(false);
          return;
        }

        // Llamar al endpoint de verificación
        const response = await fetch(`/api/auth/verify-email?token=${tokenFromUrl}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al verificar el email');
        }

        setIsSuccess(true);
        toast.success('¡Email verificado correctamente!');
      } catch (error: any) {
        console.error('Error al verificar email:', error);
        setError(error.message || 'Error al verificar el email');
        toast.error('Error al verificar el email');
      } finally {
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="flex justify-center mb-6">
            <img 
              src="/logoaunclic.svg" 
              alt="Logo"
              className="h-16 w-16 filter drop-shadow-md"
            />
          </div>
          
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            Verificando tu correo
          </h1>
          
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
            <p className="text-gray-600 text-center">
              Estamos verificando tu correo electrónico, por favor espera...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="flex justify-center mb-6">
            <img 
              src="/logoaunclic.svg" 
              alt="Logo"
              className="h-16 w-16 filter drop-shadow-md"
            />
          </div>
          
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900">
              ¡Email verificado!
            </h1>
            
            <p className="text-gray-600">
              Tu correo electrónico ha sido verificado correctamente. Ya puedes acceder a tu cuenta y disfrutar de todos nuestros servicios.
            </p>
            
            <div className="space-y-3 pt-4">
              <Button 
                className="w-full"
                onClick={() => router.push('/')}
              >
                Iniciar sesión
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/')}
              >
                Ir al inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center mb-6">
          <img 
            src="/logoaunclic.svg" 
            alt="Logo"
            className="h-16 w-16 filter drop-shadow-md"
          />
        </div>
        
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900">
            Error de verificación
          </h1>
          
          <p className="text-red-600">
            {error || 'No se pudo verificar tu correo electrónico'}
          </p>
          
          <div className="space-y-3 pt-4">
            <Button 
              className="w-full"
              onClick={() => {
                // Aquí podrías agregar lógica para reenviar el email
                toast.info('Solicita un nuevo enlace de verificación');
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Solicitar nuevo enlace
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/')}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
