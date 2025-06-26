"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useAuthProtection } from './useAuthProtection';
import * as favoritesService from '@/lib/services/favorites';
import { toast } from 'sonner';

/**
 * Hook para manejar favoritos con protección de autenticación integrada
 * Proporciona funcionalidades completas para gestión de favoritos con validación automática
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

  // Referencias estables para evitar re-renders infinitos
  const authRef = useRef({ isAuthenticated, user });
  const loadingRef = useRef(false);

  // Actualizar referencias cuando cambien los valores
  useEffect(() => {
    authRef.current = { isAuthenticated, user };
  }, [isAuthenticated, user]);

  // Cargar favoritos cuando el usuario esté autenticado
  const loadFavorites = useCallback(async () => {
    const { isAuthenticated: auth, user: currentUser } = authRef.current;
    
    if (!auth || !currentUser?.verified) {
      setFavoriteIds(new Set());
      return;
    }

    if (loadingRef.current) {
      return; // Evitar múltiples cargas simultáneas
    }

    try {
      loadingRef.current = true;
      setIsLoading(true);
      const response = await favoritesService.getFavorites();
      const ids = new Set(response.favorites.map((fav: favoritesService.FavoriteItem) => fav.producto_id.toString()));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavoriteIds(new Set());
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Agregar a favoritos
  const addToFavorites = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      setIsLoading(true);
      try {
        await favoritesService.addToFavorites(parseInt(productId));
        setFavoriteIds(prev => {
          const newIds = new Set(prev);
          newIds.add(productId);
          return newIds;
        });
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
          const newIds = new Set(prev);
          newIds.delete(productId);
          return newIds;
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

  // Toggle favorito - usar useCallback estable
  const toggleFavorite = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      const isFav = favoriteIds.has(productId);
      setIsLoading(true);
      
      try {
        if (isFav) {
          await favoritesService.removeFromFavorites(parseInt(productId));
          setFavoriteIds(prev => {
            const newIds = new Set(prev);
            newIds.delete(productId);
            return newIds;
          });
          toast.success('Producto removido de favoritos');
        } else {
          await favoritesService.addToFavorites(parseInt(productId));
          setFavoriteIds(prev => {
            const newIds = new Set(prev);
            newIds.add(productId);
            return newIds;
          });
          toast.success('Producto agregado a favoritos');
        }
      } catch (error: any) {
        toast.error(error.message || 'Error al gestionar favoritos');
        throw error;
      } finally {
        setIsLoading(false);
      }
    });
  }, [executeForFavorites, favoriteIds]);

  // Verificar si un producto es favorito - memoizado con referencia estable
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
