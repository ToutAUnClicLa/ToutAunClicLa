"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MailCheck, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  useEffect(() => {
    async function verifyToken() {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('No se proporcionó un token de verificación');
        setIsProcessing(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setIsSuccess(true);
          toast.success('Tu correo ha sido verificado correctamente');
        } else {
          setError(data.error || 'El token no es válido o ha expirado');
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
        setError('Error al verificar el token');
      } finally {
        setIsProcessing(false);
      }
    }
    
    verifyToken();
  }, [searchParams]);
  
  // Función para reenviar el correo de verificación
  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Necesitas proporcionar un email');
      return;
    }
    
    try {
      setIsProcessing(true);
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Se ha enviado un nuevo correo de verificación');
      } else {
        toast.error(data.error || 'Error al reenviar correo de verificación');
      }
    } catch (error) {
      console.error('Error al reenviar correo:', error);
      toast.error('Error al procesar la solicitud');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center">
          <img 
            src="/logoaunclic.svg" 
            alt="Logo"
            className="h-16 w-16 filter drop-shadow-md"
          />
        </div>
        
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Verificación de Email
        </h1>
        
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Verificando tu email...</p>
          </div>
        ) : isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">¡Email verificado!</h2>
              <p className="text-gray-600 mt-1">
                Tu cuenta ha sido verificada correctamente.
              </p>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <Button 
                className="w-full"
                onClick={() => router.push('/')}
              >
                Ir a la página principal
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => router.push('/profile')}
              >
                Ir a mi perfil
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Error de verificación</h2>
              <p className="text-red-600 mt-1">
                {error || 'No se pudo verificar tu email'}
              </p>
            </div>
            <div className="mt-4 space-y-4">
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium text-gray-900">¿No has recibido el email?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Introduce tu email y te enviaremos un nuevo enlace de verificación.
                </p>
                <div className="mt-3 space-y-3">
                  <input
                    type="email"
                    value={email || ''}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <Button 
                    className="w-full flex items-center justify-center"
                    onClick={handleResendVerification}
                    disabled={isProcessing || !email}
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Reenviar correo de verificación
                  </Button>
                </div>
              </div>
              <Link href="/" className="block">
                <Button 
                  variant="outline"
                  className="w-full"
                >
                  Volver a la página principal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 