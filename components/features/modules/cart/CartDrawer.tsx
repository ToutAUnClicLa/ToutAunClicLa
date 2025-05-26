"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/common/ui/sheet';
import { Button } from '@/components/common/ui/button';
import { Separator } from '@/components/common/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { getCartItems, updateCartItemQuantity, removeFromCart, type CartItem } from '@/lib/services/cart';
import AuthModal from '@/components/features/auth/AuthModal';

export function CartDrawer() {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const loadCartItems = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast.error('Error al cargar el carrito');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      loadCartItems();
    }
  }, [isOpen, user, loadCartItems]);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      await updateCartItemQuantity(itemId, newQuantity);
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, cantidad: newQuantity } : item
      ));
      toast.success('Cantidad actualizada');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error al actualizar la cantidad');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      setCartItems(cartItems.filter(item => item.id !== itemId));
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.producto.precio * item.cantidad), 0
  );

  const handleCheckout = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsOpen(false);
    router.push('/checkout');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </SheetTrigger>        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader className="space-y-2.5">
            <SheetTitle className="text-xl">Carrito de Compras</SheetTitle>
          </SheetHeader>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : !user ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Inicia sesión para ver tu carrito
              </h3>
              <p className="text-gray-500 mb-6">
                Accede a tu cuenta para ver los productos en tu carrito
              </p>
              <Button onClick={() => setShowAuthModal(true)}>
                Iniciar Sesión
              </Button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-6">
                Explora nuestros productos y agrega algunos a tu carrito
              </p>
              <Button onClick={() => {
                setIsOpen(false);
                router.push('/productos');
              }}>
                Ver productos
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-6">
                <AnimatePresence>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4 p-4 bg-white rounded-lg shadow-sm"
                      >
                        <div className="relative aspect-square w-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.producto.imagen_principal}
                            alt={item.producto.nombre}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.producto.nombre}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                            {item.producto.descripcion}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              ${item.producto.precio.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, Math.max(1, item.cantidad - 1))}
                                disabled={item.cantidad <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {item.cantidad}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, Math.min(item.producto.stock, item.cantidad + 1))}
                                disabled={item.cantidad >= item.producto.stock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Envío</span>
                    <span className="font-medium">Calculado al finalizar</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-base font-medium">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Continuar con el pago
                </Button>
              </div>
            </>
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