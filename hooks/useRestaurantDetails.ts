/**
 * 🚀 useRestaurantDetails - Hook Optimizado para Máxima Performance
 *
 * OPTIMIZACIONES IMPLEMENTADAS:
 * ===============================
 *
 * 1. 🎯 CACHE MULTI-CAPA:
 *    - Cache individual por restaurante (10min TTL)
 *    - Cache de lista completa (5min TTL)
 *    - Datos stale disponibles hasta 30min como fallback
 *
 * 2. ⚡ LOADING INSTANTÁNEO:
 *    - Si hay cache: loading = false inmediatamente
 *    - Stale-while-revalidate: muestra datos viejos mientras actualiza
 *    - Estados de "Verificando..." minimizados al máximo
 *
 * 3. 🔄 DEDUPLICACIÓN DE REQUESTS:
 *    - Previene múltiples requests simultáneos al mismo restaurante
 *    - Map de requests pendientes compartido globalmente
 *
 * 4. 📈 ESTRATEGIAS DE PRECARGA:
 *    - Auto-precarga los 5 restaurantes más populares
 *    - Función preloadRestaurant() para precarga manual
 *    - Cache compartido entre componentes
 *
 * 5. 🛡️ UX OPTIMIZADA:
 *    - Evita re-requests innecesarios con referencias
 *    - Estados de error mejorados con fallback
 *    - Cleanup robusto para evitar memory leaks
 *
 * PERFORMANCE ESPERADA:
 * ====================
 * - Primera carga: ~200-500ms (igual que antes)
 * - Cargas subsecuentes: ~0-50ms (instantáneo desde cache)
 * - Con datos stale: ~0ms + background update
 * - Múltiples ProductCard del mismo restaurante: ~0ms después del primero
 *
 * USO:
 * ====
 * const { restaurant, loading, error } = useRestaurantDetails('Restaurant Name');
 *
 * // Precarga opcional para restaurantes populares:
 * preloadRestaurant('Popular Restaurant');
 *
 * // Invalidación manual si es necesario:
 * const { invalidateRestaurant } = useRestaurantCacheInvalidation();
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { DiaAbierto } from '@/lib/services/restaurants';
import { apiCache, generateCacheKey } from '@/lib/utils/cache';

interface RestaurantDetails {
  id: number;
  nombre: string;
  Imagen?: string;
  Descripcion?: string;
  dias_abiertos?: DiaAbierto[];
  nacionalidades?: string[];
  disponible: boolean;
  abierto: boolean;
  puede_recibir_pedidos?: boolean;
  codigo_postal?: string;
  gmail?: string;
}

interface UseRestaurantDetailsReturn {
  restaurant: RestaurantDetails | null;
  loading: boolean;
  error: string | null;
}

// Utilidad para precargar restaurantes populares
export const preloadRestaurant = async (restaurantName: string): Promise<void> => {
  try {
    const normalizedName = restaurantName.toLowerCase().trim();
    const cacheKey = generateCacheKey('restaurant_details', { name: normalizedName });

    // Solo precargar si no está en cache
    if (!apiCache.has(cacheKey)) {
      console.log(`🔄 Precargando restaurante: ${restaurantName}`);

      const response = await fetch(`${PRODUCTS_BASE_URL}/restaurants`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'omit',
      });

      const data = await response.json();

      if (response.ok && data.restaurants) {
        const foundRestaurant = data.restaurants.find(
          (r: RestaurantDetails) => r.nombre.toLowerCase() === normalizedName
        );

        if (foundRestaurant) {
          apiCache.set(cacheKey, foundRestaurant, RESTAURANT_CACHE_TTL);
          console.log(`✅ Restaurante precargado: ${restaurantName}`);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️ Error precargando restaurante ${restaurantName}:`, error);
  }
};

// Utilidad para limpiar cache de restaurantes
export const clearRestaurantCache = (restaurantName?: string): void => {
  if (restaurantName) {
    const cacheKey = generateCacheKey('restaurant_details', { name: restaurantName.toLowerCase() });
    apiCache.delete(cacheKey);
    console.log(`🗑️ Cache limpiado para: ${restaurantName}`);
  } else {
    // Limpiar todos los caches de restaurantes
    apiCache.clear();
    console.log('🗑️ Todo el cache de restaurantes limpiado');
  }
};

// Configuración de URLs - usar proxy en desarrollo, directo en producción
const isDev = process.env.NODE_ENV === 'development';
const PRODUCTS_BASE_URL = isDev
  ? '/api/backend/products'  // Usar proxy de Next.js en desarrollo
  : 'https://backendtoutaunclicla-production.up.railway.app/api/v1/products'; // Directo en producción

// Cache específico para deduplicar requests en vuelo
const pendingRequests = new Map<string, Promise<any>>();

// Cache de alta frecuencia para restaurantes individuales
const RESTAURANT_CACHE_TTL = 10 * 60 * 1000; // 10 minutos
const RESTAURANTS_LIST_CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const STALE_WHILE_REVALIDATE_TTL = 30 * 60 * 1000; // 30 minutos para datos stale

// Headers comunes para todas las requests
const getHeaders = () => {
  // Verificar si estamos en el cliente
  if (typeof window === 'undefined') {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  const token = localStorage.getItem('auth_token');

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Hook para invalidar cache cuando sea necesario
export const useRestaurantCacheInvalidation = () => {
  const invalidateRestaurant = useCallback((restaurantName: string) => {
    clearRestaurantCache(restaurantName);
  }, []);

  const invalidateAllRestaurants = useCallback(() => {
    clearRestaurantCache();
  }, []);

  return { invalidateRestaurant, invalidateAllRestaurants };
};

/**
 * Hook optimizado para obtener detalles de restaurante con cache multi-capa
 * y estrategias de loading optimistas
 */
export function useRestaurantDetails(restaurantName: string | null): UseRestaurantDetailsReturn {
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const lastRequestRef = useRef<string | null>(null);

  // Función para obtener restaurante desde cache o API con stale-while-revalidate
  const getRestaurantWithCache = useCallback(async (name: string): Promise<RestaurantDetails | null> => {
    const normalizedName = name.toLowerCase().trim();
    const cacheKey = generateCacheKey('restaurant_details', { name: normalizedName });

    // 1. Verificar cache individual del restaurante
    const cachedRestaurant = apiCache.get<RestaurantDetails>(cacheKey);
    if (cachedRestaurant) {
      console.log(`🚀 Cache hit para restaurante: ${name}`);
      return cachedRestaurant;
    }

    // 2. Verificar si hay datos stale disponibles para loading optimista
    const staleRestaurant = apiCache.get<RestaurantDetails>(cacheKey, true);

    // 3. Verificar cache de lista completa de restaurantes
    const restaurantsListCacheKey = 'restaurants_complete';
    const cachedRestaurantsList = apiCache.get<any>(restaurantsListCacheKey);

    if (cachedRestaurantsList?.restaurants) {
      const foundInList = cachedRestaurantsList.restaurants.find(
        (r: RestaurantDetails) => r.nombre.toLowerCase() === normalizedName
      );

      if (foundInList) {
        console.log(`📋 Cache hit desde lista de restaurantes: ${name}`);
        // Cachear individualmente para próximas requests
        apiCache.set(cacheKey, foundInList, RESTAURANT_CACHE_TTL);
        return foundInList;
      }
    }

    // 4. Si tenemos datos stale, los devolvemos inmediatamente y revalidamos en background
    if (staleRestaurant) {
      console.log(`⚡ Usando datos stale para ${name}, revalidando en background...`);

      // Revalidar en background sin bloquear
      setTimeout(() => {
        fetchRestaurantFromAPI(name, cacheKey).catch(console.error);
      }, 0);

      return staleRestaurant;
    }

    // 5. Fetch from API (with request deduplication)
    return await fetchRestaurantFromAPI(name, cacheKey);
  }, []);

  // Función para fetch desde API con deduplicación de requests
  const fetchRestaurantFromAPI = useCallback(async (name: string, cacheKey: string): Promise<RestaurantDetails | null> => {
    const normalizedName = name.toLowerCase().trim();

    // Deduplicar requests simultáneos
    if (pendingRequests.has(cacheKey)) {
      console.log(`🔄 Request ya en progreso para: ${name}`);
      return await pendingRequests.get(cacheKey)!;
    }

    const requestPromise = (async () => {
      try {
        console.log(`🌐 Fetching restaurant from API: ${name}`);

        const response = await fetch(`${PRODUCTS_BASE_URL}/restaurants`, {
          method: 'GET',
          headers: getHeaders(),
          credentials: 'omit',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || `HTTP ${response.status}: Error al obtener restaurante`);
        }

        // Cachear la lista completa para otros restaurantes
        const restaurantsListCacheKey = 'restaurants_complete';
        apiCache.set(restaurantsListCacheKey, data, RESTAURANTS_LIST_CACHE_TTL);

        // Buscar el restaurante específico
        const foundRestaurant = data.restaurants?.find(
          (r: RestaurantDetails) => r.nombre.toLowerCase() === normalizedName
        );

        if (!foundRestaurant) {
          throw new Error(`Restaurante "${name}" no encontrado`);
        }

        // Cachear individualmente
        apiCache.set(cacheKey, foundRestaurant, RESTAURANT_CACHE_TTL);

        // Pre-cachear otros restaurantes populares para mejor performance
        if (data.restaurants?.length > 0) {
          data.restaurants.slice(0, 5).forEach((r: RestaurantDetails) => {
            const otherCacheKey = generateCacheKey('restaurant_details', { name: r.nombre.toLowerCase() });
            if (!apiCache.has(otherCacheKey)) {
              apiCache.set(otherCacheKey, r, RESTAURANT_CACHE_TTL);
            }
          });
        }

        return foundRestaurant;
      } finally {
        // Limpiar request en progreso
        pendingRequests.delete(cacheKey);
      }
    })();

    // Registrar request en progreso
    pendingRequests.set(cacheKey, requestPromise);

    return await requestPromise;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchRestaurantDetails = async () => {
      if (!restaurantName || restaurantName.trim() === '') {
        setLoading(false);
        setRestaurant(null);
        setError(null);
        return;
      }

      const trimmedName = restaurantName.trim();

      // Evitar re-requests innecesarios
      if (lastRequestRef.current === trimmedName && restaurant?.nombre.toLowerCase() === trimmedName.toLowerCase()) {
        return;
      }

      lastRequestRef.current = trimmedName;

      try {
        setError(null);

        // Verificar cache inmediatamente - si existe, mostrar sin loading
        const cacheKey = generateCacheKey('restaurant_details', { name: trimmedName.toLowerCase() });
        const cachedData = apiCache.get<RestaurantDetails>(cacheKey);

        if (cachedData) {
          console.log(`⚡ Loading instantáneo desde cache: ${trimmedName}`);
          if (isMountedRef.current) {
            setRestaurant(cachedData);
            setLoading(false);
          }
          return;
        }

        // Si no hay cache, mostrar loading
        if (isMountedRef.current) {
          setLoading(true);
        }

        const result = await getRestaurantWithCache(trimmedName);

        if (isMountedRef.current && result) {
          setRestaurant(result);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error fetching restaurant details:', err);
        if (isMountedRef.current) {
          setError(err.message || 'Error al cargar los detalles del restaurante');
          setLoading(false);
        }
      }
    };

    fetchRestaurantDetails();

    return () => {
      isMountedRef.current = false;
    };
  }, [restaurantName, getRestaurantWithCache]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { restaurant, loading, error };
}