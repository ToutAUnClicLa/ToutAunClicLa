"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import * as favoritesService from '@/lib/services/favorites';
import { toast } from 'sonner';

/**
 * Hook específico para la página de favoritos
 * Carga y mantiene el estado completo de favoritos
 */
export function useFavoritesPage() {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<favoritesService.FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Cargar favoritos completos
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated || !user?.verified) {
      setFavorites([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const response = await favoritesService.getFavorites(1, 100); // Cargar hasta 100 favoritos
      setFavorites(response.favorites);
      setTotalCount(response.pagination.totalItems);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
      setTotalCount(0);
      toast.error('Error al cargar favoritos');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.verified]);

  // Cargar favoritos al montar el componente
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Remover de favoritos y actualizar lista local
  const removeFromFavorites = useCallback(async (productId: number) => {
    try {
      await favoritesService.removeFromFavorites(productId);
      
      // Actualizar estado local inmediatamente para mejor UX
      setFavorites(prev => prev.filter(fav => fav.producto_id !== productId));
      setTotalCount(prev => Math.max(0, prev - 1));
      
      toast.success('Producto removido de favoritos');
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      toast.error(error.message || 'Error al remover de favoritos');
      // Recargar en caso de error para sincronizar
      loadFavorites();
      throw error;
    }
  }, [loadFavorites]);

  return {
    favorites,
    isLoading,
    totalCount,
    loadFavorites,
    removeFromFavorites,
    isAuthenticated,
    isVerified: user?.verified || false,
  };
}
