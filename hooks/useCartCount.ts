"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

// Cache global para el contador del carrito
let cartCountCache: {
  count: number;
  timestamp: number;
  isLoading: boolean;
} | null = null;

const CACHE_DURATION = 60000; // 1 minuto de cache para el contador
const UPDATE_INTERVAL = 30000; // Actualizar cada 30 segundos si está activo

/**
 * Hook ligero y optimizado solo para el contador del carrito en el navbar
 * No carga items completos, solo el número total
 */
export function useCartCount() {
  const { isAuthenticated, user } = useAuth();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Función para verificar si el cache es válido
  const isCacheValid = useCallback(() => {
    if (!cartCountCache) return false;
    return Date.now() - cartCountCache.timestamp < CACHE_DURATION;
  }, []);

  // Función optimizada para obtener solo el contador
  const getCartCount = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || !user) {
      setCount(0);
      cartCountCache = null;
      return;
    }

    // Usar cache si es válido
    if (!forceRefresh && isCacheValid() && cartCountCache) {
      setCount(cartCountCache.count);
      return;
    }

    // Evitar múltiples peticiones simultáneas
    if (cartCountCache?.isLoading) {
      return;
    }

    try {
      cartCountCache = { count: 0, timestamp: 0, isLoading: true };
      setIsLoading(true);

      // Hacer petición ligera solo por el summary
      const response = await fetch('/api/backend/cart?page=1&limit=1', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newCount = data.summary?.totalQuantity || 0;
        
        // Actualizar cache
        cartCountCache = {
          count: newCount,
          timestamp: Date.now(),
          isLoading: false
        };
        
        setCount(newCount);
      } else {
        // Error de autenticación u otro
        cartCountCache = null;
        setCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      cartCountCache = null;
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, isCacheValid]);

  // Función para invalidar el cache (llamar cuando se modifique el carrito)
  const invalidateCartCount = useCallback(() => {
    cartCountCache = null;
    if (isAuthenticated && user) {
      getCartCount(true);
    }
  }, [isAuthenticated, user, getCartCount]);

  // Cargar contador inicial y escuchar eventos de cambio
  useEffect(() => {
    if (isAuthenticated && user) {
      getCartCount();
    } else {
      setCount(0);
      cartCountCache = null;
    }

    // Escuchar eventos de cambio del carrito
    const handleCartChange = () => {
      if (isAuthenticated && user) {
        getCartCount(true); // Forzar refresh
      }
    };

    window.addEventListener('cartCountChanged', handleCartChange);
    
    return () => {
      window.removeEventListener('cartCountChanged', handleCartChange);
    };
  }, [isAuthenticated, user, getCartCount]);

  // Actualización periódica en segundo plano (solo si el usuario está activo)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const interval = setInterval(() => {
      // Solo actualizar si el documento está visible (optimización)
      if (!document.hidden) {
        getCartCount();
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, getCartCount]);

  // Limpiar cache cuando el usuario se deslogea
  useEffect(() => {
    if (!isAuthenticated) {
      cartCountCache = null;
      setCount(0);
    }
  }, [isAuthenticated]);

  return useMemo(() => ({
    count,
    isLoading,
    refresh: () => getCartCount(true),
    invalidate: invalidateCartCount,
  }), [count, isLoading, getCartCount, invalidateCartCount]);
}

// Hook para sincronizar cambios del carrito con el contador
export function useCartSync() {
  const { invalidate } = useCartCount();
  
  return useCallback(() => {
    invalidate();
  }, [invalidate]);
}
