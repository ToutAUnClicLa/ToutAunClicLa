"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * 
 * @param children - Contenido a mostrar si el usuario está autorizado
 * @param requireAuth - Si requiere autenticación (default: true)
 * @param requireVerification - Si requiere verificación de email (default: true)
 * @param redirectTo - Ruta a la que redirigir si no está autorizado
 * @param fallback - Componente a mostrar mientras se verifica el estado
 */
export function AuthGuard({
  children,
  requireAuth = true,
  requireVerification = true,
  redirectTo = '/',
  fallback = <AuthLoadingSpinner />
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(false);
      return;
    }

    // Si no requiere autenticación, mostrar el contenido
    if (!requireAuth) {
      setShouldRender(true);
      return;
    }

    // Si requiere autenticación pero no está autenticado
    if (requireAuth && !isAuthenticated) {
      setShouldRender(false);
      router.push(redirectTo);
      return;
    }

    // Si requiere verificación pero no está verificado
    if (requireVerification && user && !user.verified) {
      setShouldRender(false);
      router.push('/verify-email');
      return;
    }

    // Si todo está bien, mostrar el contenido
    setShouldRender(true);
  }, [isLoading, isAuthenticated, user, requireAuth, requireVerification, redirectTo, router]);

  if (isLoading) {
    return fallback;
  }

  if (!shouldRender) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Componente de carga para el AuthGuard
 */
function AuthLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando autenticación...</p>
      </div>
    </div>
  );
}

/**
 * HOC para proteger páginas completas
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
