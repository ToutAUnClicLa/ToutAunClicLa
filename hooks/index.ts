/**
 * Exportaciones principales de hooks personalizados
 * Proporciona acceso unificado a todos los hooks de la aplicación
 */

// Hooks de autenticación
export { useAuth } from './useAuth';
export { useAuthProtection } from './useAuthProtection';
export { useProtectedAction, useFavoritesProtection, useCartProtection } from './useProtectedAction';

// Hooks de datos y funcionalidad
export { useCart } from './useCart';
export { useCartCount, useCartSync } from './useCartCount';
export { useFavorites } from './useFavorites';
export { useFavoritesList } from './useFavoritesList';
export { useProducts, useProductsByCategory, useProduct, useRestaurantMenu } from './useProducts';
export { useCategories, useSubcategories } from './useCategories';
export { useTranslation } from './useTranslation';
export { useCatalog } from './useCatalog';

// Utilidades
export { toast } from './use-toast';
