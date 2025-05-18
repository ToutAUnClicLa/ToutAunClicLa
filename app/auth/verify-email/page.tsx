"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MailCheck, AlertCircle, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
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
          
          // Pequeña espera para mostrar el mensaje de éxito
          setTimeout(() => {
            if (data.redirectUrl) {
              // Redirigir a la página de login automático si existe la URL
              router.push(data.redirectUrl);
            } else {
              // Alternativa en caso de que no se proporcione URL de redirección
              router.push('/');
            }
          }, 1500);
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
  }, [searchParams, router]);
  
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
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
            <p className="text-gray-600">Verificando tu correo electrónico...</p>
          </div>
        ) : isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">¡Correo verificado!</h2>
              <p className="text-gray-600 mt-1">
                Tu cuenta ha sido verificada correctamente.
                Serás redirigido automáticamente...
              </p>
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
                {error || 'No se pudo verificar tu correo electrónico'}
              </p>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <Link href="/auth/login" passHref>
                <Button 
                  variant="outline"
                  className="w-full"
                >
                  Volver a iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 