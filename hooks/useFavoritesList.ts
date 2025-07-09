"use client";

import { useFavoritesPage } from './useFavoritesPage';

/**
 * Hook específico para obtener la lista completa de favoritos
 * Usado principalmente en la página de favoritos del perfil
 * 
 * @deprecated Use useFavoritesPage instead - este hook es solo para compatibilidad
 */
export function useFavoritesList() {
  const {
    favorites,
    isLoading,
    totalCount,
    loadFavorites,
    removeFromFavorites,
    isAuthenticated,
    isVerified,
  } = useFavoritesPage();

  // Mantener compatibilidad con la interfaz anterior
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(totalCount / 20),
    totalItems: totalCount,
    itemsPerPage: 20,
  };

  return {
    favorites,
    isLoading,
    error: null, // No manejamos errores específicos en la nueva implementación
    pagination,
    totalCount,
    loadFavorites,
    removeFromFavorites,
    isAuthenticated,
    isVerified,
  };
}
