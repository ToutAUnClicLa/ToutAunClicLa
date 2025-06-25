/**
 * Hook personalizado para gestión de favoritos
 * Proporciona estado y funciones para manejar favoritos de manera reactiva
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import * as favoritesService from '@/lib/services/favorites';
import { useAuth } from './useAuth';

interface UseFavoritesOptions {
  autoLoad?: boolean;
  page?: number;
  limit?: number;
}

export function useFavorites(options: UseFavoritesOptions = {}) {
  const { autoLoad = true, page = 1, limit = 20 } = options;
  const { isAuthenticated } = useAuth();
  
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
    if (!isAuthenticated) {
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
    } catch (err: any) {
      setError(err.message || 'Error al cargar favoritos');
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, isAuthenticated]);

  // Agregar a favoritos
  const addToFavorites = useCallback(async (productId: number) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar favoritos');
      return false;
    }

    try {
      const favorite = await favoritesService.addToFavorites(productId);
      
      // Actualizar estado local
      setFavorites(prev => [favorite, ...prev]);
      setPagination(prev => ({
        ...prev,
        totalItems: prev.totalItems + 1
      }));
      
      toast.success('Producto agregado a favoritos');
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Error al agregar a favoritos');
      return false;
    }
  }, [isAuthenticated]);

  // Eliminar de favoritos
  const removeFromFavorites = useCallback(async (productId: number) => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      await favoritesService.removeFromFavorites(productId);
      
      // Actualizar estado local
      setFavorites(prev => prev.filter(fav => fav.producto_id !== productId));
      setPagination(prev => ({
        ...prev,
        totalItems: prev.totalItems - 1
      }));
      
      toast.success('Producto eliminado de favoritos');
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar de favoritos');
      return false;
    }
  }, [isAuthenticated]);

  // Toggle favorito
  const toggleFavorite = useCallback(async (productId: number) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para gestionar favoritos');
      return false;
    }

    try {
      const result = await favoritesService.toggleFavorite(productId);
      
      if (result.isFavorite) {
        // Se agregó a favoritos, recargar la lista
        await loadFavorites();
      } else {
        // Se eliminó de favoritos, actualizar estado local
        setFavorites(prev => prev.filter(fav => fav.producto_id !== productId));
        setPagination(prev => ({
          ...prev,
          totalItems: prev.totalItems - 1
        }));
      }
      
      toast.success(result.message);
      return result.isFavorite;
    } catch (err: any) {
      toast.error(err.message || 'Error al gestionar favorito');
      return false;
    }
  }, [isAuthenticated, loadFavorites]);

  // Verificar si un producto está en favoritos
  const isFavorite = useCallback((productId: number) => {
    return favorites.some(fav => fav.producto_id === productId);
  }, [favorites]);

  // Obtener conteo de favoritos
  const getFavoritesCount = useCallback(async () => {
    if (!isAuthenticated) return 0;
    
    try {
      return await favoritesService.getFavoritesCount();
    } catch (err) {
      console.error('Error getting favorites count:', err);
      return 0;
    }
  }, [isAuthenticated]);

  // Cargar favoritos automáticamente al montar el componente
  useEffect(() => {
    if (autoLoad && isAuthenticated) {
      loadFavorites();
    }
  }, [autoLoad, isAuthenticated, loadFavorites]);

  // Limpiar estado cuando el usuario se deslogea
  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      setError(null);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
      });
    }
  }, [isAuthenticated]);

  return {
    // Estado
    favorites,
    isLoading,
    error,
    pagination,
    
    // Funciones
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    
    // Estado derivado
    isEmpty: favorites.length === 0,
    totalCount: pagination.totalItems,
  };
}
