"use client";

import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { loginPath } from '@/lib/shop-auth';

/**
 * Hook simple para proteger acciones que requieren autenticación
 * Incluye modal automático cuando es necesario
 */
export function useAuthProtection() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Referencias estables para evitar re-renders infinitos
  const authRef = useRef({ isAuthenticated, user });

  // Actualizar referencias cuando cambien los valores
  useEffect(() => {
    authRef.current = { isAuthenticated, user };
  }, [isAuthenticated, user]);

  /**
   * Verifica si el usuario puede realizar acciones
   */
  const canPerformAction = useCallback(() => {
    const { isAuthenticated: auth, user: currentUser } = authRef.current;
    return auth && currentUser?.verified;
  }, []);

  /**
   * Ejecuta una acción solo si el usuario está autenticado y verificado
   */
  const executeProtected = useCallback((
    action: () => void | Promise<void>,
    errorMessage = "Debes iniciar sesión para realizar esta acción"
  ) => {
    const { isAuthenticated: auth, user: currentUser } = authRef.current;
    
    if (!auth || !currentUser) {
      toast.error(errorMessage);
      setAuthModalMode('login');
      router.push(loginPath(pathname));
      return false;
    }
    
    if (!currentUser.verified) {
      toast.error("Debes verificar tu cuenta para realizar esta acción");
      setAuthModalMode('login');
      router.push(loginPath(pathname));
      return false;
    }
    
    action();
    return true;
  }, [router, pathname]);

  /**
   * Para favoritos específicamente
   */
  const executeForFavorites = useCallback((action: () => void | Promise<void>) => {
    return executeProtected(action, "Inicia sesión para gestionar tus favoritos");
  }, [executeProtected]);

  /**
   * Para carrito específicamente
   */
  const executeForCart = useCallback((action: () => void | Promise<void>) => {
    return executeProtected(action, "Inicia sesión para agregar productos al carrito");
  }, [executeProtected]);

  return {
    // Estado
    isAuthenticated,
    isVerified: user?.verified || false,
    canPerformAction,
    
    // Acciones protegidas
    executeProtected,
    executeForFavorites,
    executeForCart,
    
    // Modal de autenticación
    isAuthModalOpen,
    authModalMode,
    openAuthModal: useCallback(() => router.push(loginPath(pathname)), [router, pathname]),
    closeAuthModal: useCallback(() => setIsAuthModalOpen(false), []),
  };
}
