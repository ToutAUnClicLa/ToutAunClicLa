"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useAuthProtection } from './useAuthProtection';
import * as favoritesService from '@/lib/services/favorites';
import { toast } from 'sonner';
import { useTranslation } from './useTranslation';

/**
 * Hook para manejar favoritos con protección de autenticación integrada
 * Proporciona funcionalidades completas para gestión de favoritos
 * 
 * @param options.loadOnMount - Si debe cargar favoritos automáticamente (default: false)
 * @param options.trackFavorites - Si debe mantener seguimiento de favoritos (default: false)
 */
export function useFavorites(options: { loadOnMount?: boolean; trackFavorites?: boolean } = {}) {
  const { loadOnMount = false, trackFavorites = false } = options;
  
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
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

  // Cargar favoritos cuando el usuario esté autenticado (solo si está habilitado)
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

  // Solo cargar favoritos si está habilitado loadOnMount
  useEffect(() => {
    if (loadOnMount) {
      loadFavorites();
    }
  }, [loadFavorites, loadOnMount]);

  // Agregar a favoritos (sin verificación previa)
  const addToFavorites = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      setIsLoading(true);
      try {
        await favoritesService.addToFavorites(parseInt(productId));
        
        // Solo actualizar el estado local si trackFavorites está habilitado
        if (trackFavorites) {
          setFavoriteIds(prev => {
            const newIds = new Set(prev);
            newIds.add(productId);
            return newIds;
          });
        }
        
        toast.success(t('favorites.messages.added'));
      } catch (error: any) {
        toast.error(error.message || t('favorites.messages.errorAdd'));
        throw error;
      } finally {
        setIsLoading(false);
      }
    });
  }, [executeForFavorites, trackFavorites]);

  // Remover de favoritos (sin verificación previa)
  const removeFromFavorites = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      setIsLoading(true);
      try {
        await favoritesService.removeFromFavorites(parseInt(productId));
        
        // Solo actualizar el estado local si trackFavorites está habilitado
        if (trackFavorites) {
          setFavoriteIds(prev => {
            const newIds = new Set(prev);
            newIds.delete(productId);
            return newIds;
          });
        }
        
        toast.success(t('favorites.messages.removed'));
      } catch (error: any) {
        toast.error(error.message || t('favorites.messages.errorRemove'));
        throw error;
      } finally {
        setIsLoading(false);
      }
    });
  }, [executeForFavorites, trackFavorites]);

  // Toggle favorito - agregar directo sin verificar estado previo
  const toggleFavorite = useCallback(async (productId: string) => {
    return executeForFavorites(async () => {
      setIsLoading(true);
      
      try {
        // Intentar agregar primero, si falla (409), entonces remover
        try {
          await favoritesService.addToFavorites(parseInt(productId));
          
          if (trackFavorites) {
            setFavoriteIds(prev => {
              const newIds = new Set(prev);
              newIds.add(productId);
              return newIds;
            });
          }
          
          toast.success(t('favorites.messages.added'));
        } catch (addError: any) {
          // Si da error 409 (ya existe), entonces remover
          if (addError.message?.includes('ya está') || addError.message?.includes('already')) {
            await favoritesService.removeFromFavorites(parseInt(productId));
            
            if (trackFavorites) {
              setFavoriteIds(prev => {
                const newIds = new Set(prev);
                newIds.delete(productId);
                return newIds;
              });
            }
            
            toast.success(t('favorites.messages.removed'));
          } else {
            throw addError;
          }
        }
      } catch (error: any) {
        toast.error(error.message || t('favorites.messages.errorManage'));
        throw error;
      } finally {
        setIsLoading(false);
      }
    });
  }, [executeForFavorites, trackFavorites]);

  // Verificar si un producto es favorito - solo funciona si trackFavorites está habilitado
  const isFavorite = useCallback((productId: string) => {
    if (!trackFavorites) return false; // No verificar si no está habilitado el tracking
    return favoriteIds.has(productId);
  }, [favoriteIds, trackFavorites]);

  return {
    // Estado
    isLoading,
    favoritesCount: trackFavorites ? favoriteIds.size : 0,
    
    // Acciones
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    loadFavorites, // Exponer para cargar manualmente si es necesario
    
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
    
    // Configuración
    trackingEnabled: trackFavorites,
  };
}
