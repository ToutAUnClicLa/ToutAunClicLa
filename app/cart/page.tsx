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
import AuthModal from '@/components/features/auth/AuthModal';
import { toast } from 'sonner';
import { CartItem } from '@/lib/services/cart';
import { useTranslation } from '@/hooks/useTranslation';

// Añadir clase CSS para mejorar el truncado de texto en móviles
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @media (max-width: 640px) {
    .line-clamp-2 {
      -webkit-line-clamp: 1;
    }
  }
`;

// Mapeo de categorías con estilos modernos
const categoryMap = {
  productos: { 
    name: 'Productos', 
    icon: Package, 
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    iconBg: 'bg-indigo-100'
  },
  comidas: { 
    name: 'Comidas', 
    icon: Utensils, 
    color: 'text-amber-600',
    bgColor: 'bg-gradient-to-r from-amber-50 to-amber-100',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-100'
  },
  boutique: { 
    name: 'Boutique', 
    icon: Store, 
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    badgeColor: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-100'
  }
};

// Función para determinar la categoría de un item
const getItemCategory = (item: CartItem): string => {
  const categoryName = item.productos.categorias?.nombre?.toLowerCase() || '';
  
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
    loadCartNow
  } = useCart({ autoLoad: true });
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  // Agrupar items por categoría
  const itemsByCategory = useMemo(() => {
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

  // Ordenar categorías
  const sortedCategories = useMemo(() => {
    return categoryOrder.filter(category => itemsByCategory[category]?.length > 0);
  }, [itemsByCategory]);

  // Cálculos de totales mejorados - recalcular desde los items
  const calculatedSubtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.cantidad * item.productos.precio), 0);
  }, [items]);

  const taxRate = 0.19; // 15% de impuestos (GST/HST en Quebec)
  const shippingThreshold = 50; // Envío gratis a partir de $50
  const shippingCost = calculatedSubtotal >= shippingThreshold ? 0 : 8.99;
  const taxes = calculatedSubtotal * taxRate;
  const finalTotal = calculatedSubtotal + taxes + shippingCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setLoadingItems(prev => new Set(prev).add(itemId));
    try {
      await updateQuantity(itemId, newQuantity);
      toast.success('Cantidad actualizada');
    } catch (error) {
      toast.error('Error al actualizar la cantidad');
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setLoadingItems(prev => new Set(prev).add(itemId));
    try {
      await removeFromCart(itemId);
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      toast.error('Error al eliminar el producto');
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleCheckout = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    router.push('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        await clearCart();
        toast.success('Carrito vaciado');
      } catch (error) {
        toast.error('Error al vaciar el carrito');
      }
    }
  };

  const renderCartItem = (item: CartItem) => {
    const isItemLoading = loadingItems.has(item.id);
    const itemTotal = item.cantidad * item.productos.precio;
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`overflow-hidden transition-all duration-200 border-0 shadow-sm hover:shadow-md ${isItemLoading ? 'opacity-50' : ''}`}>
          <CardContent className="p-2">
            <div className="flex gap-6">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                <Image
                  src={item.productos.imagen_principal}
                  alt={item.productos.nombre}
                  fill
                  className="object-cover"
                  sizes="96px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.svg';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {item.productos.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.productos.categorias?.nombre || 'Sin categoría'}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-indigo-600">
                        {formatPrice(item.productos.precio)}
                      </span>
                      <span className="text-sm text-gray-500">
                        c/u
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0 rounded-full"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isItemLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 border rounded-lg bg-gray-50 overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-200 rounded-none"
                      onClick={() => handleQuantityChange(item.id, Math.max(1, item.cantidad - 1))}
                      disabled={item.cantidad <= 1 || isItemLoading}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-1 text-sm font-semibold bg-white min-w-[48px] text-center">
                      {item.cantidad}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-200 rounded-none"
                      onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                      disabled={isItemLoading || item.cantidad >= item.productos.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {formatPrice(itemTotal)}
                    </div>
                    {item.productos.stock <= 5 && (
                      <Badge variant="secondary" className="mt-1 text-xs bg-amber-100 text-amber-700 border-amber-200">
                        Solo {item.productos.stock} disponibles
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Cargando carrito...</h3>
                <p className="text-sm text-gray-600">
                  Estamos preparando tus productos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-6 p-8">
              <div className="relative">
                <div className="h-20 w-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="h-10 w-10 text-indigo-600" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-900 mb-2">¡Inicia sesión!</h3>
                <p className="text-gray-600 mb-6">
                  Para ver y gestionar tu carrito de compras necesitas iniciar sesión
                </p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Iniciar sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-6 p-8">
              <div className="relative">
                <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-10 w-10 text-gray-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-white rounded-full border-4 border-gray-50 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-900 mb-2">Tu carrito está vacío</h3>
                <p className="text-gray-600 mb-6">
                  Descubre nuestros increíbles productos y añade algunos a tu carrito
                </p>
                <Button 
                  onClick={() => router.push('/productos')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Explorar productos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header con estilo de la página */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 bg-white/10 rounded-full">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">Mi Carrito</h1>
                    <Badge className="bg-white/20 hover:bg-white/30 w-fit text-white border-white/30">
                      {totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-indigo-100">
                    <p className="text-sm">
                      Total: {formatPrice(finalTotal)}
                    </p>
                    <p className="text-xs">
                      {shippingCost === 0 ? 'Envío gratis incluido' : `+ ${formatPrice(shippingCost)} envío`}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Button>
                  
                  {!isEmpty && (
                    <Button
                      variant="secondary"
                      onClick={handleClearCart}
                      className="bg-red-500/20 border-red-400/30 text-red-100 hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Vaciar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-full">
                  <Package className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalQuantity}</p>
                  <p className="text-sm text-gray-600">Productos en carrito</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(subtotal)}</p>
                  <p className="text-sm text-gray-600">Subtotal</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-full">
                  <Heart className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(finalTotal)}</p>
                  <p className="text-sm text-gray-600">Total final</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence>
              {sortedCategories.map((categoryKey, index) => {
                const categoryItems = itemsByCategory[categoryKey];
                const categoryInfo = categoryMap[categoryKey as keyof typeof categoryMap];
                const Icon = categoryInfo.icon;
                
                return (
                  <motion.div
                    key={categoryKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    {/* Header de categoría */}
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-xl ${categoryInfo.bgColor} border ${categoryInfo.borderColor}`}>
                      <div className={`p-3 rounded-lg ${categoryInfo.iconBg}`}>
                        <Icon className={`h-6 w-6 ${categoryInfo.color}`} />
                      </div>
                      <div className="flex-1">
                        <h2 className={`font-bold text-xl ${categoryInfo.color}`}>
                          {categoryInfo.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {categoryItems.length} {categoryItems.length === 1 ? 'producto' : 'productos'}
                        </p>
                      </div>
                      <Badge className={`${categoryInfo.badgeColor} font-semibold px-3 py-1`}>
                        {categoryItems.length}
                      </Badge>
                    </div>
                    
                    {/* Items de la categoría */}
                    <div className="space-y-4">
                      {categoryItems.map(item => renderCartItem(item))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Resumen del carrito */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({totalQuantity} productos):</span>
                      <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Envío:</span>
                      <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TPS - TVQ (19%):</span>
                      <span className="font-medium text-gray-900">{formatPrice(taxes)}</span>
                    </div>
                    {subtotal < shippingThreshold && (
                      <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                        Agrega {formatPrice(shippingThreshold - subtotal)} más para envío gratis
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-900">Total:</span>
                      <span className="font-bold text-2xl text-indigo-600">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={isEmpty}
                    >
                      Proceder al checkout
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/productos')}
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl"
                    >
                      Seguir comprando
                    </Button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Heart className="h-4 w-4" />
                      <span>Envío gratis en pedidos superiores a $50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
