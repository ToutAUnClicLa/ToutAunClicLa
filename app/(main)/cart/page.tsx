"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, ShoppingBag, Trash2, Plus, Minus, Package, Utensils, Store, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { Card, CardContent } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { loginPath } from '@/lib/shop-auth';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';
import { AddressSelector } from '@/components/features/modules/cart/AddressSelector';
import DeliveryOptions from '@/components/features/modules/cart/DeliveryOptions';
import { CouponInput } from '@/components/features/modules/cart/CouponInput';
import { ShippingStatus } from '@/components/features/modules/cart/ShippingStatus';
import { CartErrorBoundary } from '@/components/features/modules/cart/CartErrorBoundary';
import { toast } from 'sonner';
import { CartItem } from '@/lib/services/cart';
import type { DeliveryOptions as DeliveryOptionsType } from '@/lib/services/cart';
import { useTranslation } from '@/hooks/useTranslation';
import { verifyAddressForCheckout } from '@/lib/services/addresses';

// Mapeo de categorías con estilos modernos
const getCategoryMap = (t: any) => ({
  productos: { name: t('cart.categories.productos'), icon: Package },
  comidas: { name: t('cart.categories.comidas'), icon: Utensils },
  boutique: { name: t('cart.categories.boutique'), icon: Store }
});

// Función para determinar la categoría de un item
const getItemCategory = (item: CartItem): string => {
  // 🚨 VALIDACIÓN DEFENSIVA: Verificar item antes de acceder a propiedades
  if (!item?.productos) {
    console.warn('⚠️ Item sin productos en getItemCategory, usando categoría por defecto');
    return 'productos';
  }

  const categoryName = item.productos?.categorias?.nombre?.toLowerCase() || '';

  // Lógica para mapear categorías
  if (categoryName.includes('comida') || categoryName.includes('food') || categoryName.includes('snack')) {
    return 'comidas';
  } else if (categoryName.includes('boutique') || categoryName.includes('ropa') || categoryName.includes('accesorio')) {
    return 'boutique';
  } else {
    return 'productos';
  }
};

// Orden de categorías
const categoryOrder = ['productos', 'comidas', 'boutique'];

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const {
    items,
    totalQuantity,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    isEmpty,
    refreshCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    summary
  } = useCart();

  const {
    selectedAddress,
    hasAddresses,
    addresses,
    isSyncingWithBackend,
    lastSyncedAddressId,
    isAddressSafeForCheckout,
    refreshAddresses
  } = useAddresses();

  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [verifyingAddress, setVerifyingAddress] = useState(false);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptionsType & { isValid: boolean }>({
    metodoEntrega: 'puerta',
    notasEntrega: '',
    aplicarATodos: true,
    isValid: true
  });

  // Estado para manejar la habilitación inmediata de opciones de entrega
  const [hasValidAddress, setHasValidAddress] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Ref para evitar múltiples toasts de redirección
  const hasNotifiedAuth = useRef(false);

  // Redirigir si no está autenticado
  useEffect(() => {
    // Si ya sabemos que no está autenticado y no está cargando el carrito
    if (!isAuthenticated && !isLoading) {
      if (!hasNotifiedAuth.current) {
        toast.error(t('auth.requiredForCart'));
        hasNotifiedAuth.current = true;
      }
      router.push(loginPath('/cart'));
    } else if (isAuthenticated) {
      // Resetear el ref si el usuario se autentica
      hasNotifiedAuth.current = false;
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, isLoading, router, t]);




  // 🚨 BACKEND AS SINGLE SOURCE OF TRUTH - Minimal local calculations for offline fallback only
  const calculatedSubtotal = useMemo(() => {
    // Only calculate when backend data is unavailable
    if (summary?.subtotal !== undefined) return summary.subtotal;

    return items.reduce((sum, item) => {
      const finalItemPrice = (item.productos?.precio || 0) * item.cantidad;
      return sum + finalItemPrice;
    }, 0);
  }, [items, summary?.subtotal]);

  // Emergency fallback for taxes calculation
  const calculatedTaxes = useMemo(() => {
    if (summary?.totalTaxes !== undefined) return summary.totalTaxes;

    return items.reduce((sum, item) => {
      const finalItemPrice = (item.productos?.precio || 0) * item.cantidad;
      const tpsAmount = item.productos.TPS ? (finalItemPrice * item.productos.TPS / 100) : 0;
      const tvqAmount = item.productos.TVQ ? (finalItemPrice * item.productos.TVQ / 100) : 0;
      return sum + tpsAmount + tvqAmount;
    }, 0);
  }, [items, summary?.totalTaxes]);

  // Emergency fallback for consigne calculation
  const calculatedConsigne = useMemo(() => {
    if (summary?.totalConsigne !== undefined) return summary.totalConsigne;

    return items.reduce((sum, item) => {
      const consigneAmount = item.productos.consigne ? item.productos.consigne * item.cantidad : 0;
      return sum + consigneAmount;
    }, 0);
  }, [items, summary?.totalConsigne]);

  // 🚨 BACKEND VALUES FIRST - NO FALLBACKS for pricing, only for display
  // The backend calculates ALL prices based on user location, products, and business logic

  // Always use backend values, NO local calculations for pricing
  const displaySubtotal = summary?.subtotal ?? calculatedSubtotal;
  const displayTaxes = summary?.totalTaxes ?? calculatedTaxes;
  const displayConsigne = summary?.totalConsigne ?? calculatedConsigne;
  const shippingThreshold = summary?.shippingThreshold ?? 200; // Only fallback for display

  // 🚨 CRITICAL: Backend total is ALWAYS authoritative - NO fallback calculations
  const finalTotal = summary?.total ?? 0; // If no backend total, show 0 until loaded
  const savingsAmount = summary?.savings ?? 0;
  const finalShippingCost = summary?.shippingCost ?? 0; // Backend determines shipping cost
  const isFreeShippingApplied = summary?.freeShippingApplied ?? false;


  // 🚚 CRITICAL FIX: New shipping state management from backend
  // Always use the latest values from summary, with proper fallbacks
  const shippingMessage = summary?.shippingMessage || null;
  const needsAddress = summary?.needsAddress || false;
  // El backend marca deliverable=false cuando el código postal está fuera de zona
  const notDeliverable = summary?.deliverable === false;

  // 🔍 Debug logging for shipping state changes
  useEffect(() => {
    if (summary?.shippingMessage || summary?.needsAddress) {
      console.log('🚚 Shipping state update:', {
        shippingMessage: summary.shippingMessage,
        needsAddress: summary.needsAddress,
        shippingCost: summary.shippingCost,
        timestamp: new Date().toISOString()
      });
    }
  }, [summary?.shippingMessage, summary?.needsAddress, summary?.shippingCost]);

  // 🚨 Backend-first state monitoring using validation utilities (optimized)
  useEffect(() => {
    if (summary) {
      // Calculate values inside useEffect to avoid dependency issues
      const currentDisplaySubtotal = summary?.subtotal ?? calculatedSubtotal;
      const currentDisplayTaxes = summary?.totalTaxes ?? calculatedTaxes;
      const currentDisplayConsigne = summary?.totalConsigne ?? calculatedConsigne;
      const currentFinalTotal = summary?.total ?? 0; // Backend calculates total
      const currentFinalShippingCost = summary?.shippingCost ?? 0; // Backend calculates shipping
      const currentSavingsAmount = summary?.savings ?? 0;
      const currentIsFreeShippingApplied = summary?.freeShippingApplied ?? false;
      const currentShippingThreshold = summary?.shippingThreshold ?? 200;
      const currentNeedsAddress = summary?.needsAddress || false;
      const currentShippingMessage = summary?.shippingMessage || null;

      // Additional cart page specific logging
      console.log('🛒 Cart page final state:', {
        displayValues: {
          subtotal: currentDisplaySubtotal,
          taxes: currentDisplayTaxes,
          consigne: currentDisplayConsigne,
          total: currentFinalTotal,
          shipping: currentFinalShippingCost,
          savings: currentSavingsAmount
        },
        couponState: appliedCoupon ? {
          code: appliedCoupon.code || appliedCoupon.codigo,
          type: appliedCoupon.type,
          savings: currentSavingsAmount,
          freeShippingApplied: currentIsFreeShippingApplied
        } : null,
        shippingState: {
          needsAddress: currentNeedsAddress,
          shippingMessage: !!currentShippingMessage,
          cost: currentFinalShippingCost,
          threshold: currentShippingThreshold
        },
        itemsCount: items.length,
        isEmpty: items.length === 0
      });
    }
  }, [summary, appliedCoupon, items.length, calculatedSubtotal, calculatedTaxes, calculatedConsigne]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }, []);

  // 🚨 REMOVED: renderShippingDisplay - replaced with ShippingStatus component
  // This function is no longer needed as ShippingStatus component handles all shipping display logic

  // Efecto para cargar el carrito inicial y cuando cambia la dirección principal
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Cargando carrito inicial:', {
        isAuthenticated,
        hasSelectedAddress: !!selectedAddress?.id,
        hasCoupon: !!appliedCoupon
      });

      // Cargar carrito inicial o cuando cambia dirección válida
      refreshCart();
    }
  }, [isAuthenticated, selectedAddress?.id, refreshCart, appliedCoupon]);

  // Efecto para reiniciar opciones de entrega cuando cambia la dirección
  useEffect(() => {
    if (selectedAddress?.id) {
      console.log('📍 Nueva dirección seleccionada, reiniciando opciones de entrega');

      // Reiniciar las opciones de entrega a los valores por defecto
      setDeliveryOptions({
        metodoEntrega: 'puerta',
        notasEntrega: '',
        aplicarATodos: true,
        isValid: true
      });
    }
  }, [selectedAddress?.id]);

  // 🚨 CRITICAL FIX: Validación agresiva de dirección válida con logs detallados
  useEffect(() => {
    const addressValid = Boolean(isAuthenticated && hasAddresses && selectedAddress?.id);

    console.log('🔍 VALIDACIÓN DE DIRECCIÓN (DETALLADA):', {
      isAuthenticated,
      hasAddresses,
      addressesLength: addresses?.length || 0,
      selectedAddressId: selectedAddress?.id,
      selectedAddressCity: selectedAddress?.city,
      selectedAddressPrimary: selectedAddress?.isPrimary,
      addressValid,
      prevValid: hasValidAddress,
      timestamp: new Date().toISOString()
    });

    // SIEMPRE actualizar el estado, incluso si parece igual (para forzar re-renders)
    setHasValidAddress(addressValid);

    // 🚨 CRITICAL: Si se habilitó una dirección válida, refrescar carrito INMEDIATAMENTE
    if (addressValid && (!hasValidAddress || hasValidAddress !== addressValid)) {
      console.log('🚨 DIRECCIÓN VÁLIDA DETECTADA - REFRESCANDO CARRITO INMEDIATAMENTE');

      // Múltiples intentos para asegurar éxito
      setTimeout(async () => {
        try {
          console.log('🔄 REFRESCANDO carrito por dirección válida...');
          await refreshCart();
          console.log('✅ Carrito refrescado por dirección válida');
        } catch (error) {
          console.error('❌ Error refrescando carrito por dirección válida:', error);
        }
      }, 100);
    }
  }, [isAuthenticated, hasAddresses, addresses?.length, selectedAddress?.id, selectedAddress?.city, selectedAddress?.isPrimary, hasValidAddress, refreshCart]);

  // 🚨 CRITICAL FIX: Listener sincronizado para cambios de direcciones
  useEffect(() => {
    const handleAddressChange = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { action, address } = customEvent.detail;
      console.log('🏠 PÁGINA CARRITO: Evento de cambio de dirección:', {
        action,
        addressId: address?.id,
        isPrimary: address?.isPrimary,
        timestamp: new Date().toISOString()
      });

      // 🚨 CRITICAL: Las recargas ahora las maneja useCart - aquí solo monitoreamos
      // Esto previene doble recarga y race conditions

      const actionsRequiringMonitoring = [
        'created',
        'creada',
        'primera dirección creada',
        'establecida como principal',
        'establecida como principal (directa)',
        'actualizada',
        'seleccionada'
      ];

      if (actionsRequiringMonitoring.includes(action)) {
        console.log('🏠 PÁGINA CARRITO: Monitoreando cambio importante:', action);

        // Para direcciones recién creadas, mostrar feedback al usuario
        if (action === 'created' || action === 'creada' || action === 'primera dirección creada') {
          toast.success(t('cart.success.addressAdded'), {
            duration: 2000,
          });

          // 🚨 CRITICAL: Refresh both addresses and cart for complete sync
          setTimeout(async () => {
            console.log('🏠 PÁGINA CARRITO: Refrescando direcciones y carrito después de creación');
            try {
              // First refresh addresses to get the new selection
              await refreshAddresses();
              // Then refresh cart with the new address
              await refreshCart();
              console.log('✅ Direcciones y carrito refrescados exitosamente');
            } catch (error) {
              console.error('❌ Error refrescando:', error);
            }
          }, 100); // Reduced delay for immediate feedback
        }
      }
    };

    if (typeof window !== 'undefined') {
      console.log('📡 LISTENER de direcciones REGISTRADO');
      window.addEventListener('addressChanged', handleAddressChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        console.log('📡 LISTENER de direcciones ELIMINADO');
        window.removeEventListener('addressChanged', handleAddressChange);
      }
    };
  }, [appliedCoupon, applyCoupon, refreshCart, refreshAddresses, t]);


  // Agrupar items por categoría
  const groupedItems = useMemo(() => {
    const grouped: { [key: string]: CartItem[] } = {};

    items.forEach(item => {
      // 🚨 VALIDACIÓN DEFENSIVA: Solo procesar items válidos
      if (!item?.id || !item?.productos) {
        console.warn('⚠️ Item inválido encontrado al agrupar, ignorando:', item);
        return;
      }

      const category = getItemCategory(item);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    return grouped;
  }, [items]);

  // Función para manejar cambios de cantidad (memoizada)
  const handleQuantityChange = useCallback(async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setLoadingItems(prev => new Set(prev).add(itemId));

    try {
      await updateQuantity(itemId, newQuantity);
      toast.success(t('cart.success.quantityUpdated'));
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      toast.error(t('cart.errors.updateQuantity'));
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [updateQuantity, t]);

  // Función para eliminar item del carrito (memoizada)
  const handleRemoveItem = useCallback(async (itemId: string) => {
    setLoadingItems(prev => new Set(prev).add(itemId));

    try {
      await removeFromCart(itemId);
      toast.success(t('cart.success.productRemoved'));
    } catch (error) {
      console.error('Error eliminando item:', error);
      toast.error(t('cart.errors.removeProduct'));
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [removeFromCart, t]);

  // Función para limpiar el carrito (memoizada)
  const handleClearCart = useCallback(async () => {
    try {
      await clearCart();
      toast.success(t('cart.success.cartCleared'));
    } catch (error) {
      console.error('Error limpiando carrito:', error);
      toast.error(t('cart.errors.clearCart'));
    }
  }, [clearCart, t]);

  // Función para proceder al checkout (memoizada)
  const handleCheckout = useCallback(async () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const isBlockedWeekday = dayOfWeek === 1 || dayOfWeek === 2; // Monday or Tuesday
    const isDecember = now.getMonth() === 11;
    const isJanuary = now.getMonth() === 0;
    const isBlockedDecemberDate = isDecember && now.getDate() === 25;
    const isBlockedJanuary = isJanuary && now.getDate() === 1;

    if (isBlockedWeekday || isBlockedDecemberDate || isBlockedJanuary) {
      toast.info(t('cart.checkout.closedToday'));
      return;
    }

    const montrealParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Toronto',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    }).formatToParts(now);
    const montrealHour = Number(montrealParts.find(part => part.type === 'hour')?.value ?? NaN);

    if (!Number.isNaN(montrealHour) && montrealHour >= 21) {
      toast.info(t('cart.checkout.cutoff'));
      return;
    }

    if (!isAuthenticated) {
      router.push(loginPath('/cart'));
      return;
    }

    // 🚚 CRITICAL FIX: Enhanced address validation with backend verification
    // Priority 1: Backend says address is needed (most authoritative)
    if (needsAddress) {
      toast.error(t('cart.summary.addAddressRequired'));
      console.log('❌ Checkout blocked: Backend requires address (needsAddress=true)');
      return;
    }

    // Bloquear si la ubicación está fuera de la zona de cobertura
    if (notDeliverable) {
      toast.error(shippingMessage || t('cart.errors.notDeliverable'));
      console.log('❌ Checkout blocked: location not deliverable (out of postal zone)');
      return;
    }

    // Priority 2: Local validation for address selection
    if (!selectedAddress || !selectedAddress.id) {
      toast.error(t('cart.errors.selectAddress'));
      console.log('❌ Checkout blocked: No valid address selected locally', {
        selectedAddress: selectedAddress ? { id: selectedAddress.id } : null,
        hasValidAddress,
        hasAddresses,
        addressesCount: addresses?.length || 0
      });
      return;
    }

    // ✅ BALANCED: Solo bloquear si realmente hay un problema crítico
    if (isSyncingWithBackend) {
      console.log('⏳ CHECKOUT: Esperando sincronización rápida', {
        selectedAddressId: selectedAddress.id,
        isSyncingWithBackend
      });
      // No bloquear con toast error, solo wait un momento
      await new Promise(resolve => setTimeout(resolve, 100));
      // Si sigue sincronizando después de 100ms, continuar de todos modos
      if (isSyncingWithBackend) {
        console.log('⚡ CHECKOUT: Procediendo a pesar de sincronización activa');
      }
    }

    // ✅ SIMPLIFIED: Verificar que hay dirección seleccionada  
    if (!selectedAddress?.id) {
      console.log('⚠️ No hay dirección seleccionada para checkout');
      toast.error(t('cart.errors.selectAddress'));
      return;
    }

    console.log('✅ Address validation passed with race condition protection:', {
      selectedAddressId: selectedAddress.id,
      selectedAddressCity: selectedAddress.city,
      isPrimary: selectedAddress.isPrimary,
      isSyncingWithBackend,
      isAddressSafeForCheckout: isAddressSafeForCheckout(),
      validationPassed: true
    });

    // 🚨 CRITICAL NEW: Robust address verification with backend before proceeding to Stripe
    console.log('🔍 Iniciando verificación robusta de dirección con backend antes de Stripe...');
    setVerifyingAddress(true);

    try {
      const isAddressReady = await verifyAddressForCheckout(selectedAddress.id, 3, 500);

      if (!isAddressReady) {
        console.error('❌ Dirección no verificada después de intentos, bloqueando checkout');
        toast.error(t('cart.errors.addressNotReady'));
        return;
      }

      console.log('✅ Dirección verificada con backend, procediendo al checkout');

    } catch (verificationError) {
      console.error('❌ Error durante verificación de dirección:', verificationError);
      toast.error(t('cart.errors.addressVerifyFailed'));
      return;

    } finally {
      setVerifyingAddress(false);
    }

    if (isEmpty) {
      toast.error(t('cart.errors.emptyCart'));
      return;
    }

    // Validar opciones de entrega
    if (!deliveryOptions.metodoEntrega) {
      toast.error(t('cart.errors.deliveryMethodRequired'));
      return;
    }

    if (!deliveryOptions.isValid) {
      toast.error(t('cart.delivery.error'));
      return;
    }

    // Validar que si hay cupón, esté correctamente aplicado
    if (appliedCoupon) {
      const couponCode = appliedCoupon.code || appliedCoupon.codigo;
      if (!couponCode) {
        toast.error(t('cart.errors.couponError'));
        console.error('❌ Cupón aplicado sin código válido:', appliedCoupon);
        return;
      }
      console.log('✅ Cupón validado para checkout:', couponCode);
    }

    try {
      setCheckoutLoading(true);

      // Llamar directamente al backend para crear checkout session
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error(t('cart.errors.sessionExpired'));
        router.push(loginPath('/cart'));
        return;
      }

      console.log('🛒 Iniciando checkout directo con Stripe...');

      const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.toutaunclicla.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.toutaunclicla.com'}/checkout/cancel`;

      console.log('🔗 Success URL:', successUrl);
      console.log('🔗 Cancel URL:', cancelUrl);
      console.log('🌐 NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);

      // Preparar payload incluyendo cupón si está aplicado
      const payload: {
        shipping_address_id: string;
        success_url: string;
        cancel_url: string;
        coupon_code?: string;
      } = {
        shipping_address_id: selectedAddress.id,
        success_url: successUrl,
        cancel_url: cancelUrl
      };

      if (appliedCoupon && (appliedCoupon.code || appliedCoupon.codigo)) {
        payload.coupon_code = appliedCoupon.code || appliedCoupon.codigo;
        console.log('🎟️ Cupón incluido en checkout:', {
          code: payload.coupon_code,
          type: appliedCoupon.type,
          savings: savingsAmount
        });
      }

      // 🚨 CRITICAL DEBUG: Log all address and user info before sending
      console.log('🔍 CHECKOUT PAYLOAD DEBUG - CRITICAL ANALYSIS:', {
        selectedAddress: {
          id: selectedAddress?.id,
          city: selectedAddress?.city,
          state: selectedAddress?.state,
          street: selectedAddress?.street,
          zipCode: selectedAddress?.zipCode,
          isPrimary: selectedAddress?.isPrimary,
          fullObject: selectedAddress
        },
        addresses: addresses?.map(addr => ({
          id: addr.id,
          city: addr.city,
          isPrimary: addr.isPrimary
        })),
        payloadData: {
          shipping_address_id: payload.shipping_address_id,
          shipping_address_id_type: typeof payload.shipping_address_id,
          shipping_address_id_length: payload.shipping_address_id?.length,
          coupon_code: payload.coupon_code
        },
        timestamp: new Date().toISOString(),
        addressValidation: {
          hasAddresses,
          addressesCount: addresses?.length || 0,
          hasSelectedAddress: !!selectedAddress,
          selectedAddressId: selectedAddress?.id,
          isSyncingWithBackend
        }
      });

      console.log('📦 Payload completo para Stripe:', JSON.stringify(payload, null, 2));
      console.log('💰 Total esperado en checkout:', finalTotal, '(del backend)');

      // 🚨 DEBUG: Detailed total breakdown
      console.log('🔍 DETALLE COMPLETO DEL TOTAL:', {
        'Backend summary total': summary?.total,
        'Calculated finalTotal': finalTotal,
        'Frontend calculated': displaySubtotal + displayTaxes + displayConsigne + finalShippingCost,
        'Breakdown': {
          displaySubtotal,
          displayTaxes,
          displayConsigne,
          finalShippingCost,
          savingsAmount
        },
        'Summary object': summary
      });

      console.log('🏠 Dirección para cálculo de shipping:', {
        id: selectedAddress.id,
        city: selectedAddress.city,
        zipCode: selectedAddress.zipCode
      });
      console.log('🧾 Resumen de cupón:', {
        aplicado: !!appliedCoupon,
        codigo: appliedCoupon?.code || appliedCoupon?.codigo,
        tipo: appliedCoupon?.type,
        ahorros: savingsAmount,
        envioGratis: isFreeShippingApplied
      });


      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response data:', data);

      if (!response.ok) {
        console.error('❌ Backend error details:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          payload: payload
        });

        // Errores específicos de cupones
        if (data.message?.includes('coupon') || data.message?.includes('cupón')) {
          console.error('❌ Error relacionado con cupón:', data.message);
          toast.error(t('cart.errors.couponWithMessage', { message: data.message }));
        } else {
          toast.error(data.message || data.error || t('cart.errors.checkoutFailed'));
        }
        return;
      }

      console.log('✅ Checkout session creada exitosamente!');
      console.log('Session ID:', data.sessionId);
      console.log('URL de Stripe:', data.url);

      // 🔍 FULL DEBUG - Mostrar todo el orderSummary que regresa del backend
      console.log('📦 COMPLETE orderSummary from backend:', JSON.stringify(data.orderSummary, null, 2));

      // ✨ NEW - Log específico para promociones de Maison de Poulet
      if (data.orderSummary?.promotionApplied) {
        console.log('🎉 Promoción Maison de Poulet detectada en Stripe checkout!', {
          promotionApplied: data.orderSummary.promotionApplied,
          originalShippingCost: data.orderSummary.originalShippingCost,
          finalShippingCost: data.orderSummary.shippingCost,
          shippingDiscount: data.orderSummary.shippingDiscount,
          totalSavings: data.orderSummary.savings
        });
      }

      if (data.orderSummary?.coupon) {
        console.log('🎟️ Cupón procesado en Stripe:', {
          codigo: data.orderSummary.coupon.codigo,
          tipo: data.orderSummary.coupon.type,
          descuento: data.orderSummary.coupon.descuento,
          ahorros: data.orderSummary.savings
        });
      }

      console.log('💰 Total final en Stripe:', data.orderSummary?.total);
      console.log('🔗 Redirigiendo a Stripe Checkout...');

      // Redirigir DIRECTAMENTE a Stripe Checkout
      window.location.href = data.url;

    } catch (error: any) {
      console.error('❌ Error en checkout:', error);
      toast.error(error.message || t('cart.errors.checkoutFailed'));
      setCheckoutLoading(false);
    }
  }, [
    isAuthenticated, needsAddress, notDeliverable, shippingMessage, hasValidAddress, selectedAddress, isEmpty,
    deliveryOptions, appliedCoupon, finalTotal, savingsAmount, isFreeShippingApplied, t,
    displayConsigne, displaySubtotal, displayTaxes, finalShippingCost, items, summary,
    isSyncingWithBackend, isAddressSafeForCheckout, addresses, hasAddresses, lastSyncedAddressId
  ]);

  // Función para renderizar badges de impuestos (memoizada)
  const renderTaxBadges = useCallback((item: CartItem) => {
    // 🚨 VALIDACIÓN DEFENSIVA: Verificar que productos exista
    if (!item?.productos) {
      console.warn('⚠️ Item sin productos en renderTaxBadges, retornando badges vacíos');
      return [];
    }

    const badges = [];

    // Determinar si es taxable basado en si tiene TPS o TVQ
    const isTaxable = (item.productos.TPS && item.productos.TPS > 0) ||
      (item.productos.TVQ && item.productos.TVQ > 0);

    // Badge de Non Taxable (si no tiene TPS ni TVQ)
    if (!isTaxable) {
      badges.push(
        <Badge
          key="non-taxable"
          className="rounded-full border border-[var(--shop-hairline)] bg-white text-[var(--shop-ink)] text-xs"
        >
          {t('cart.nonTaxable')}
        </Badge>
      );
    }

    // Badge de TPS (si tiene TPS) - mostrar porcentaje
    if (item.productos.TPS && item.productos.TPS > 0) {
      badges.push(
        <Badge
          key="tps"
          className="rounded-full border border-[var(--shop-hairline)] bg-[var(--shop-purple-wash)] text-[var(--shop-purple)] text-xs"
        >
          +TPS: {item.productos.TPS}%
        </Badge>
      );
    }

    // Badge de TVQ (si tiene TVQ) - mostrar porcentaje
    if (item.productos.TVQ && item.productos.TVQ > 0) {
      badges.push(
        <Badge
          key="tvq"
          className="rounded-full border border-[var(--shop-hairline)] bg-[var(--shop-purple-wash)] text-[var(--shop-purple)] text-xs"
        >
          +TVQ: {item.productos.TVQ}%
        </Badge>
      );
    }

    // Badge de Consigne (si tiene consigne) - este sí se muestra en dólares
    if (item.productos.consigne && item.productos.consigne > 0) {
      const consigneAmount = item.productos.consigne * (item.cantidad ?? 0);
      badges.push(
        <Badge
          key="consigne"
          className="rounded-full border border-[var(--shop-hairline)] bg-white text-[var(--shop-ink)] text-xs"
        >
          +Consigne: {formatPrice(consigneAmount)}
        </Badge>
      );
    }

    return badges;
  }, [formatPrice, t]);

  // Renderizar item del carrito con diseño responsive (memoizada)
  const renderCartItem = useCallback((item: CartItem) => {
    // 🚨 VALIDACIÓN DEFENSIVA: Verificar item completo antes de renderizar
    if (!item?.id || !item?.productos) {
      console.error('❌ CartErrorBoundary Prevention: Item inválido, saltando render:', item);
      return null;
    }

    const isItemLoading = loadingItems.has(item.id);
    const itemTotal = (item.cantidad ?? 0) * (item.productos.precio ?? 0);
    const currentPrice = item.productos.precio ?? 0;
    const previousPrice = item.productos.precio_anterior ?? 0;
    const hasDiscount = previousPrice > currentPrice && currentPrice > 0;
    const discountPercentage = hasDiscount
      ? Math.round(((previousPrice - currentPrice) / previousPrice) * 100)
      : 0;
    const finalUnitPrice = currentPrice;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={cn('overflow-hidden border border-[var(--shop-hairline)] bg-white shadow-none', isItemLoading && 'opacity-50')}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex gap-3 sm:gap-4">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)]">
                <Image
                  src={item?.productos?.imagen_principal || '/placeholder-product.svg'}
                  alt={item?.productos?.nombre || 'Producto'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.svg';
                  }}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 pr-2 sm:pr-4">
                    <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-[var(--shop-ink)] sm:text-base md:text-lg">
                      {item?.productos?.nombre || 'Producto sin nombre'}
                    </h3>


                    <p className="mb-1 text-xs text-[var(--shop-muted)] sm:mb-2 sm:text-sm">
                      {item?.productos?.categorias?.nombre || t('cart.noCategory')}
                    </p>

                    <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {hasDiscount && previousPrice > 0 && (
                          <span className="text-xs text-[var(--shop-muted)] line-through">
                            {formatPrice(previousPrice)}
                          </span>
                        )}
                        {hasDiscount && (
                          <Badge className="rounded-full border-0 bg-[var(--shop-purple-wash)] text-[10px] text-[var(--shop-purple)]">
                            -{discountPercentage}%
                          </Badge>
                        )}
                        <span className="text-sm font-semibold text-[var(--shop-purple)] sm:text-base md:text-lg">
                          {formatPrice(finalUnitPrice)}
                        </span>
                        {item?.productos?.ecoprecio && (
                          <span className="text-xs font-medium text-[var(--shop-muted)]">
                            {t('cart.ecoFee')}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--shop-muted)] sm:text-sm">
                        {t('cart.perUnit')}
                      </span>
                    </div>

                    {/* Badges de impuestos - debajo del precio */}
                    <div className="flex flex-wrap gap-1">
                      {renderTaxBadges(item)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isItemLoading}
                      className={cn('h-11 w-11 p-0 text-[var(--shop-muted)] hover:bg-[var(--shop-canvas-muted)] hover:text-[var(--shop-ink)]', shopChrome.focus)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center rounded-full border border-[var(--shop-hairline)] bg-white">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, (item.cantidad ?? 1) - 1)}
                        disabled={isItemLoading || (item.cantidad ?? 1) <= 1}
                        className={cn('h-11 w-11 rounded-l-full p-0', shopChrome.focus)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="min-w-[2rem] px-2 text-center text-sm font-medium text-[var(--shop-ink)] sm:min-w-[3rem]">
                        {item.cantidad ?? 0}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, (item.cantidad ?? 0) + 1)}
                        disabled={isItemLoading || (item.cantidad ?? 0) >= (item?.productos?.stock ?? 0)}
                        className={cn('h-11 w-11 rounded-r-full p-0', shopChrome.focus)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--shop-ink)] sm:text-base md:text-lg">
                      {formatPrice(itemTotal)}
                    </p>
                    <p className="hidden text-xs text-[var(--shop-muted)] sm:block sm:text-sm">
                      {item.cantidad ?? 0} × {formatPrice(item.productos.precio ?? 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }, [
    loadingItems, formatPrice, renderTaxBadges,
    handleRemoveItem, handleQuantityChange, t
  ]);

  // Renderizar grupo de categoría con diseño responsive (memoizada)
  const renderCategoryGroup = useCallback((category: string, items: CartItem[]) => {
    const categoryMap = getCategoryMap(t);
    const categoryInfo = categoryMap[category as keyof typeof categoryMap];
    const IconComponent = categoryInfo.icon;

    return (
      <div key={category} className="space-y-3 sm:space-y-4">
        <div className="rounded-xl border border-[var(--shop-hairline)] bg-white p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
            <div className="rounded-full bg-[var(--shop-purple-wash)] p-2">
              <IconComponent className="h-4 w-4 text-[var(--shop-purple)] sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-[var(--shop-ink)] sm:text-xl">
                {categoryInfo.name}
              </h2>
              <p className="text-xs text-[var(--shop-muted)] sm:text-sm">
                {items.length} {items.length === 1 ? t('cart.product') : t('cart.products')}
              </p>
            </div>
            <Badge className="rounded-full border border-[var(--shop-hairline)] bg-white text-xs font-medium text-[var(--shop-ink)] sm:text-sm">
              {items.reduce((sum, item) => sum + (item?.cantidad ?? 0), 0)} {t('cart.products')}
            </Badge>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map(item => renderCartItem(item))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }, [t, renderCartItem]);

  // Estados de carga y protección de ruta
  if (!isAuthenticated && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-[var(--shop-canvas-muted)] py-24 text-[var(--shop-ink)]">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-[var(--shop-hairline)] border-t-[var(--shop-purple)]" />
          <p className="text-sm text-[var(--shop-muted)]">{t('cart.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <CartErrorBoundary
      onError={(error, errorInfo) => {
        console.error('🚨 Cart page error:', { error, errorInfo });
      }}
    >
      <div className="bg-[var(--shop-canvas-muted)] text-[var(--shop-ink)]">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 rounded-xl border border-[var(--shop-hairline)] bg-white p-4 sm:mb-8 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className={cn('h-11 w-11 rounded-full p-0 hover:bg-[var(--shop-canvas-muted)]', shopChrome.focus)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="rounded-full bg-[var(--shop-purple-wash)] p-2">
                    <ShoppingCart className="h-5 w-5 text-[var(--shop-purple)]" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg font-semibold tracking-tight text-[var(--shop-ink)] sm:text-xl md:text-2xl">{t('cart.title')}</h1>
                    <p className="text-sm text-[var(--shop-muted)]">
                      {totalQuantity} {totalQuantity === 1 ? t('cart.product') : t('cart.products')}
                    </p>
                  </div>
                </div>

                {!isEmpty && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden text-right sm:block">
                      <p className="text-xs text-[var(--shop-muted)] sm:text-sm">{t('cart.estimatedTotal')}</p>
                      <p className="text-lg font-semibold text-[var(--shop-purple)] sm:text-xl md:text-2xl">
                        {formatPrice(displaySubtotal + displayTaxes + displayConsigne)}
                      </p>
                      <div className="text-xs text-[var(--shop-muted)]">
                        {notDeliverable ? (
                          <span className="font-medium text-red-600">
                            {shippingMessage || t('cart.errors.notDeliverable')}
                          </span>
                        ) : needsAddress ? (
                          <span className="font-medium text-[var(--shop-purple)]">
                            {t('cart.summary.addressRequired')}
                          </span>
                        ) : finalShippingCost === 0 ? (
                          <span className={isFreeShippingApplied ? 'font-medium text-[var(--shop-purple)]' : ''}>
                            {t('cart.freeShipping')}
                            {isFreeShippingApplied && ' ✓'}
                          </span>
                        ) : shippingMessage ? (
                          <span>
                            + {formatPrice(finalShippingCost)} {t('cart.shipping')} ({t('cart.checkout.estimated')})
                          </span>
                        ) : `+ ${formatPrice(finalShippingCost)} ${t('cart.shipping')}`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCart}
                      className={cn('h-11 w-11 p-0 text-[var(--shop-muted)] hover:bg-[var(--shop-canvas-muted)] hover:text-[var(--shop-ink)]', shopChrome.focus)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido principal */}
            {isEmpty ? (
              <div className="rounded-xl border border-[var(--shop-hairline)] bg-white p-6 text-center sm:p-8">
                <div className="mx-auto max-w-md">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)]">
                    <ShoppingBag className="h-6 w-6 text-[var(--shop-muted)]" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-[var(--shop-ink)] sm:text-lg">{t('cart.empty.title')}</h3>
                  <p className="mb-6 text-sm text-[var(--shop-muted)] sm:text-base">
                    {t('cart.empty.description')}
                  </p>
                  <Button
                    onClick={() => router.push('/productos')}
                    className={shopChrome.inkCta}
                  >
                    {t('cart.empty.exploreProducts')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {categoryOrder.map(category => {
                    const items = groupedItems[category];
                    if (!items || items.length === 0) return null;
                    return renderCategoryGroup(category, items);
                  })}
                </div>

                {/* Resumen del carrito - responsive */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20 rounded-xl border border-[var(--shop-hairline)] bg-white p-4 sm:top-24 sm:p-6">
                    <div className="mb-4 flex items-center gap-2 sm:mb-6">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--shop-purple-wash)]">
                        <ShoppingBag className="h-4 w-4 text-[var(--shop-purple)]" />
                      </div>
                      <h3 className="text-base font-semibold text-[var(--shop-ink)] sm:text-xl">{t('cart.summary.title')}</h3>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--shop-muted)] sm:text-base">{t('cart.summary.subtotal')}</span>
                        <span className="text-sm font-medium text-[var(--shop-ink)] sm:text-base">{formatPrice(displaySubtotal)}</span>
                      </div>
                      <div className="flex items-start justify-between gap-8">
                        <span className="text-sm text-[var(--shop-muted)] sm:text-base">{t('cart.summary.shipping')}</span>
                        <div className="text-right text-sm">
                          <ShippingStatus summary={summary} variant="inline" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--shop-muted)] sm:text-base">{t('cart.summary.taxes')}</span>
                        <span className="text-sm font-medium text-[var(--shop-ink)] sm:text-base">{formatPrice(displayTaxes)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--shop-muted)] sm:text-base">{t('cart.summary.consigne')}</span>
                        <span className="text-sm font-medium text-[var(--shop-ink)] sm:text-base">{formatPrice(displayConsigne)}</span>
                      </div>
                      {!isFreeShippingApplied && !summary?.isPromotionEligible && displaySubtotal < shippingThreshold && finalShippingCost > 0 && (
                        <div className="rounded-full border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)] px-3 py-2 text-xs text-[var(--shop-ink)] sm:text-sm">
                          {t('cart.summary.shippingThreshold').replace('{amount}', formatPrice(shippingThreshold - displaySubtotal))}
                        </div>
                      )}

                      {/* Promoción Herencia u otras promociones especiales */}
                      <ShippingStatus summary={summary} variant="box" className="mt-2" />

                      {/* Componente de cupón */}
                      <div className="pt-2 sm:pt-3">
                        <CouponInput
                          onApplyCoupon={applyCoupon}
                          onRemoveCoupon={removeCoupon}
                          appliedCoupon={appliedCoupon}
                          disabled={isLoading || isEmpty}
                        />
                      </div>

                      {/* Mostrar descuento/ahorros si hay cupón aplicado */}
                      {appliedCoupon && savingsAmount > 0 && (
                        <div className="flex items-center justify-between text-[var(--shop-purple)]">
                          <span className="text-sm font-medium sm:text-base">
                            {appliedCoupon.type === 'free_shipping'
                              ? t('cart.checkout.savingsShipping')
                              : t('cart.summary.coupon.discount')}
                          </span>
                          <span className="text-sm font-medium sm:text-base">
                            -{formatPrice(savingsAmount)}
                          </span>
                        </div>
                      )}

                      <Separator className="bg-[var(--shop-hairline)]" />
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-[var(--shop-ink)] sm:text-lg">{t('cart.summary.total')}</span>
                        <span className="text-lg font-semibold text-[var(--shop-purple)] sm:text-xl md:text-2xl">{formatPrice(finalTotal)}</span>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[var(--shop-hairline)] pt-4 sm:mt-6 sm:pt-6">
                      <AddressSelector />
                    </div>

                    {/* Opciones de entrega - ahora integradas en el resumen */}
                    <div className="mt-4 sm:mt-6">
                      <DeliveryOptions
                        key={selectedAddress?.id || 'no-address'}
                        onOptionsChange={setDeliveryOptions}
                        disabled={false}
                        className="border-0 shadow-none bg-transparent p-0"
                        showAddressNote={!hasValidAddress}
                      />
                    </div>

                    <div className="mt-4 space-y-3 border-t border-[var(--shop-hairline)] pt-4 sm:mt-6 sm:pt-6">
                      <Button
                        size="lg"
                        className={cn('w-full', shopChrome.inkCta)}
                        onClick={() => {
                          console.log('🚨 CHECKOUT BUTTON CLICKED - Debug completo:', {
                            timestamp: new Date().toISOString(),
                            authState: {
                              isAuthenticated
                            },
                            addressState: {
                              hasAddresses,
                              addressesCount: addresses?.length || 0,
                              selectedAddressId: selectedAddress?.id,
                              selectedAddressCity: selectedAddress?.city,
                              selectedAddressPrimary: selectedAddress?.isPrimary,
                              hasValidAddress
                            },
                            cartState: {
                              isEmpty,
                              itemsCount: items.length,
                              totalQuantity
                            },
                            deliveryState: {
                              isValid: deliveryOptions.isValid,
                              deliveryOptions
                            },
                            shippingState: {
                              needsAddress,
                              shippingMessage,
                              finalShippingCost,
                              isFreeShippingApplied
                            },
                            buttonState: {
                              disabled: !isAuthenticated || isEmpty || checkoutLoading || verifyingAddress || !deliveryOptions.isValid || !hasAddresses || !selectedAddress?.id,
                              checkoutLoading,
                              verifyingAddress,
                              allConditionsMet: isAuthenticated && hasAddresses && selectedAddress?.id && deliveryOptions.isValid && !isEmpty
                            },
                            criticalChecks: {
                              passedAuth: isAuthenticated,
                              passedAddresses: hasAddresses,
                              passedSelectedAddress: !!selectedAddress?.id,
                              passedDelivery: deliveryOptions.isValid,
                              passedCart: !isEmpty,
                              passedBackendAddress: !needsAddress,
                              blockingCondition: !isAuthenticated ? 'AUTH' :
                                isEmpty ? 'EMPTY_CART' :
                                  checkoutLoading ? 'LOADING' :
                                    verifyingAddress ? 'VERIFYING_ADDRESS' :
                                      !deliveryOptions.isValid ? 'DELIVERY_OPTIONS' :
                                        !hasAddresses ? 'NO_ADDRESSES' :
                                          !selectedAddress?.id ? 'NO_SELECTED_ADDRESS' :
                                            needsAddress ? 'BACKEND_NEEDS_ADDRESS' : 'NONE'
                            }
                          });
                          handleCheckout();
                          // toast.info(t('cart.checkout.unavailable'));
                        }}
                        disabled={notDeliverable}
                      >
                        {checkoutLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t('cart.checkout.redirectingToStripe')}
                          </span>
                        ) : verifyingAddress ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            {t('cart.checkout.verifyingAddress')}
                          </span>
                        ) : !isAuthenticated ? t('cart.summary.authRequired') :
                          isEmpty ? t('cart.checkout.emptyCart') :
                            !hasAddresses ? t('cart.summary.addressRequired') :
                              !selectedAddress?.id ? t('cart.errors.selectAddress') :
                                notDeliverable ? (shippingMessage || t('cart.errors.notDeliverable')) :
                                needsAddress ? t('cart.checkout.processingAddress') :
                                  isSyncingWithBackend ? t('notifications.processing') :
                                    !deliveryOptions.isValid ? t('cart.delivery.error') :
                                      t('cart.summary.proceed')}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="inline-flex h-11 min-h-11 w-full items-center justify-center rounded-full border border-[var(--shop-hairline)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--shop-ink)] hover:bg-[var(--shop-canvas-muted)]"
                        onClick={() => router.push('/comidas')}
                      >
                        {t('cart.summary.continue')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </CartErrorBoundary>
  );
}
