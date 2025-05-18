"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MailCheck, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function verifyUserEmail() {
      // Obtener parámetros - Supabase envía diferentes parámetros según la configuración
      const token = searchParams.get('token') || searchParams.get('confirmation_token');
      const type = searchParams.get('type'); // Supabase envía 'signup' o 'recovery'
      
      // El email puede venir directamente o codificado
      let emailValue = searchParams.get('email');
      if (!emailValue) {
        try {
          // Intenta obtener el email del token
          const { data, error } = await supabase.auth.getUser();
          if (!error && data.user) {
            emailValue = data.user.email;
          }
        } catch (e) {
          console.error('Error al obtener usuario:', e);
        }
      }
      
      setEmail(emailValue);

      // Si no hay token, probablemente la verificación sea por sesión de Supabase
      if (!token) {
        try {
          // Verificar si hay una sesión activa y si el usuario está verificado
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session && session.user) {
            // Verificar si el email ya está confirmado
            if (session.user.email_confirmed_at) {
              // El email ya está confirmado, actualizamos también en nuestra tabla
              const userId = session.user.id;
              await verifyEmail(userId);
              
              setIsSuccess(true);
              setIsProcessing(false);
              return;
            }
          }
          
          // Si llegamos aquí, no tenemos un token válido o sesión verificada
          setError('No se encontró un token de verificación válido');
          setIsProcessing(false);
          return;
        } catch (error: any) {
          console.error('Error al verificar sesión:', error);
          setError('Error al verificar sesión');
          setIsProcessing(false);
          return;
        }
      }

      try {
        // Intentamos verificar con el token directamente de Supabase
        const { error: confirmError } = await supabase.auth.verifyOtp({
          token,
          type: 'email',
        });
        
        if (confirmError) {
          console.error('Error al verificar OTP:', confirmError);
          throw confirmError;
        }
        
        // Si llegamos aquí, la verificación fue exitosa
        // Ahora obtenemos el usuario y actualizamos nuestros registros
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          throw new Error('No se pudo obtener la información del usuario');
        }
        
        // Actualizar estado de verificación en nuestra tabla
        await verifyEmail(userData.user.id);
        
        setIsSuccess(true);
        toast.success('Email verificado correctamente');
        
      } catch (error: any) {
        console.error('Error al verificar email:', error);
        setError(error.message || 'Error al verificar email');
      } finally {
        setIsProcessing(false);
      }
    }

    verifyUserEmail();
  }, [router, searchParams]);

  // Función para reenviar el correo de verificación
  const handleResendVerification = async () => {
    if (!email) {
      toast.error('No se pudo determinar el email');
      return;
    }
    
    try {
      setIsProcessing(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        }
      });
      
      if (error) throw error;
      
      toast.success('Se ha enviado un nuevo correo de verificación');
    } catch (error: any) {
      console.error('Error al reenviar correo:', error);
      toast.error(error.message || 'Error al reenviar correo de verificación');
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
                <MailCheck className="h-8 w-8 text-green-600" />
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
            <div className="flex flex-col space-y-2 mt-4">
              {email && (
                <Button 
                  className="w-full flex items-center justify-center"
                  onClick={handleResendVerification}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Reenviar correo de verificación
                </Button>
              )}
              <Link href="/sign-in" passHref>
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