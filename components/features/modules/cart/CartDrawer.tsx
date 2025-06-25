"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, ShoppingBag, Trash2, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { Card, CardContent } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/common/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import AuthModal from '@/components/features/auth/AuthModal';

export function CartDrawer() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    items, 
    totalQuantity, 
    subtotal, 
    total, 
    isLoading, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    isEmpty
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setLoadingItems(prev => new Set(prev).add(itemId));
    try {
      await updateQuantity(itemId, newQuantity);
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
    setIsOpen(false);
    router.push('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      await clearCart();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            {totalQuantity > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
              >
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </Badge>
            )}
          </Button>
        </SheetTrigger>        
        
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader className="space-y-2.5">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl">Carrito de Compras</SheetTitle>
              {!isEmpty && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Vaciar
                </Button>
              )}
            </div>
            {totalQuantity > 0 && (
              <p className="text-sm text-gray-600">
                {totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'}
              </p>
            )}
          </SheetHeader>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600">Cargando carrito...</p>
              </div>
            </div>
          ) : !user ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Inicia sesión</h3>
                  <p className="text-gray-600 mb-4">
                    Inicia sesión para ver tu carrito de compras
                  </p>
                  <Button onClick={() => setShowAuthModal(true)}>
                    Iniciar sesión
                  </Button>
                </div>
              </div>
            </div>
          ) : isEmpty ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-600 mb-4">
                    Agrega algunos productos para comenzar
                  </p>
                  <Button 
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/productos');
                    }}
                  >
                    Explorar productos
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                <AnimatePresence>
                  {items.map((item) => {
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
                        <Card className={`overflow-hidden \${isItemLoading ? 'opacity-50' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={item.productos.imagen_principal}
                                  alt={item.productos.nombre}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-sm line-clamp-2 text-gray-900">
                                    {item.productos.nombre}
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-600 hover:text-red-700 flex-shrink-0 ml-2"
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={isItemLoading}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center border rounded-lg">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleQuantityChange(item.id, Math.max(1, item.cantidad - 1))}
                                      disabled={item.cantidad <= 1 || isItemLoading}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                      {item.cantidad}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                                      disabled={isItemLoading}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                      {formatPrice(itemTotal)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatPrice(item.productos.precio)} c/u
                                    </p>
                                  </div>
                                </div>

                                {item.productos.stock <= 5 && item.productos.stock > 0 && (
                                  <p className="text-xs text-amber-600 mt-1">
                                    ¡Solo quedan {item.productos.stock} unidades!
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isEmpty}
                  >
                    Proceder al checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/productos');
                    }}
                  >
                    Seguir comprando
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        redirectUrl="/checkout"
      />
    </>
  );
}
