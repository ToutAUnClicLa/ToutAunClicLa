/**
 * Exportaciones principales de hooks personalizados
 * Proporciona acceso unificado a todos los hooks de la aplicación
 */

// Hooks principales
export { useAuth } from './useAuth';
export { useCart } from './useCart';
export { useFavorites } from './useFavorites';
export { useProducts, useProductsByCategory, useProduct, useRestaurantMenu } from './useProducts';
export { useCategories, useSubcategories } from './useCategories';
export { useTranslation } from './useTranslation';
export { useCatalog } from './useCatalog';

// Re-exportación del hook de toast
export { toast } from './use-toast';
