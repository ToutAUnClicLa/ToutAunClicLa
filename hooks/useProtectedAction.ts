"use client";

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import AuthModal from '@/components/features/auth/AuthModal';

interface UseProtectedActionOptions {
  requireVerification?: boolean;
  loginMessage?: string;
  verificationMessage?: string;
}

/**
 * Hook para proteger acciones que requieren autenticación
 * Muestra automáticamente el modal de login si es necesario
 */
export function useProtectedAction(options: UseProtectedActionOptions = {}) {
  const {
    requireVerification = true,
    loginMessage = 'Debes iniciar sesión para realizar esta acción',
    verificationMessage = 'Debes verificar tu cuenta para realizar esta acción'
  } = options;

  const { user, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'verification'>('login');

  /**
   * Verifica si el usuario puede realizar la acción
   */
  const canPerformAction = useCallback((): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }

    if (requireVerification && !user.verified) {
      return false;
    }

    return true;
  }, [isAuthenticated, user, requireVerification]);

  /**
   * Ejecuta una acción protegida
   * Si el usuario no está autorizado, muestra el modal apropiado
   */
  const executeProtected = useCallback(<T extends any[], R>(
    action: (...args: T) => R | Promise<R>,
    ...args: T
  ): Promise<R | null> => {
    return new Promise((resolve) => {
      // Verificar autenticación
      if (!isAuthenticated || !user) {
        toast.error(loginMessage);
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
        resolve(null);
        return;
      }

      // Verificar verificación de email si es requerida
      if (requireVerification && !user.verified) {
        toast.error(verificationMessage);
        setAuthModalMode('verification');
        setIsAuthModalOpen(true);
        resolve(null);
        return;
      }

      // Ejecutar la acción
      try {
        const result = action(...args);
        
        // Si es una promesa, manejarla
        if (result instanceof Promise) {
          result
            .then(resolve)
            .catch((error) => {
              console.error('Error en acción protegida:', error);
              toast.error('Error al realizar la acción');
              resolve(null);
            });
        } else {
          resolve(result);
        }
      } catch (error) {
        console.error('Error en acción protegida:', error);
        toast.error('Error al realizar la acción');
        resolve(null);
      }
    });
  }, [isAuthenticated, user, requireVerification, loginMessage, verificationMessage]);

  /**
   * Función específica para favoritos
   */
  const executeForFavorites = useCallback(<T extends any[], R>(
    action: (...args: T) => R | Promise<R>,
    ...args: T
  ): Promise<R | null> => {
    return executeProtected(action, ...args);
  }, [executeProtected]);

  /**
   * Función específica para carrito
   */
  const executeForCart = useCallback(<T extends any[], R>(
    action: (...args: T) => R | Promise<R>,
    ...args: T
  ): Promise<R | null> => {
    return executeProtected(action, ...args);
  }, [executeProtected]);

  /**
   * Cierra el modal de autenticación
   */
  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  /**
   * Maneja el éxito del login/registro
   */
  const handleAuthSuccess = useCallback(() => {
    setIsAuthModalOpen(false);
    toast.success('¡Perfecto! Ahora puedes continuar');
  }, []);

  return {
    // Estado
    canPerformAction: canPerformAction(),
    isAuthModalOpen,
    authModalMode,
    
    // Acciones
    executeProtected,
    executeForFavorites,
    executeForCart,
    closeAuthModal,
    handleAuthSuccess,
    
    // Componente del modal
    renderAuthModal: () => (
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        onLoginSuccess={handleAuthSuccess}
      />
    )
  };
}

/**
 * Hook específico para proteger acciones de favoritos
 */
export function useFavoritesProtection() {
  return useProtectedAction({
    requireVerification: true,
    loginMessage: 'Inicia sesión para guardar productos en favoritos',
    verificationMessage: 'Verifica tu cuenta para guardar favoritos'
  });
}

/**
 * Hook específico para proteger acciones del carrito
 */
export function useCartProtection() {
  return useProtectedAction({
    requireVerification: true,
    loginMessage: 'Inicia sesión para agregar productos al carrito',
    verificationMessage: 'Verifica tu cuenta para realizar compras'
  });
}
