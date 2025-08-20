'use client'

import { useRouter } from 'next/navigation'
import { XCircleIcon, ShoppingCartIcon, CreditCardIcon } from 'lucide-react'
import { Button } from '@/components/common/ui/button'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function CancelPage() {
  const router = useRouter()

  useEffect(() => {
    // Notificar al usuario que el pago fue cancelado
    toast.info('Pago cancelado - Tu carrito sigue guardado')
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <XCircleIcon className="mx-auto h-20 w-20 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold text-red-600 mb-2">Pago Cancelado</h1>
          <p className="text-xl text-gray-600">No te preocupes, no se ha realizado ningún cargo</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📝 ¿Qué pasó?
          </h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>Cancelaste el proceso de pago en Stripe Checkout</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>Tu carrito sigue guardado con todos tus productos</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>Puedes intentar el pago nuevamente cuando gustes</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>No se ha realizado ningún cargo a tu tarjeta</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🚀 ¿Qué puedes hacer ahora?
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <ShoppingCartIcon className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <h4 className="font-semibold mb-1">Revisar tu Carrito</h4>
              <p className="text-sm text-gray-600">Verifica los productos antes de continuar</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CreditCardIcon className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <h4 className="font-semibold mb-1">Intentar de Nuevo</h4>
              <p className="text-sm text-gray-600">El proceso de pago es seguro y rápido</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="mx-auto h-8 w-8 text-purple-500 mb-2 text-2xl">🛒</div>
              <h4 className="font-semibold mb-1">Seguir Comprando</h4>
              <p className="text-sm text-gray-600">Explora más productos</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Button 
            onClick={() => router.push('/cart')}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Volver a Mi Carrito
          </Button>
          <Button 
            onClick={() => router.push('/checkout')}
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center gap-2"
          >
            <CreditCardIcon className="h-4 w-4" />
            Intentar Pago Nuevamente
          </Button>
          <Button 
            onClick={() => router.push('/products')}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            🛒 Continuar Comprando
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-lg">⚠️</span>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">¿Tuviste problemas con el pago?</h4>
              <p className="text-sm text-yellow-700 mb-3">
                Si experimentaste algún problema técnico durante el proceso de pago, nuestro equipo de soporte está aquí para ayudarte.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/support')}
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
              >
                Contactar Soporte Técnico
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}