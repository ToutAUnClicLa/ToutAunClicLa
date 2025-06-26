"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAuthProtection } from './useAuthGuard';
import * as favoritesService from '@/lib/services/favorites';
import { toast } from 'sonner';

/**
 * Hook optimizado para manejar favoritos con protección de autenticación
 */
export function useFavorites() {
  const { isAuthenticated, user } = useAuth();
  const {
    executeForFavorites,
    canPerformAction,
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
  } = useAuthProtection();

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Cargar favoritos cuando el usuario esté autenticado
  const loadFavorites = useCallback(async () => {
    if (!canPerformAction()) {
      setFavoriteIds(new Set());
      return;
    }

    try {
      setIsLoading(true);
      const response = await favoritesService.getFavorites();
      const ids = new Set(response.favorites.map((fav: favoritesService.FavoriteItem) => fav.producto_id.toString()));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavoriteIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, [canPerformAction]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Agregar a favoritos
  const addToFavorites = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      setIsLoading(true);
      try {
        await favoritesService.addToFavorites(parseInt(productId));
        setFavoriteIds(prev => new Set(Array.from(prev).concat(productId)));
        toast.success('Producto agregado a favoritos');
      } catch (error: any) {
        toast.error(error.message || 'Error al agregar a favoritos');
        throw error;
      } finally {
        setIsLoading(false);
      }
    });
  }, [executeForFavorites]);

  // Remover de favoritos
  const removeFromFavorites = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      setIsLoading(true);
      try {
        await favoritesService.removeFromFavorites(parseInt(productId));
        setFavoriteIds(prev => {
          const newIds = Array.from(prev).filter(id => id !== productId);
          return new Set(newIds);
        });
        toast.success('Producto removido de favoritos');
      } catch (error: any) {
        toast.error(error.message || 'Error al remover de favoritos');
        throw error;
      } finally {
        setIsLoading(false);
      }
    });
  }, [executeForFavorites]);

  // Toggle favorito
  const toggleFavorite = useCallback(async (productId: string) => {
    const isFav = favoriteIds.has(productId);
    if (isFav) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  }, [favoriteIds, addToFavorites, removeFromFavorites]);

  // Verificar si un producto es favorito
  const isFavorite = useCallback((productId: string) => {
    return favoriteIds.has(productId);
  }, [favoriteIds]);

  return {
    // Estado
    isLoading,
    favoritesCount: favoriteIds.size,
    
    // Acciones
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    
    // Utilidades
    isFavorite,
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
