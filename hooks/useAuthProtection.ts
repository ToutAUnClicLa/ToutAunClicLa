"use client";

import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { useState } from 'react';

/**
 * Hook simple para proteger acciones que requieren autenticación
 * Incluye modal automático cuando es necesario
 */
export function useAuthProtection() {
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  /**
   * Verifica si el usuario puede realizar acciones
   */
  const canPerformAction = () => {
    return isAuthenticated && user?.verified;
  };

  /**
   * Ejecuta una acción solo si el usuario está autenticado y verificado
   */
  const executeProtected = (
    action: () => void | Promise<void>,
    errorMessage = "Debes iniciar sesión para realizar esta acción"
  ) => {
    if (!isAuthenticated || !user) {
      toast.error(errorMessage);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return false;
    }
    
    if (!user.verified) {
      toast.error("Debes verificar tu cuenta para realizar esta acción");
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return false;
    }
    
    action();
    return true;
  };

  /**
   * Para favoritos específicamente
   */
  const executeForFavorites = (action: () => void | Promise<void>) => {
    return executeProtected(action, "Inicia sesión para gestionar tus favoritos");
  };

  /**
   * Para carrito específicamente
   */
  const executeForCart = (action: () => void | Promise<void>) => {
    return executeProtected(action, "Inicia sesión para agregar productos al carrito");
  };

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
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
  };
}
