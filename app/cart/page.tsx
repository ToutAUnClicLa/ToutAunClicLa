"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, ShoppingBag, Trash2, Plus, Minus, Package, Utensils, Store, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { Card, CardContent } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import AuthModal from '@/components/features/auth/AuthModal';
import { AddressSelector } from '@/components/features/modules/cart/AddressSelector';
import DeliveryOptions from '@/components/features/modules/cart/DeliveryOptions';
import { CouponInput } from '@/components/features/modules/cart/CouponInput';
import { ShippingStatus } from '@/components/features/modules/cart/ShippingStatus';
import { CartErrorBoundary } from '@/components/features/modules/cart/CartErrorBoundary';
import { toast } from 'sonner';
import { CartItem } from '@/lib/services/cart';
import type { DeliveryOptions as DeliveryOptionsType } from '@/lib/services/cart';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCartItemVariations } from '@/lib/utils/variations';
import { logBackendDataQuality } from '@/lib/utils/cart-validation';
import { CartItemVariations } from '@/components/features/modules/cart/CartItemVariations';
 
// Mapeo de categorías con estilos modernos
const getCategoryMap = (t: any) => ({
  productos: { 
    name: t('cart.categories.productos'), 
    icon: Package, 
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    iconBg: 'bg-indigo-100'
  },
  comidas: { 
    name: t('cart.categories.comidas'), 
    icon: Utensils, 
    color: 'text-amber-600',
    bgColor: 'bg-gradient-to-r from-amber-50 to-amber-100',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-100'
  },
  boutique: { 
    name: t('cart.categories.boutique'), 
    icon: Store, 
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    badgeColor: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-100'
  }
});

// Función para determinar la categoría de un item
const getItemCategory = (item: CartItem): string => {
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
  
  const { selectedAddress, hasAddresses, addresses } = useAddresses();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [expandedVariations, setExpandedVariations] = useState<Set<string>>(new Set());
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptionsType & { isValid: boolean }>({
    horaEntregaPreferida: '18:00',
    metodoEntrega: 'puerta',
    notasEntrega: '',
    aplicarATodos: true,
    isValid: true
  });
  
  // Estado para manejar la habilitación inmediata de opciones de entrega
  const [hasValidAddress, setHasValidAddress] = useState(false);
  
  // Helper function to calculate item price including variations
  const calculateItemFinalPrice = useCallback((item: CartItem) => {
    const basePrice = item.productos.precio;
    
    let variationModifier = 0;
    if (item.variations && item.variations.length > 0) {
      variationModifier = item.variations.reduce((varSum, variation) => {
        const modifier = variation.price_at_time ?? variation.product_variations?.price_modifier ?? 0;
        return varSum + (modifier * variation.quantity);
      }, 0);
    }
    
    return basePrice + variationModifier;
  }, []);

  // Helper function to get detailed pricing breakdown for display
  const getItemPricingDetails = useCallback((item: CartItem) => {
    const basePrice = item.productos.precio;
    const baseSubtotal = basePrice;
    
    let variationModifier = 0;
    if (item.variations && item.variations.length > 0) {
      variationModifier = item.variations.reduce((varSum, variation) => {
        const modifier = variation.price_at_time ?? variation.product_variations?.price_modifier ?? 0;
        return varSum + (modifier * variation.quantity);
      }, 0);
    }
    
    const finalSubtotal = basePrice + variationModifier;
    
    return {
      baseSubtotal,
      variationModifier,
      finalSubtotal
    };
  }, []);
  
  // 🚨 BACKEND AS SINGLE SOURCE OF TRUTH - Minimal local calculations for offline fallback only
  const calculatedSubtotal = useMemo(() => {
    // Only calculate when backend data is unavailable
    if (summary?.subtotal !== undefined) return summary.subtotal;
    
    return items.reduce((sum, item) => {
      const finalItemPrice = calculateItemFinalPrice(item) * item.cantidad;
      return sum + finalItemPrice;
    }, 0);
  }, [items, calculateItemFinalPrice, summary?.subtotal]);

  // Emergency fallback for taxes calculation
  const calculatedTaxes = useMemo(() => {
    if (summary?.totalTaxes !== undefined) return summary.totalTaxes;
    
    return items.reduce((sum, item) => {
      const finalItemPrice = calculateItemFinalPrice(item) * item.cantidad;
      const tpsAmount = item.productos.TPS ? (finalItemPrice * item.productos.TPS / 100) : 0;
      const tvqAmount = item.productos.TVQ ? (finalItemPrice * item.productos.TVQ / 100) : 0;
      return sum + tpsAmount + tvqAmount;
    }, 0);
  }, [items, calculateItemFinalPrice, summary?.totalTaxes]);

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

  // Functions for variation expansion
  const toggleVariationExpansion = useCallback((itemId: string) => {
    setExpandedVariations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);
  
  // 🚚 CRITICAL FIX: New shipping state management from backend
  // Always use the latest values from summary, with proper fallbacks
  const shippingMessage = summary?.shippingMessage || null;
  const needsAddress = summary?.needsAddress || false;
  
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
      // Use validation utility for consistent monitoring
      logBackendDataQuality(summary, 'cart page');
      
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
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // 🚨 REMOVED: renderShippingDisplay - replaced with ShippingStatus component
  // This function is no longer needed as ShippingStatus component handles all shipping display logic

  // Efecto para cargar el carrito al montar el componente y cuando cambia la dirección principal
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Cargando carrito - Autenticación o dirección cambió:', {
        isAuthenticated,
        hasSelectedAddress: !!selectedAddress,
        addressId: selectedAddress?.id,
        addressCity: selectedAddress?.city,
        hasCoupon: !!appliedCoupon
      });
      
      // Solo recargar el carrito, NO reaplicar el cupón
      // El cupón ya está aplicado en el backend y vendrá con refreshCart
      refreshCart();
    }
  }, [isAuthenticated, selectedAddress?.id, refreshCart]); // Removí applyCoupon y appliedCoupon de las dependencias

  // Efecto para actualizar el estado de dirección válida
  useEffect(() => {
    const addressValid = isAuthenticated && (
      selectedAddress !== null || 
      hasAddresses || 
      (addresses && addresses.length > 0)
    );
    
    setHasValidAddress(addressValid);
  }, [isAuthenticated, selectedAddress, hasAddresses, addresses]);

  // Listener para cambios de direcciones que requieren recarga del carrito
  useEffect(() => {
    const handleAddressChange = (event: CustomEvent) => {
      const { action, address } = event.detail;
      console.log('🏠 Evento de cambio de dirección recibido en carrito:', {
        action,
        addressId: address?.id,
        city: address?.city,
        isPrimary: address?.isPrimary
      });
      
      // Recargar carrito cuando hay cambios en direcciones
      const reloadCartForAddressChange = async () => {
        try {
          console.log('♻️ Recargando carrito debido a cambio de dirección...');
          
          if (appliedCoupon && (appliedCoupon.code || appliedCoupon.codigo)) {
            const couponCode = appliedCoupon.code || appliedCoupon.codigo;
            if (couponCode) {
              console.log('🎟️ Recargando carrito con cupón tras cambio de dirección:', couponCode);
              await applyCoupon(couponCode);
            } else {
              await refreshCart();
            }
          } else {
            await refreshCart();
          }
          
          console.log('✅ Carrito recargado exitosamente tras cambio de dirección');
        } catch (error) {
          console.error('❌ Error recargando carrito tras cambio de dirección:', error);
        }
      };
      
      reloadCartForAddressChange();
    };

    // Agregar listener
    if (typeof window !== 'undefined') {
      window.addEventListener('addressChanged', handleAddressChange as EventListener);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('addressChanged', handleAddressChange as EventListener);
      }
    };
  }, [appliedCoupon, applyCoupon, refreshCart]);

  // Mostrar modal de autenticación si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, isLoading]);

  // Agrupar items por categoría
  const groupedItems = useMemo(() => {
    const grouped: { [key: string]: CartItem[] } = {};
    
    items.forEach(item => {
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
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // 🚚 CRITICAL FIX: Improved address validation logic
    // Priority 1: Backend says address is needed (most authoritative)
    if (needsAddress) {
      toast.error(t('cart.summary.addAddressRequired'));
      console.log('❌ Checkout blocked: Backend requires address (needsAddress=true)');
      return;
    }
    
    // Priority 2: Local validation for address selection
    if (!hasValidAddress || !selectedAddress) {
      toast.error(t('cart.errors.selectAddress'));
      console.log('❌ Checkout blocked: No valid address selected locally');
      return;
    }

    if (isEmpty) {
      toast.error(t('cart.errors.emptyCart'));
      return;
    }

    // Validar opciones de entrega
    if (!deliveryOptions.horaEntregaPreferida) {
      toast.error(t('cart.errors.deliveryTimeRequired'));
      return;
    }

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
        toast.error('Error con el cupón aplicado. Por favor, aplica el cupón nuevamente.');
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
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente');
        setShowAuthModal(true);
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
      
      // Añadir cupón solo si está realmente aplicado
      if (appliedCoupon && (appliedCoupon.code || appliedCoupon.codigo)) {
        payload.coupon_code = appliedCoupon.code || appliedCoupon.codigo;
        console.log('🎟️ Cupón incluido en checkout:', {
          code: payload.coupon_code,
          type: appliedCoupon.type,
          discount: appliedCoupon.discount || appliedCoupon.valor,
          savings: savingsAmount
        });
      }
      
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

      // Log information about variations in cart
      const itemsWithVariations = items.filter(item => item.variations && item.variations.length > 0);
      if (itemsWithVariations.length > 0) {
        console.log('🎨 Items con variaciones en checkout:', itemsWithVariations.map(item => ({
          productId: item.producto_id,
          productName: item.productos.nombre,
          quantity: item.cantidad,
          variations: item.variations?.map(v => ({
            name: v.product_variations.name,
            quantity: v.quantity,
            modifier: v.product_variations.price_modifier,
            priceAtTime: v.price_at_time
          }))
        })));
      }
      
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
          toast.error(`Error con el cupón: ${data.message}`);
        } else {
          toast.error(data.message || data.error || 'Error creando sesión de checkout');
        }
        return;
      }

      console.log('✅ Checkout session creada exitosamente!');
      console.log('Session ID:', data.sessionId);
      console.log('URL de Stripe:', data.url);
      
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
      toast.error(error.message || 'Error procesando el pago. Intenta nuevamente.');
      setCheckoutLoading(false);
    }
  }, [
    isAuthenticated, needsAddress, hasValidAddress, selectedAddress, isEmpty, 
    deliveryOptions, appliedCoupon, finalTotal, savingsAmount, isFreeShippingApplied, t
  ]);

  // Función para renderizar badges de impuestos (memoizada)
  const renderTaxBadges = useCallback((item: CartItem) => {
    const badges = [];
    
    // Determinar si es taxable basado en si tiene TPS o TVQ
    const isTaxable = (item.productos.TPS && item.productos.TPS > 0) || 
                      (item.productos.TVQ && item.productos.TVQ > 0);
    
    // Badge de Non Taxable (si no tiene TPS ni TVQ)
    if (!isTaxable) {
      badges.push(
        <Badge 
          key="non-taxable"
          className="bg-green-100 text-green-700 border-green-200 text-xs"
        >
          Non Taxable
        </Badge>
      );
    }
    
    // Badge de TPS (si tiene TPS) - mostrar porcentaje
    if (item.productos.TPS && item.productos.TPS > 0) {
      badges.push(
        <Badge 
          key="tps"
          className="bg-blue-100 text-blue-700 border-blue-200 text-xs"
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
          className="bg-purple-100 text-purple-700 border-purple-200 text-xs"
        >
          +TVQ: {item.productos.TVQ}%
        </Badge>
      );
    }
    
    // Badge de Consigne (si tiene consigne) - este sí se muestra en dólares
    if (item.productos.consigne && item.productos.consigne > 0) {
      const consigneAmount = item.productos.consigne * item.cantidad;
      badges.push(
        <Badge 
          key="consigne"
          className="bg-amber-100 text-amber-700 border-amber-200 text-xs"
        >
          +Consigne: {formatPrice(consigneAmount)}
        </Badge>
      );
    }
    
    return badges;
  }, [formatPrice]);

  // Renderizar item del carrito con diseño responsive (memoizada)
  const renderCartItem = useCallback((item: CartItem) => {
    const isItemLoading = loadingItems.has(item.id);
    const itemPriceWithVariations = calculateItemFinalPrice(item);
    const itemTotal = item.cantidad * itemPriceWithVariations;
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 0}}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`overflow-hidden transition-all duration-200 border-0 shadow-sm hover:shadow-md ${isItemLoading ? 'opacity-50' : ''}`}>
          <CardContent className="p-3 sm:p-4 md:p-3">
            <div className="flex gap-3 sm:gap-4 md:gap-6">
              {/* Imagen del producto - responsive */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg md:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                <Image
                  src={item.productos.imagen_principal}
                  alt={item.productos.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.svg';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2 sm:pr-4">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 mb-1 line-clamp-2">
                      {item.productos.nombre}
                    </h3>
                    
                    {/* Mostrar variaciones seleccionadas */}
                    {item.variations && item.variations.length > 0 && (
                      <div className="mb-3 space-y-2">
                        <CartItemVariations 
                          item={item} 
                          showDetailed={false}
                          className=""
                        />
                        
                        {/* Botón para expandir detalles */}
                        <button
                          onClick={() => toggleVariationExpansion(item.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                        >
                          {expandedVariations.has(item.id) ? (
                            <>
                              <ChevronUp className="w-3 h-3" />
                              Ocultar detalles
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3" />
                              Ver detalles de precio
                            </>
                          )}
                        </button>
                        
                        {/* Detalles expandidos */}
                        {expandedVariations.has(item.id) && (
                          <div className="mt-3">
                            <CartItemVariations 
                              item={item} 
                              showDetailed={true}
                              className=""
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                      {item.productos.categorias?.nombre || t('cart.noCategory')}
                    </p>
                    
                    <div className="flex items-center gap-2 sm:gap-4 mb-2">
                      {item.variations && item.variations.length > 0 ? (
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Personalizado ({item.cantidad} × {formatPrice(item.productos.precio)})
                            </span>
                            <span className="text-sm sm:text-base md:text-lg font-bold text-indigo-600">
                              {formatPrice(getItemPricingDetails(item).finalSubtotal)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm sm:text-base md:text-lg font-bold text-indigo-600">
                            {formatPrice(item.productos.precio)}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {t('cart.perUnit')}
                          </span>
                        </>
                      )}
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
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                        disabled={isItemLoading || item.cantidad <= 1}
                        className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-r-none"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium min-w-[2rem] sm:min-w-[3rem] text-center">
                        {item.cantidad}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                        disabled={isItemLoading || item.cantidad >= item.productos.stock}
                        className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-l-none"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                      {formatPrice(itemTotal)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                      {item.cantidad} × {formatPrice(itemPriceWithVariations)}
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
    loadingItems, calculateItemFinalPrice, getItemPricingDetails, 
    formatCartItemVariations, formatPrice, renderTaxBadges, 
    handleRemoveItem, handleQuantityChange, t
  ]);

  // Renderizar grupo de categoría con diseño responsive (memoizada)
  const renderCategoryGroup = useCallback((category: string, items: CartItem[]) => {
    const categoryMap = getCategoryMap(t);
    const categoryInfo = categoryMap[category as keyof typeof categoryMap];
    const IconComponent = categoryInfo.icon;
    
    return (
      <div key={category} className="space-y-3 sm:space-y-4">
        <div className={`${categoryInfo.bgColor} ${categoryInfo.borderColor} border-2 rounded-xl sm:rounded-2xl p-3 sm:p-4`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className={`${categoryInfo.iconBg} p-1.5 sm:p-2 rounded-lg`}>
              <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${categoryInfo.color}`} />
            </div>
            <div className="flex-1">
              <h2 className={`text-lg sm:text-xl font-bold ${categoryInfo.color}`}>
                {categoryInfo.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                {items.length} {items.length === 1 ? t('cart.product') : t('cart.products')}
              </p>
            </div>
            <div className="ml-auto">
              <Badge className={`${categoryInfo.badgeColor} border-0 text-xs sm:text-sm`}>
                {items.reduce((sum, item) => sum + item.cantidad, 0)} {t('cart.products')}
              </Badge>
            </div>
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

  // Estados de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600">{t('cart.loading')}</p>
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
      <div className="min-h-screen bg-gray-50 ">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="max-w-6xl mx-auto">
          {/* Header responsive */}
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{t('cart.title')}</h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    {totalQuantity} {totalQuantity === 1 ? t('cart.product') : t('cart.products')}
                  </p>
                </div>
              </div>
              
              {!isEmpty && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs sm:text-sm text-gray-600">{t('cart.estimatedTotal')}</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600">
                      {formatPrice(displaySubtotal + displayTaxes + displayConsigne)}
                    </p>
                    <div className="text-xs text-gray-500">
                      {needsAddress ? (
                        <span className="text-amber-600 font-medium">
                          {t('cart.summary.addressRequired')}
                        </span>
                      ) : finalShippingCost === 0 ? (
                        <span className={isFreeShippingApplied ? 'text-green-600 font-medium' : ''}>
                          {t('cart.freeShipping')}
                          {isFreeShippingApplied && ' ✓'}
                        </span>
                      ) : shippingMessage ? (
                        <span className="text-orange-600">
                          + {formatPrice(finalShippingCost)} {t('cart.shipping')} (estimado)
                        </span>
                      ) : `+ ${formatPrice(finalShippingCost)} ${t('cart.shipping')}`}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-10 sm:w-10 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          {isEmpty ? (
            <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4">
                  <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{t('cart.empty.title')}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  {t('cart.empty.description')}
                </p>
                <Button 
                  onClick={() => router.push('/productos')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-sm sm:text-base px-4 sm:px-6"
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
                <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-20 sm:top-24">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-base sm:text-xl font-semibold text-gray-900">{t('cart.summary.title')}</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">{t('cart.summary.subtotal')}</span>
                      <span className="text-sm sm:text-base font-medium text-gray-900">{formatPrice(displaySubtotal)}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm sm:text-base text-gray-600">{t('cart.summary.shipping')}</span>
                      <div className="text-right">
                        <ShippingStatus summary={summary} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">{t('cart.summary.taxes')}</span>
                      <span className="text-sm sm:text-base font-medium text-gray-900">{formatPrice(displayTaxes)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">{t('cart.summary.consigne')}</span>
                      <span className="text-sm sm:text-base font-medium text-gray-900">{formatPrice(displayConsigne)}</span>
                    </div>
                    {!isFreeShippingApplied && displaySubtotal < shippingThreshold && finalShippingCost > 0 && (
                      <div className="text-xs sm:text-sm text-amber-600 bg-amber-50 p-2 sm:p-3 rounded-lg">
                        {t('cart.summary.shippingThreshold').replace('{amount}', formatPrice(shippingThreshold - displaySubtotal))}
                      </div>
                    )}
                    
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
                      <div className="flex justify-between items-center text-green-600">
                        <span className="text-sm sm:text-base font-medium">
                          {appliedCoupon.type === 'free_shipping' 
                            ? 'Ahorro en envío' 
                            : t('cart.summary.coupon.discount')}
                        </span>
                        <span className="text-sm sm:text-base font-medium">
                          -{formatPrice(savingsAmount)}
                        </span>
                      </div>
                    )}
                    
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-semibold text-gray-900">{t('cart.summary.total')}</span>
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  
                  {/* Selector de direcciones */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <AddressSelector />
                  </div>
                  
                  {/* Opciones de entrega - ahora integradas en el resumen */}
                  <div className="mt-4 sm:mt-6">
                    <DeliveryOptions 
                      onOptionsChange={setDeliveryOptions}
                      disabled={false}
                      className="border-0 shadow-none bg-transparent p-0"
                      showAddressNote={!hasValidAddress}
                    />
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <Button 
                      size="lg" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm sm:text-base h-10 sm:h-12"
                      onClick={() => {
                        console.log('🔍 Button clicked - Debug info:', {
                          isAuthenticated,
                          hasValidAddress,
                          needsAddress,
                          shippingMessage,
                          deliveryOptionsValid: deliveryOptions.isValid,
                          selectedAddress: selectedAddress ? { id: selectedAddress.id, city: selectedAddress.city } : null,
                          addressesCount: addresses?.length || 0,
                          shippingState: {
                            cost: finalShippingCost,
                            isFree: isFreeShippingApplied,
                            message: shippingMessage,
                            needsAddress: needsAddress
                          }
                        })
                        handleCheckout()
                      }}
                      disabled={!isAuthenticated || !deliveryOptions.isValid || !hasValidAddress || isEmpty || checkoutLoading || needsAddress}
                    >
                      {checkoutLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Redirigiendo a Stripe...
                        </span>
                      ) : !isAuthenticated ? t('cart.summary.authRequired') : 
                       isEmpty ? 'Carrito vacío' :
                       needsAddress ? t('cart.summary.addressRequired') :
                       !hasValidAddress ? t('cart.summary.addressRequired') : 
                       !deliveryOptions.isValid ? t('cart.delivery.error') : 
                       t('cart.summary.proceed')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full text-sm sm:text-base h-10 sm:h-12"
                      onClick={() => router.push('/productos')}
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
      
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          redirectUrl="/cart"
        />
      </div>
    </CartErrorBoundary>
  );
}
