"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, ShoppingBag, Trash2, Plus, Minus, X, Package, Utensils, Store, ArrowLeft, Heart } from 'lucide-react';
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
import { toast } from 'sonner';
import { CartItem } from '@/lib/services/cart';
import type { DeliveryOptions as DeliveryOptionsType } from '@/lib/services/cart';
import { useTranslation } from '@/hooks/useTranslation';
 
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
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { 
    items, 
    totalQuantity, 
    subtotal, 
    total, 
    isLoading, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    isEmpty,
    refreshCart 
  } = useCart();
  
  const { selectedAddress, primaryAddress, hasAddresses, addresses } = useAddresses();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptionsType & { isValid: boolean }>({
    horaEntregaPreferida: '18:00',
    metodoEntrega: 'puerta',
    notasEntrega: '',
    aplicarATodos: true,
    isValid: true
  });
  
  // Estado para manejar la habilitación inmediata de opciones de entrega
  const [hasValidAddress, setHasValidAddress] = useState(false);
  
  // Cálculos de totales mejorados - recalcular desde los items con impuestos reales
  const calculatedSubtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.cantidad * item.productos.precio), 0);
  }, [items]);

  // Cálculo de impuestos reales basado en TPS y TVQ como porcentajes del precio
  const calculatedTaxes = useMemo(() => {
    return items.reduce((sum, item) => {
      const basePrice = item.productos.precio * item.cantidad;
      const tpsAmount = item.productos.TPS ? (basePrice * item.productos.TPS / 100) : 0;
      const tvqAmount = item.productos.TVQ ? (basePrice * item.productos.TVQ / 100) : 0;
      return sum + tpsAmount + tvqAmount;
    }, 0);
  }, [items]);

  // Cálculo de consigne total
  const calculatedConsigne = useMemo(() => {
    return items.reduce((sum, item) => {
      const consigneAmount = item.productos.consigne ? item.productos.consigne * item.cantidad : 0;
      return sum + consigneAmount;
    }, 0);
  }, [items]);

  const shippingThreshold = 200; // Envío gratis a partir de $200
  const shippingCost = calculatedSubtotal >= shippingThreshold ? 0 : 8.99;
  const finalTotal = calculatedSubtotal + calculatedTaxes + calculatedConsigne + shippingCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Efecto para cargar el carrito al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated, refreshCart]);

  // Efecto para actualizar el estado de dirección válida
  useEffect(() => {
    const addressValid = isAuthenticated && (
      selectedAddress !== null || 
      hasAddresses || 
      (addresses && addresses.length > 0)
    );
    
    setHasValidAddress(addressValid);
  }, [isAuthenticated, selectedAddress, hasAddresses, addresses]);

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

  // Función para manejar cambios de cantidad
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
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
  };

  // Función para eliminar item del carrito
  const handleRemoveItem = async (itemId: string) => {
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
  };

  // Función para limpiar el carrito
  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success(t('cart.success.cartCleared'));
    } catch (error) {
      console.error('Error limpiando carrito:', error);
      toast.error(t('cart.errors.clearCart'));
    }
  };

  // Función para proceder al checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!hasValidAddress || !selectedAddress) {
      toast.error(t('cart.errors.selectAddress'));
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

    // Proceder al checkout
    router.push('/checkout');
  };

  // Función para renderizar badges de impuestos
  const renderTaxBadges = (item: CartItem) => {
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
  };

  // Renderizar item del carrito con diseño responsive
  const renderCartItem = (item: CartItem) => {
    const isItemLoading = loadingItems.has(item.id);
    const itemTotal = item.cantidad * item.productos.precio;
    
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
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                      {item.productos.categorias?.nombre || t('cart.noCategory')}
                    </p>
                    
                    <div className="flex items-center gap-2 sm:gap-4 mb-2">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-indigo-600">
                        {formatPrice(item.productos.precio)}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
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
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      {t('cart.stock')}: {item.productos.stock}
                    </Badge>
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
                      {item.cantidad} × {formatPrice(item.productos.precio)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Renderizar grupo de categoría con diseño responsive
  const renderCategoryGroup = (category: string, items: CartItem[]) => {
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
  };

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
                      {formatPrice(finalTotal)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {shippingCost === 0 ? t('cart.freeShipping') : `+ ${formatPrice(shippingCost)} ${t('cart.shipping')}`}
                    </p>
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
                      <span className="text-sm sm:text-base font-medium text-gray-900">{formatPrice(calculatedSubtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">{t('cart.summary.shipping')}</span>
                      <span className="text-sm sm:text-base font-medium text-gray-900">
                        {shippingCost === 0 ? t('cart.summary.freeShipping') : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">{t('cart.summary.taxes')}</span>
                      <span className="text-sm sm:text-base font-medium text-gray-900">{formatPrice(calculatedTaxes)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">{t('cart.summary.consigne')}</span>
                      <span className="text-sm sm:text-base font-medium text-gray-900">{formatPrice(calculatedConsigne)}</span>
                    </div>
                    {calculatedSubtotal < shippingThreshold && (
                      <div className="text-xs sm:text-sm text-amber-600 bg-amber-50 p-2 sm:p-3 rounded-lg">
                        {t('cart.summary.shippingThreshold').replace('{amount}', formatPrice(shippingThreshold - calculatedSubtotal))}
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
                      onClick={handleCheckout}
                      disabled={!isAuthenticated || !deliveryOptions.isValid}
                    >
                      {!isAuthenticated ? t('cart.summary.authRequired') : 
                       !deliveryOptions.isValid ? t('cart.delivery.error') : 
                       !hasValidAddress ? t('cart.summary.addressRequired') : 
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
  );
}
