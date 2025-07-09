"use client";

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useAuthProtection } from './useAuthProtection';
import * as favoritesService from '@/lib/services/favorites';
import { toast } from 'sonner';

/**
 * Hook simple para manejar favoritos en cards de productos
 * No carga estado inicial, solo permite agregar/quitar con feedback optimista
 */
export function useSimpleFavorites() {
  const { isAuthenticated, user } = useAuth();
  const {
    executeForFavorites,
    canPerformAction,
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
  } = useAuthProtection();

  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  // Agregar a favoritos
  const addToFavorites = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      const id = productId.toString();
      setLoadingItems(prev => new Set(prev).add(id));
      
      try {
        await favoritesService.addToFavorites(parseInt(productId));
        toast.success('Producto agregado a favoritos');
      } catch (error: any) {
        toast.error(error.message || 'Error al agregar a favoritos');
        throw error;
      } finally {
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    });
  }, [executeForFavorites]);

  // Remover de favoritos
  const removeFromFavorites = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      const id = productId.toString();
      setLoadingItems(prev => new Set(prev).add(id));
      
      try {
        await favoritesService.removeFromFavorites(parseInt(productId));
        toast.success('Producto removido de favoritos');
      } catch (error: any) {
        toast.error(error.message || 'Error al remover de favoritos');
        throw error;
      } finally {
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    });
  }, [executeForFavorites]);

  // Toggle favorito - intenta agregar, si ya existe lo remueve
  const toggleFavorite = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      const id = productId.toString();
      setLoadingItems(prev => new Set(prev).add(id));
      
      try {
        // Intentar agregar primero
        try {
          await favoritesService.addToFavorites(parseInt(productId));
          toast.success('Producto agregado a favoritos');
        } catch (addError: any) {
          // Si da error 409 (ya existe), entonces remover
          if (addError.message?.includes('ya está') || addError.message?.includes('already')) {
            await favoritesService.removeFromFavorites(parseInt(productId));
            toast.success('Producto removido de favoritos');
          } else {
            throw addError;
          }
        }
      } catch (error: any) {
        toast.error(error.message || 'Error al gestionar favoritos');
        throw error;
      } finally {
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    });
  }, [executeForFavorites]);

  // Verificar si está cargando un producto específico
  const isLoading = useCallback((productId: string) => {
    return loadingItems.has(productId.toString());
  }, [loadingItems]);

  return {
    // Acciones
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    
    // Estado de carga
    isLoading,
    
    // Utilidades
    canAddToFavorites: canPerformAction,
    
    // Modal de autenticación
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    
    // Estado de autenticación
    isAuthenticated,
    isVerified: user?.verified || false,
  };
}
