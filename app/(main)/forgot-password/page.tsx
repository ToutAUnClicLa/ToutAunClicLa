"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Esta página redirige al home con el modal de recuperación de contraseña abierto
 * El flujo completo ahora se maneja a través del AuthModal
 */
export default function ForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al home donde se abrirá el AuthModal en modo forgotPassword
    router.push('/?auth=forgot');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}
