"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as favoritesService from '@/lib/services/favorites';

interface UseFavoritesListOptions {
  autoLoad?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Hook específico para obtener la lista completa de favoritos
 * Usado principalmente en la página de favoritos del perfil
 */
export function useFavoritesList(options: UseFavoritesListOptions = {}) {
  const { autoLoad = true, page = 1, limit = 20 } = options;
  const { isAuthenticated, user } = useAuth();
  
  const [favorites, setFavorites] = useState<favoritesService.FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  // Cargar favoritos
  const loadFavorites = useCallback(async (pageNum = page, limitNum = limit) => {
    if (!isAuthenticated || !user?.verified) {
      setFavorites([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await favoritesService.getFavorites(pageNum, limitNum);
      setFavorites(response.favorites);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Error loading favorites:', error);
      setError(error.message || 'Error al cargar favoritos');
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, isAuthenticated, user?.verified]);

  // Remover de favoritos
  const removeFromFavorites = useCallback(async (productId: number) => {
    try {
      await favoritesService.removeFromFavorites(productId);
      // Actualizar la lista local
      setFavorites(prev => prev.filter(fav => fav.producto_id !== productId));
      // Actualizar paginación
      setPagination(prev => ({
        ...prev,
        totalItems: prev.totalItems - 1,
      }));
      return true;
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      setError(error.message || 'Error al remover de favoritos');
      return false;
    }
  }, []);

  // Cargar al montar si autoLoad está habilitado
  useEffect(() => {
    if (autoLoad) {
      loadFavorites();
    }
  }, [autoLoad, loadFavorites]);

  return {
    // Estado
    favorites,
    isLoading,
    error,
    pagination,
    
    // Acciones
    loadFavorites,
    removeFromFavorites,
    
    // Utilidades
    isEmpty: favorites.length === 0,
    totalCount: pagination.totalItems,
    
    // Estado de autenticación
    isAuthenticated,
    isVerified: user?.verified || false,
  };
}
