'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckIcon, AlertCircleIcon, LoaderIcon } from 'lucide-react'
import { Button } from '@/components/common/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import { toast } from 'sonner'
import * as authService from '@/lib/services/auth'

interface OrderData {
  id: number
  estado: string
  total: number
  fecha_pedido: string
}

interface CheckoutSessionData {
  sessionId: string
  status: string
  payment_status: string
  amount_total: number
  currency: string
  customer_email: string
  order: OrderData | null
}

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { clearCart } = useCart()
  
  const [orderData, setOrderData] = useState<CheckoutSessionData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [authChecked, setAuthChecked] = useState<boolean>(false)
  
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setError('No se encontró ID de sesión')
      setLoading(false)
      return
    }

    // Esperar a que la autenticación se resuelva
    const checkAuth = async () => {
      // Dar tiempo a que las cookies se carguen
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const token = authService.getAuthToken()
      if (!token && !isAuthenticated) {
        router.push('/login')
        return
      }
      
      setAuthChecked(true)
      fetchOrderStatus()
    }

    if (!authChecked) {
      checkAuth()
    }
  }, [sessionId, isAuthenticated, router, authChecked])

  const fetchOrderStatus = async () => {
    try {
      setLoading(true)
      
      console.log('🔍 Verificando estado del pedido:', sessionId)
      
      const token = authService.getAuthToken()
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/checkout/session-status/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error verificando el estado del pedido')
      }

      console.log('✅ Estado del pedido obtenido:', data)
      setOrderData(data)
      
      // Limpiar carrito local si el pago fue exitoso
      if (data.payment_status === 'paid') {
        await clearCart()
        console.log('🛒 Carrito limpiado tras pago exitoso')
      }
      
    } catch (err: any) {
      console.error('❌ Error obteniendo estado del pedido:', err)
      setError(err.message || 'Error verificando el estado del pedido')
      toast.error(err.message || 'Error verificando el pedido')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <LoaderIcon className="mx-auto h-16 w-16 text-blue-500 animate-spin mb-6" />
          <h2 className="text-2xl font-bold mb-4">Verificando tu pedido...</h2>
          <p className="text-gray-600">Por favor espera mientras confirmamos tu pago</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !orderData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <AlertCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-6" />
          <h2 className="text-2xl font-bold mb-4">Error Verificando el Pedido</h2>
          <p className="text-gray-600 mb-6">{error || 'No se pudo verificar el estado de tu pedido'}</p>
          <div className="space-y-3">
            <Button onClick={() => router.push('/orders')} className="w-full">
              Ver Mis Pedidos
            </Button>
            <Button variant="outline" onClick={() => router.push('/support')} className="w-full">
              Contactar Soporte
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  const { order } = orderData
  const paymentSuccessful = orderData.payment_status === 'paid'
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckIcon className="mx-auto h-20 w-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">¡Pago Exitoso!</h1>
          <h2 className="text-xl text-gray-700">Tu pedido ha sido confirmado</h2>
        </div>

        {order && (
          <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Pedido #{order.id}</h3>
              <p className="text-gray-600">
                Confirmado el {new Date(order.fecha_pedido).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Total Pagado:</span>
                  <strong className="text-lg">${order.total.toFixed(2)} CAD</strong>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Estado del Pedido:</span>
                  <span className={`font-semibold ${
                    order.estado === 'pagado' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {order.estado === 'pagado' ? 'Pagado' : order.estado}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Email de Confirmación:</span>
                  <span className="text-sm">{orderData.customer_email || user?.email}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">ID de Sesión:</span>
                  <span className="text-xs font-mono">{orderData.sessionId}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Estado del Pago:</span>
                  <span className="text-green-600 font-semibold">
                    {orderData.payment_status === 'paid' ? 'Pagado' : orderData.payment_status}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Moneda:</span>
                  <span className="uppercase">{orderData.currency}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📋 ¿Qué sigue ahora?
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📧</div>
              <h4 className="font-semibold mb-1">Confirmación por Email</h4>
              <p className="text-sm text-gray-600">Recibirás un email con los detalles de tu pedido</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📦</div>
              <h4 className="font-semibold mb-1">Preparación del Envío</h4>
              <p className="text-sm text-gray-600">Procesaremos tu pedido en 1-2 días hábiles</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🚚</div>
              <h4 className="font-semibold mb-1">Envío y Entrega</h4>
              <p className="text-sm text-gray-600">Te notificaremos cuando sea enviado</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Button 
            onClick={() => router.push(`/orders/${order?.id}`)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Ver Detalles del Pedido
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/orders')}
            className="w-full"
          >
            Ver Todos Mis Pedidos
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/products')}
            className="w-full"
          >
            Continuar Comprando
          </Button>
        </div>

        <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">¿Tienes preguntas sobre tu pedido?</p>
          <Button variant="link" onClick={() => router.push('/support')}>
            Contactar Soporte
          </Button>
        </div>
      </div>
    </div>
  )
}