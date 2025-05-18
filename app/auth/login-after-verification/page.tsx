"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginAfterVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function attemptLogin() {
      try {
        // Obtener el email del usuario verificado
        const email = searchParams.get('email');
        
        if (!email) {
          setError('No se proporcionó el correo electrónico');
          setIsLoading(false);
          return;
        }
        
        // Verificar si ya hay una sesión activa
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Ya está autenticado, redirigir al perfil
          setIsSuccess(true);
          setIsLoading(false);
          setTimeout(() => {
            router.push('/profile');
          }, 2000);
          return;
        }
        
        // Si no hay sesión, pero tenemos una cookie con datos temporales, 
        // intentamos iniciar sesión con esos datos
        // (Esto podría implementarse en una fase posterior)
        
        // Mostrar mensaje de éxito
        setIsSuccess(true);
        setIsLoading(false);
        
        // Redirigir a la página de inicio de sesión con el email pre-llenado
        setTimeout(() => {
          router.push(`/auth/login?email=${encodeURIComponent(email)}`);
        }, 2000);
        
      } catch (error: any) {
        console.error('Error al iniciar sesión automática:', error);
        setError(error.message || 'Error al iniciar sesión');
        setIsLoading(false);
      }
    }

    attemptLogin();
  }, [router, searchParams]);

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
          Verificación Completada
        </h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4 py-6">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
            <p className="text-gray-600">Preparando tu cuenta...</p>
          </div>
        ) : isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">¡Verificación exitosa!</h2>
              <p className="text-gray-600 mt-1">
                Tu cuenta ha sido verificada correctamente. 
                Serás redirigido automáticamente...
              </p>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <Button 
                className="w-full"
                onClick={() => router.push('/profile')}
              >
                Ir a mi perfil
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => router.push('/')}
              >
                Ir a la página principal
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
              <h2 className="text-xl font-medium text-gray-900">Ha ocurrido un error</h2>
              <p className="text-red-600 mt-1">
                {error || 'No se pudo completar el proceso'}
              </p>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <Link href="/auth/login" passHref>
                <Button 
                  className="w-full"
                >
                  Ir a iniciar sesión
                </Button>
              </Link>
              <Link href="/" passHref>
                <Button 
                  variant="outline"
                  className="w-full"
                >
                  Ir a la página principal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 