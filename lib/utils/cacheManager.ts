/**
 * Utilidades para gestión de cache y limpieza
 */

import { apiCache } from '@/lib/utils/cache';

// Limpiar cache relacionado con autenticación
export const clearAuthCache = () => {
  // Limpiar todo el cache cuando el usuario hace login/logout
  apiCache.clear();
};

// Limpiar cache de productos específico
export const clearProductsCache = () => {
  // Aquí podríamos ser más específicos y solo limpiar claves relacionadas con productos
  // Por ahora limpiamos todo para simplificar
  apiCache.clear();
};

// Limpiar cache de categorías
export const clearCategoriesCache = () => {
  apiCache.delete('categories');
  // También limpiar subcategorías relacionadas
  // En una implementación más sofisticada, mantendríamos un índice de claves
  apiCache.clear();
};

// Hook para verificar el tamaño del cache (útil para debugging)
export const getCacheStats = () => {
  return {
    size: apiCache.size(),
    timestamp: Date.now()
  };
};
