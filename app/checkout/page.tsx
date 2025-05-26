"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MapPin, CreditCard, Package, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { getCartItems, type CartItem } from '@/lib/services/cart';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    user, 
    userData,
    isLoading, 
    isAuthenticated 
  } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
        return;
      }
      loadCartItems();
    }
  }, [user, isLoading, router]);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast.error('Error al cargar el carrito');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.producto.precio * item.cantidad), 0
  );

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Agrega algunos productos a tu carrito antes de continuar
            </p>
            <Button onClick={() => router.push('/productos')}>
              Ver productos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección de envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => router.push('/profile/addresses')}
                >
                  Seleccionar dirección
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Método de pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => router.push('/profile/payment')}
                >
                  Seleccionar método de pago
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4"
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
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.producto.nombre}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Cantidad: {item.cantidad}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ${(item.producto.precio * item.cantidad).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Envío</span>
                      <span>Calculado al finalizar</span>
                    </div>
                    <div className="flex justify-between text-base font-medium">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6" size="lg">
                    Finalizar compra
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}