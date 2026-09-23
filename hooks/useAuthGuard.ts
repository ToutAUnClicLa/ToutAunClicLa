"use client";

import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';
import { loginPath } from '@/lib/shop-auth';

export function useAuthProtection() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const canPerformAction = () => {
    return isAuthenticated && user?.verified;
  };

  const executeProtected = (
    action: () => void | Promise<void>,
    errorMessage = "Debes iniciar sesión para realizar esta acción"
  ) => {
    if (!isAuthenticated || !user) {
      toast.error(errorMessage);
      router.push(loginPath(pathname));
      return false;
    }

    if (!user.verified) {
      toast.error("Debes verificar tu cuenta para realizar esta acción");
      router.push(loginPath(pathname));
      return false;
    }

    action();
    return true;
  };

  const executeForFavorites = (action: () => void | Promise<void>) => {
    return executeProtected(action, "Inicia sesión para gestionar tus favoritos");
  };

  const executeForCart = (action: () => void | Promise<void>) => {
    return executeProtected(action, "Inicia sesión para agregar productos al carrito");
  };

  return {
    isAuthenticated,
    isVerified: user?.verified || false,
    canPerformAction,
    executeProtected,
    executeForFavorites,
    executeForCart,
    isAuthModalOpen: false,
    authModalMode: 'login' as const,
    openAuthModal: () => router.push(loginPath(pathname)),
    closeAuthModal: () => {},
  };
}
