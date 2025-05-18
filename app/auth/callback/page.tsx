"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleAuthCallback } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Esta función procesa el callback de autenticación
    async function processCallback() {
      try {
        // Primero obtenemos el código y otros parámetros que Supabase pueda haber enviado
        const code = searchParams.get('code');
        const provider = searchParams.get('provider');
        const redirectPath = searchParams.get('redirect') || '/';

        // Si no hay código, algo salió mal
        if (!code) {
          setError('No se recibió un código de autorización');
          setIsProcessing(false);
          return;
        }

        // El método exchangeCodeForSession de Supabase maneja todo por nosotros
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('Error al intercambiar código:', exchangeError);
          throw exchangeError;
        }

        // Ahora que tenemos una sesión, llamamos a nuestro manejador personalizado
        // para asegurarnos de que el perfil del usuario exista
        const { success, error: callbackError } = await handleAuthCallback();
        
        if (!success) {
          throw callbackError || new Error('Error al procesar callback');
        }

        // Notificamos al usuario que ha iniciado sesión correctamente
        toast.success('¡Has iniciado sesión correctamente!');
        
        // Redirigimos al usuario donde corresponda
        router.push(redirectPath);
      } catch (error: any) {
        console.error('Error en callback de autenticación:', error);
        setError(error.message || 'Ha ocurrido un error durante la autenticación');
        setIsProcessing(false);
      }
    }

    processCallback();
  }, [router, searchParams]);

  if (error) {
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
            Error de autenticación
          </h1>
          
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              onClick={() => router.push('/sign-in')}
            >
              Volver a intentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de carga mientras se procesa
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <h1 className="text-xl font-medium text-gray-900">Completando autenticación...</h1>
        <p className="text-gray-600">Por favor, espera mientras verificamos tu identidad.</p>
      </div>
    </div>
  );
} 