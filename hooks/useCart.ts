"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { 
  cartService,
  type CartItem,
  type CartSummary,
  type Coupon,
  type DeliveryOptions,
  type DeliveryUpdateResponse
} from '@/lib/services/cart';
import { validateCartSummary, validateCartResponse, logBackendDataQuality } from '@/lib/utils/cart-validation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t } = useTranslation();
  
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
        // 🚚 CRITICAL FIX: Ensure cached data preserves shipping fields
        setSummary({
          ...response.summary,
          shippingMessage: response.summary?.shippingMessage || null,
          needsAddress: response.summary?.needsAddress || false
        });
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
      const rawResponse = await cartService.getCart(pageNum, limitNum);
      
      // 🚨 VALIDATE AND ENRICH BACKEND DATA
      const response = validateCartResponse(rawResponse);
      const validatedSummary = validateCartSummary(response.summary);
      
      console.log('Cart loaded successfully:', response);
      logBackendDataQuality(validatedSummary, 'loadCart');
      
      // Actualizar cache global
      globalCartCache = {
        data: response,
        timestamp: Date.now(),
        isLoading: false
      };
      
      if (isComponentMountedRef.current) {
        setItems(response.cartItems || []);
        setSummary(validatedSummary);
        setPagination(response.pagination);
        setHasLoadedOnce(true);
        
        // 🔍 Enhanced debug log for shipping state
        if (validatedSummary.shippingMessage || validatedSummary.needsAddress) {
          console.log('🚚 Cart loaded with advanced shipping state:', {
            needsAddress: validatedSummary.needsAddress,
            shippingMessage: validatedSummary.shippingMessage,
            shippingCost: validatedSummary.shippingCost,
            threshold: validatedSummary.shippingThreshold
          });
        }
      }
    } catch (err: any) {
      globalCartCache = { data: null, timestamp: 0, isLoading: false };
      
      if (isComponentMountedRef.current) {
        console.error('🚨 Error loading cart:', err);
        
        // Enhanced error handling with backend-first fallback approach
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          console.log('Authentication error, user needs to login');
          setError(null);
        } else if (err.message?.includes('shippingThreshold')) {
          console.warn('Backend missing shippingThreshold, using fallback cart state');
          setError(null); // Don't show error to user for backend field issues
        } else if (err.message?.includes('Network')) {
          setError('Sin conexión a internet');
          toast.error(t('cart.notifications.networkError'));
        } else {
          setError('Error al cargar el carrito');
          toast.error(t('cart.notifications.loadError'));
        }
        
        // Reset to empty state with validated defaults
        setItems([]);
        setSummary(validateCartSummary(undefined)); // Use validation utility for consistent empty state
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
  const addToCart = useCallback(async (
    productId: number,
    quantity: number = 1,
    deliveryOptions?: {
      metodoEntrega?: 'puerta' | 'manos' | 'recepcion';
      notasEntrega?: string;
    },
    variations?: Array<{
      variationId: number;
      quantity: number;
    }>
  ): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error(t('cart.notifications.addToCartAuthRequired'));
      return false;
    }

    try {
      setError(null);
      console.log('Adding product to cart:', { 
        productId, 
        quantity,
        variations: variations?.length || 0,
        deliveryOptions: !!deliveryOptions 
      });
      
      const result = await cartService.addToCart(productId, quantity, deliveryOptions, variations);
      console.log('Product added successfully:', result);
      
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
        toast.error(t('cart.notifications.productNotFound'));
      } else if (err.message?.includes('iniciar sesión')) {
        toast.error(t('cart.notifications.addToCartAuthError'));
      } else {
        toast.error(t('cart.notifications.addToCartError'));
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
      toast.error(t('cart.notifications.clearCartAuthRequired'));
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
      toast.error(err.message || t('cart.notifications.clearCartError'));
      return false;
    }
  }, [isAuthenticated, user, invalidateCache]);

  // Aplicar cupón (flujo completo según README)
  const applyCoupon = useCallback(async (couponCode: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error(t('cart.notifications.applyCouponAuthRequired'));
      return false;
    }

    try {
      setError(null);
      console.log('🎫 Iniciando aplicación de cupón:', couponCode);
      
      // PASO 1: Aplicar cupón para validar (POST /apply-coupon)
      console.log('🔄 Paso 1: Aplicando cupón...');
      const result = await cartService.applyCoupon(couponCode);
      console.log('✅ Cupón válido aplicado:', {
        tipo: result.coupon?.type,
        codigo: result.coupon?.code,
        descuento: result.coupon?.discount,
        couponExists: !!result.coupon
      });
      
      // PASO 2: Obtener carrito actualizado con cálculos completos (GET /with-coupon)
      console.log('🔄 Paso 2: Obteniendo carrito con cupón aplicado...');
      const cartWithCoupon = await cartService.getCartWithCoupon(couponCode);
      console.log('🛒 Carrito completo con cupón:', {
        subtotal: cartWithCoupon.subtotal,
        total: cartWithCoupon.total,
        discountAmount: cartWithCoupon.discountAmount,
        freeShipping: cartWithCoupon.summary?.freeShippingApplied,
        savings: cartWithCoupon.summary?.savings
      });
      
      // PASO 3: Actualizar estado COMPLETO con respuesta de /with-coupon
      console.log('🔄 Paso 3: Actualizando estado del carrito...');
      
      // Items del carrito
      setItems(cartWithCoupon.cartItems || []);
      
      // Summary completo con TODOS los datos de /with-coupon
      const newSummary = {
        totalItems: cartWithCoupon.itemCount || 0,
        totalQuantity: cartWithCoupon.cartItems?.reduce((sum, item) => sum + item.cantidad, 0) || 0,
        subtotal: cartWithCoupon.subtotal || 0,
        total: cartWithCoupon.total, // 🎯 TOTAL FINAL de la API
        discount: cartWithCoupon.discountAmount || 0,
        savings: cartWithCoupon.summary?.savings || 0,
        shippingCost: cartWithCoupon.summary?.shippingCost,
        originalShippingCost: cartWithCoupon.summary?.originalShippingCost,
        freeShippingApplied: cartWithCoupon.summary?.freeShippingApplied || false,
        totalTPS: cartWithCoupon.summary?.totalTPS,
        totalTVQ: cartWithCoupon.summary?.totalTVQ,
        totalConsigne: cartWithCoupon.summary?.totalConsigne,
        totalTaxes: cartWithCoupon.summary?.totalTaxes,
        shippingThreshold: cartWithCoupon.summary?.shippingThreshold || 200,
        totalBeforeDiscount: cartWithCoupon.summary?.totalBeforeDiscount,
        // 🚚 CRITICAL FIX: Include new shipping calculation fields
        shippingMessage: cartWithCoupon.summary?.shippingMessage,
        needsAddress: cartWithCoupon.summary?.needsAddress
      };
      
      setSummary(newSummary);
      console.log('🔊 Summary actualizado:', newSummary);
      
      // Cupón aplicado con tipo detectado
      setAppliedCoupon(cartWithCoupon.appliedCoupon || null);
      console.log('🏷️ Cupón establecido:', cartWithCoupon.appliedCoupon);
      
      // Limpiar cache
      invalidateCache();
      
      console.log('✨ ¡Cupón aplicado exitosamente! Total final:', cartWithCoupon.total);
      return true;
      
    } catch (err: any) {
      console.error('❌ Error en flujo de cupón:', err);
      console.error('Error details:', {
        message: err.message,
        couponCode,
        stack: err.stack
      });
      
      // Manejo de errores específicos
      if (err.message?.includes('Ya has usado este cupón el máximo número de veces permitido') || 
          err.message?.includes('Personal usage limit reached') || 
          err.message?.includes('userUsageCount')) {
        setError('Límite de uso alcanzado para este cupón');
        toast.error(t('cart.notifications.couponUsageLimit'));
      } else if (err.message?.includes('no válido') || err.message?.includes('Invalid coupon')) {
        setError('Cupón inválido');
        toast.error(t('cart.notifications.couponInvalid'));
      } else if (err.message?.includes('expirado') || err.message?.includes('expired')) {
        setError('Cupón expirado');
        toast.error(t('cart.notifications.couponExpired'));
      } else if (err.message?.includes('Rate limit') || err.message?.includes('Too Many Requests')) {
        setError('Demasiados intentos');
        toast.error(t('cart.notifications.couponRateLimit'));
      } else {
        setError('Error al aplicar cupón');
        toast.error(t('cart.notifications.couponApplyError'));
      }
      
      return false;
    }
  }, [isAuthenticated, user, invalidateCache]);

  // Actualizar opciones de entrega (nuevo)
  const updateDeliveryOptions = useCallback(async (options: DeliveryOptions): Promise<DeliveryUpdateResponse> => {
    if (!isAuthenticated || !user) {
      toast.error(t('cart.notifications.updateDeliveryAuthRequired'));
      throw new Error('Usuario no autenticado');
    }

    try {
      setError(null);
      
      const result: DeliveryUpdateResponse = await cartService.updateDeliveryOptions(options);
      
      // Si hay error del backend con sugerencias, no recargar aún
      if (result.error) {
        return result; // Devolver la respuesta con errores/sugerencias
      }
      
      // Solo recargar si no hay errores
      invalidateCache();
      await loadCartNow(true);
      
      toast.success(t('cart.notifications.deliveryUpdateSuccess'));
      return result;
    } catch (err: any) {
      console.error('Error updating delivery options:', err);
      setError('Error al actualizar opciones de entrega');
      
      if (err.message?.includes('hora de entrega')) {
        toast.error(t('cart.delivery.error'));
      } else if (err.message?.includes('método de entrega')) {
        toast.error(t('cart.notifications.deliveryMethodError'));
      } else {
        toast.error(err.message || t('cart.notifications.deliveryUpdateError'));
      }
      throw err; // Propagar el error en lugar de devolver false
    }
  }, [isAuthenticated, user, invalidateCache, loadCartNow]);

  // Remover cupón
  const removeCoupon = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error(t('cart.notifications.removeCouponAuthRequired'));
      return false;
    }

    if (!appliedCoupon) {
      console.log('No hay cupón aplicado para remover');
      return true;
    }

    try {
      setError(null);
      console.log('🗑️ Removiendo cupón del backend:', appliedCoupon.code || appliedCoupon.codigo);
      
      // CRITICAL FIX: Call backend API to remove coupon
      await cartService.removeCoupon();
      console.log('✅ Cupón removido del backend');
      
      // Clear local state
      setAppliedCoupon(null);
      
      // Invalidate cache and reload cart to get updated totals
      invalidateCache();
      await loadCartNow(true);
      
      console.log('🔄 Estado actualizado sin cupón');
      toast.success(t('cart.notifications.couponRemovedSuccess'));
      return true;
    } catch (err: any) {
      console.error('❌ Error removiendo cupón:', err);
      setError('Error al remover cupón');
      
      if (err.message?.includes('No coupon applied') || err.message?.includes('no cupón')) {
        // If backend says no coupon, clear local state anyway
        setAppliedCoupon(null);
        toast.info(t('cart.notifications.noCouponApplied'));
        return true;
      } else {
        toast.error(t('cart.notifications.couponRemoveError'));
        return false;
      }
    }
  }, [isAuthenticated, user, appliedCoupon, invalidateCache, loadCartNow]);

  // 🚨 CRITICAL FIX: Función pública para refrescar carrito - Invalidación agresiva de cache
  const refreshCart = useCallback(async () => {
    console.log('🚨 REFRESH CART: Invalidando cache AGRESIVAMENTE');
    
    // 🚨 STEP 1: Invalidar cache global inmediatamente
    globalCartCache = null;
    invalidateCache();
    
    // 🚨 STEP 2: Forzar recarga completa
    console.log('🚨 REFRESH CART: Forzando recarga completa');
    await loadCartNow(true);
    
    console.log('🚨 REFRESH CART: COMPLETADO');
  }, [loadCartNow, invalidateCache]);

  // Función para limpiar cupones al inicializar sesión (sin persistencia)
  const clearCouponOnInit = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !user) return;
    
    try {
      console.log('🧹 Limpiando cupones al inicializar sesión (política no-persistencia)');
      
      // Llamar al backend para remover cualquier cupón aplicado
      const success = await cartService.removeCoupon();
      if (success) {
        console.log('✅ Cupón limpiado del backend exitosamente');
        // Limpiar estado local también
        setAppliedCoupon(null);
        // Recargar carrito para obtener totales actualizados sin cupón
        await loadCartNow(true);
      }
    } catch (error) {
      console.log('ℹ️ No había cupón que limpiar o error menor:', error);
      // No mostrar toast de error - es normal que no haya cupón
    }
  }, [isAuthenticated, user, loadCartNow]);

  // Verificar si un producto está en el carrito (memoizado)
  const isInCart = useCallback((productId: number) => {
    return items.some(item => item.producto_id === productId);
  }, [items]);

  // Obtener cantidad de un producto en el carrito (memoizado)
  const getProductQuantity = useCallback((productId: number) => {
    const item = items.find(item => item.producto_id === productId);
    return item?.cantidad || 0;
  }, [items]);

  // ✨ NEW PROMOTION FUNCTIONS - Based on implementation guide
  
  // Detectar promoción Maison de Poulet
  const hasMaisonPouletPromotion = useCallback((): boolean => {
    const hasPromotion = Boolean(
      summary?.promotionApplied && 
      summary?.shippingDiscount && summary.shippingDiscount > 0
    );
    
    // 🔍 DEBUG: Log para verificar promoción
    console.log('🔍 useCart - hasMaisonPouletPromotion:', {
      promotionApplied: summary?.promotionApplied,
      shippingDiscount: summary?.shippingDiscount,
      shippingCost: summary?.shippingCost,
      originalShippingCost: summary?.originalShippingCost,
      freeShippingApplied: summary?.freeShippingApplied,
      shippingMessage: summary?.shippingMessage,
      hasPromotion: hasPromotion,
      fullSummary: summary
    });
    
    return hasPromotion;
  }, [summary?.promotionApplied, summary?.shippingDiscount, summary]);

  // Obtener detalles de la promoción
  const getPromotionDetails = useCallback(() => {
    if (!hasMaisonPouletPromotion()) return null;
    
    return {
      isActive: true,
      discount: summary?.shippingDiscount || 0,
      originalCost: summary?.originalShippingCost || 0,
      message: summary?.shippingMessage || 'Promoción Maison de Poulet',
      type: 'maison_poulet_riviera' as const
    };
  }, [summary?.shippingDiscount, summary?.originalShippingCost, summary?.shippingMessage, hasMaisonPouletPromotion]);

  // Obtener ahorros totales (cupones + promoción)
  const getTotalSavings = useCallback((): number => {
    const shippingDiscount = summary?.shippingDiscount || 0;
    const couponDiscount = summary?.savings || 0;
    return shippingDiscount + couponDiscount;
  }, [summary?.shippingDiscount, summary?.savings]);

  // Obtener estado completo del envío
  const getShippingStatus = useCallback(() => {
    if (!summary) {
      return { 
        isFree: false, 
        cost: 0, 
        hasPromotion: false, 
        hasThresholdFree: false 
      };
    }

    const isFree = (summary.shippingCost || 0) === 0;
    const hasPromotion = Boolean(summary.promotionApplied);
    const hasThresholdFree = (summary.subtotal || 0) >= (summary.shippingThreshold || 200);

    return {
      isFree,
      cost: summary.shippingCost || 0,
      hasPromotion,
      hasThresholdFree,
      message: summary.shippingMessage
    };
  }, [summary]);

  // 🚨 Backend data completeness validation
  const backendDataQuality = useMemo(() => {
    if (!summary) {
      return {
        completeness: 0,
        hasMinimalData: false,
        missingFields: ['all'] as string[],
        usingFallbacks: true
      };
    }
    
    const requiredFields = [
      'totalItems', 'totalQuantity', 'subtotal', 'total', 
      'totalTaxes', 'totalConsigne', 'shippingCost', 'shippingThreshold'
    ] as const;
    
    const availableFields = requiredFields.filter(field => {
      const value = summary[field as keyof CartSummary];
      return value !== undefined && value !== null;
    });
    
    const completeness = requiredFields.length > 0 ? (availableFields.length / requiredFields.length) * 100 : 0;
    const hasMinimalData = summary.subtotal !== undefined && summary.subtotal !== null && 
                          summary.total !== undefined && summary.total !== null;
    const missingFields = requiredFields.filter(field => {
      const value = summary[field as keyof CartSummary];
      return value === undefined || value === null;
    });
    
    return {
      completeness: Math.round(completeness),
      hasMinimalData,
      missingFields: missingFields as string[],
      usingFallbacks: completeness < 100
    };
  }, [summary]);

  // Estado derivado memoizado con backend-first approach
  const derivedState = useMemo(() => ({
    isEmpty: items.length === 0,
    totalItems: summary?.totalItems ?? 0,
    totalQuantity: summary?.totalQuantity ?? 0,
    subtotal: summary?.subtotal ?? 0,
    total: summary?.total ?? 0,
    // Backend data quality metrics
    backendDataQuality,
    // 🚨 Flag when using fallback calculations
    usingFallbackCalculations: !backendDataQuality.hasMinimalData,
  }), [items.length, summary, backendDataQuality]);

  // Efecto para autoLoad SOLO cuando sea necesario
  useEffect(() => {
    if (autoLoad && !lazy && !hasLoadedOnce && isAuthenticated && user) {
      console.log('Auto-loading cart...');
      debouncedLoadCart();
    }
  }, [autoLoad, lazy, hasLoadedOnce, isAuthenticated, user, debouncedLoadCart]);

  // Limpiar cupones al inicializar sesión (política no-persistencia)
  useEffect(() => {
    if (isAuthenticated && user && !hasLoadedOnce) {
      console.log('🧹 Usuario autenticado por primera vez - limpiando cupones');
      clearCouponOnInit();
    }
  }, [isAuthenticated, user, hasLoadedOnce, clearCouponOnInit]);

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

  // Escuchar cambios de dirección para recalcular costos de envío - ROBUSTECIDO
  useEffect(() => {
    const handleAddressChange = async (event: Event) => {
      // Solo procesar si el componente está montado y el usuario autenticado
      if (!isComponentMountedRef.current || !isAuthenticated || !user) {
        return;
      }

      // Type-safe CustomEvent handling
      const customEvent = event as CustomEvent<{ action: string; address: any }>;
      if (!customEvent.detail) {
        console.warn('Address change event missing detail');
        return;
      }

      const { action, address } = customEvent.detail;
      console.log('🛒 CARRITO: Cambio de dirección detectado:', { 
        action, 
        addressId: address?.id,
        timestamp: new Date().toISOString()
      });
      
      // 🚨 CRITICAL: Recargar para TODOS los cambios importantes de dirección
      const criticalActions = [
        'creada',
        'primera dirección creada', 
        'establecida como principal',
        'establecida como principal (directa)',
        'seleccionada',
        'actualizada',
        'eliminada'
      ];
      
      if (typeof action === 'string' && criticalActions.includes(action)) {
        console.log('🔄 CARRITO: Recarga CRÍTICA por:', action);
        
        try {
          // 🚨 NUEVO: Esperar tiempo adicional para cambios de dirección críticos
          const additionalDelay = action.includes('creada') || action.includes('principal') ? 800 : 200;
          console.log(`⏱️ CARRITO: Esperando ${additionalDelay}ms para sincronización backend`);
          await new Promise(resolve => setTimeout(resolve, additionalDelay));
          
          // 🚨 INVALIDACIÓN AGRESIVA
          globalCartCache = null;
          invalidateCache();
          
          // 🚨 MÚLTIPLES INTENTOS para asegurar éxito
          let reloadAttempts = 0;
          const maxReloadAttempts = 3;
          let reloadSuccess = false;
          
          while (reloadAttempts < maxReloadAttempts && !reloadSuccess) {
            reloadAttempts++;
            console.log(`🔄 CARRITO: Intento de recarga ${reloadAttempts}/${maxReloadAttempts}`);
            
            try {
              await loadCartNow(true);
              console.log(`✅ CARRITO: Recarga exitosa (intento ${reloadAttempts})`);
              reloadSuccess = true;
            } catch (error) {
              console.error(`❌ CARRITO: Error en intento ${reloadAttempts}:`, error);
              if (reloadAttempts < maxReloadAttempts) {
                await new Promise(resolve => setTimeout(resolve, 400));
              }
            }
          }
          
          if (!reloadSuccess) {
            console.error('❌ CARRITO: TODOS los intentos de recarga fallaron');
          }
          
        } catch (error) {
          console.error('❌ CARRITO: Error crítico en recarga por cambio de dirección:', error);
        }
      } else {
        console.log('🔍 CARRITO: Acción no crítica, omitiendo recarga:', action);
      }
    };

    // Solo agregar listener si hay ventana disponible
    if (typeof window !== 'undefined') {
      window.addEventListener('addressChanged', handleAddressChange);
      
      return () => {
        window.removeEventListener('addressChanged', handleAddressChange);
      };
    }
  }, [invalidateCache, loadCartNow, isAuthenticated, user]);

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
    removeCoupon,
    clearCouponOnInit,
    updateDeliveryOptions,
    refreshCart,
    
    // Utilidades memoizadas
    isInCart,
    getProductQuantity,
    
    // ✨ NEW PROMOTION FUNCTIONS
    hasMaisonPouletPromotion,
    getPromotionDetails,
    getTotalSavings,
    getShippingStatus,
    
    // Estado derivado memoizado
    ...derivedState,
  };
}
