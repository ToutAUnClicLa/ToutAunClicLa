"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { 
  cartService,
  type CartItem,
  type CartSummary,
  type Coupon
} from '@/lib/services/cart';
import { useAuth } from '@/hooks/useAuth';

// Función para notificar cambios al contador del carrito
const notifyCartCountChange = () => {
  // Disparar evento personalizado para sincronizar el contador
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cartCountChanged'));
  }
};

interface UseCartOptions {
  autoLoad?: boolean;
  page?: number;
  limit?: number;
  lazy?: boolean; // Solo cargar cuando se solicite explícitamente
}

// Cache global para evitar múltiples peticiones
let globalCartCache: {
  data: any;
  timestamp: number;
  isLoading: boolean;
} | null = null;

const CACHE_DURATION = 30000; // 30 segundos de cache
const DEBOUNCE_DELAY = 300; // 300ms de debounce

export function useCart(options: UseCartOptions = {}) {
  const { autoLoad = false, page = 1, limit = 20, lazy = true } = options; // lazy por defecto
  const { user, isAuthenticated } = useAuth();
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<CartSummary>({
    totalItems: 0,
    totalQuantity: 0,
    subtotal: 0,
    total: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Referencias para manejar debouncing y cancelación
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isComponentMountedRef = useRef(true);

  // Función para verificar si el cache es válido
  const isCacheValid = useCallback(() => {
    if (!globalCartCache) return false;
    return Date.now() - globalCartCache.timestamp < CACHE_DURATION;
  }, []);

  // Función optimizada para cargar carrito con cache y debouncing
  const loadCart = useCallback(async (pageNum = page, limitNum = limit, forceRefresh = false) => {
    // No cargar si no está autenticado
    if (!isAuthenticated || !user) {
      if (isComponentMountedRef.current) {
        console.log('User not authenticated, clearing cart state');
        setItems([]);
        setSummary({
          totalItems: 0,
          totalQuantity: 0,
          subtotal: 0,
          total: 0,
        });
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20,
          hasNextPage: false,
          hasPrevPage: false,
        });
        setIsLoading(false);
        setHasLoadedOnce(true);
      }
      return;
    }

    // Usar cache si es válido y no es refresh forzado
    if (!forceRefresh && isCacheValid() && globalCartCache?.data) {
      console.log('Using cached cart data');
      const response = globalCartCache.data;
      if (isComponentMountedRef.current) {
        setItems(response.cartItems || []);
        setSummary(response.summary);
        setPagination(response.pagination);
        setHasLoadedOnce(true);
      }
      return;
    }

    // Evitar múltiples peticiones simultáneas
    if (globalCartCache?.isLoading) {
      console.log('Cart loading already in progress, skipping...');
      return;
    }

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();

    try {
      globalCartCache = { data: null, timestamp: 0, isLoading: true };
      
      if (isComponentMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }
      
      console.log('Loading cart for user:', user.id);
      const response = await cartService.getCart(pageNum, limitNum);
      console.log('Cart loaded successfully:', response);
      
      // Actualizar cache global
      globalCartCache = {
        data: response,
        timestamp: Date.now(),
        isLoading: false
      };
      
      if (isComponentMountedRef.current) {
        setItems(response.cartItems || []);
        setSummary(response.summary);
        setPagination(response.pagination);
        setHasLoadedOnce(true);
      }
    } catch (err: any) {
      globalCartCache = { data: null, timestamp: 0, isLoading: false };
      
      if (isComponentMountedRef.current) {
        console.error('Error loading cart:', err);
        
        // Si es error de autenticación, no mostrar como error
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          console.log('Authentication error, user needs to login');
          setError(null);
        } else {
          setError('Error al cargar el carrito');
          toast.error('Error al cargar el carrito');
        }
        
        setItems([]);
        setSummary({
          totalItems: 0,
          totalQuantity: 0,
          subtotal: 0,
          total: 0,
        });
        setHasLoadedOnce(true);
      }
    } finally {
      if (isComponentMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [page, limit, isAuthenticated, user, isCacheValid]);

  // Función con debouncing para evitar múltiples calls
  const debouncedLoadCart = useCallback((pageNum = page, limitNum = limit, forceRefresh = false) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      loadCart(pageNum, limitNum, forceRefresh);
    }, DEBOUNCE_DELAY);
  }, [loadCart, page, limit]);

  // Función pública para cargar manualmente (sin debounce)
  const loadCartNow = useCallback(async (forceRefresh = false) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    await loadCart(page, limit, forceRefresh);
  }, [loadCart, page, limit]);

  // Invalidar cache cuando se hacen cambios
  const invalidateCache = useCallback(() => {
    globalCartCache = null;
  }, []);

  // Agregar producto al carrito (optimizado)
  const addToCart = useCallback(async (productId: number, quantity: number = 1): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      setError(null);
      console.log('Adding product to cart:', { productId, quantity });
      
      const newItem = await cartService.addToCart(productId, quantity);
      console.log('Product added successfully:', newItem);
      
      // Invalidar cache y recargar
      invalidateCache();
      await loadCartNow(true); // Forzar refresh
      notifyCartCountChange(); // Notificar cambio al contador
      return true;
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      setError('Error al agregar producto al carrito');
      
      if (err.message?.includes('unidades disponibles')) {
        toast.error(err.message);
      } else if (err.message?.includes('no encontrado')) {
        toast.error('Producto no encontrado');
      } else if (err.message?.includes('iniciar sesión')) {
        toast.error('Debes iniciar sesión para agregar productos');
      } else {
        toast.error('Error al agregar producto al carrito');
      }
      return false;
    }
  }, [isAuthenticated, user, invalidateCache, loadCartNow]);

  // Actualizar cantidad (optimizado)
  const updateQuantity = useCallback(async (itemId: string, quantity: number): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      setError(null);
      
      // Actualización optimista del estado local
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, cantidad: quantity }
          : item
      ));

      await cartService.updateCartItem(itemId, quantity);
      
      // Invalidar cache y recargar para obtener totales correctos
      invalidateCache();
      await loadCartNow(true);
      notifyCartCountChange(); // Notificar cambio al contador
      return true;
    } catch (err: any) {
      console.error('Error updating cart quantity:', err);
      setError('Error al actualizar cantidad');
      
      // Recargar para restaurar estado correcto
      await loadCartNow(true);
      return false;
    }
  }, [isAuthenticated, user, invalidateCache, loadCartNow]);

  // Remover producto (optimizado)
  const removeFromCart = useCallback(async (itemId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      setError(null);
      
      // Actualización optimista del estado local
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      await cartService.removeFromCart(itemId);
      
      // Invalidar cache y recargar
      invalidateCache();
      await loadCartNow(true);
      notifyCartCountChange(); // Notificar cambio al contador
      return true;
    } catch (err: any) {
      console.error('Error removing from cart:', err);
      setError('Error al eliminar producto del carrito');
      
      // Recargar para restaurar estado correcto
      await loadCartNow(true);
      return false;
    }
  }, [isAuthenticated, user, invalidateCache, loadCartNow]);

  // Limpiar carrito (optimizado)
  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para limpiar el carrito');
      return false;
    }

    try {
      setError(null);
      
      const result = await cartService.clearCart();
      
      // Limpiar estado inmediatamente
      setItems([]);
      setSummary({
        totalItems: 0,
        totalQuantity: 0,
        subtotal: 0,
        total: 0,
      });
      setAppliedCoupon(null);
      
      // Invalidar cache
      invalidateCache();
      notifyCartCountChange(); // Notificar cambio al contador
      
      return true;
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      setError('Error al limpiar carrito');
      toast.error(err.message || 'Error al limpiar carrito');
      return false;
    }
  }, [isAuthenticated, user, invalidateCache]);

  // Aplicar cupón (optimizado)
  const applyCoupon = useCallback(async (couponCode: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para aplicar cupones');
      return false;
    }

    try {
      setError(null);
      
      const result = await cartService.applyCoupon(couponCode);
      
      setAppliedCoupon(result.coupon);
      setSummary(result.summary);
      
      // Invalidar cache para próximas cargas
      invalidateCache();
      
      toast.success('Cupón aplicado correctamente');
      return true;
    } catch (err: any) {
      console.error('Error applying coupon:', err);
      setError('Error al aplicar cupón');
      toast.error(err.message || 'Error al aplicar cupón');
      return false;
    }
  }, [isAuthenticated, user, invalidateCache]);

  // Función pública para refrescar carrito
  const refreshCart = useCallback(async () => {
    await loadCartNow(true);
  }, [loadCartNow]);

  // Verificar si un producto está en el carrito (memoizado)
  const isInCart = useCallback((productId: number) => {
    return items.some(item => item.producto_id === productId);
  }, [items]);

  // Obtener cantidad de un producto en el carrito (memoizado)
  const getProductQuantity = useCallback((productId: number) => {
    const item = items.find(item => item.producto_id === productId);
    return item?.cantidad || 0;
  }, [items]);

  // Estado derivado memoizado para evitar re-renders
  const derivedState = useMemo(() => ({
    isEmpty: items.length === 0,
    totalItems: summary?.totalItems || 0,
    totalQuantity: summary?.totalQuantity || 0,
    subtotal: summary?.subtotal || 0,
    total: summary?.total || 0,
  }), [items.length, summary]);

  // Efecto para autoLoad SOLO cuando sea necesario
  useEffect(() => {
    if (autoLoad && !lazy && !hasLoadedOnce && isAuthenticated && user) {
      console.log('Auto-loading cart...');
      debouncedLoadCart();
    }
  }, [autoLoad, lazy, hasLoadedOnce, isAuthenticated, user, debouncedLoadCart]);

  // Limpiar estado cuando el usuario se deslogea
  useEffect(() => {
    if (!isAuthenticated && hasLoadedOnce) { // Solo ejecutar si ya se había cargado antes
      console.log('User logged out, clearing cart state');
      setItems([]);
      setError(null);
      setSummary({
        totalItems: 0,
        totalQuantity: 0,
        subtotal: 0,
        total: 0,
      });
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });
      setAppliedCoupon(null);
      setHasLoadedOnce(false);
      
      // Limpiar cache global
      globalCartCache = null;
    }
  }, [isAuthenticated, hasLoadedOnce]); // Agregar hasLoadedOnce como dependencia

  // Cleanup en unmount
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    return () => {
      isComponentMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Estado
    items,
    isLoading,
    error,
    summary,
    pagination,
    appliedCoupon,
    hasLoadedOnce,
    
    // Funciones optimizadas
    loadCart: loadCartNow, // Exponer la versión sin debounce para uso manual
    loadCartNow, // Exponer también con el nombre original
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    refreshCart,
    
    // Utilidades memoizadas
    isInCart,
    getProductQuantity,
    
    // Estado derivado memoizado
    ...derivedState,
  };
}
