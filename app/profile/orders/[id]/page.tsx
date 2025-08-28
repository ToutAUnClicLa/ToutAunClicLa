"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Package, 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCcw,
  Download,
  Star,
  MessageCircle,
  Share2
} from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useOrderDetail } from '@/hooks/useOrders';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  OrderDetail,
  getOrderStatusText, 
  getOrderStatusColor, 
  formatOrderDate, 
  canTrackOrder,
  canCancelOrder,
  getOrderProgress
} from '@/lib/services/orders';
import { toast } from 'sonner';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  const orderId = parseInt(params.id, 10);
  
  const { 
    order, 
    loading, 
    error, 
    refetch 
  } = useOrderDetail({ orderId: isNaN(orderId) ? null : orderId });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (isNaN(orderId)) {
      toast.error('ID de pedido inválido');
      router.push('/profile/orders');
    }
  }, [orderId, router]);

  const getStatusIcon = (status: OrderDetail['status']) => {
    const iconMap = {
      pendiente: Clock,
      pagado: CheckCircle,
      procesando: RefreshCcw,
      enviado: Truck,
      entregado: Package,
      cancelado: AlertCircle,
      reembolsado: RefreshCcw,
      parcialmente_reembolsado: AlertCircle
    };
    
    const IconComponent = iconMap[status] || Package;
    return <IconComponent className="h-5 w-5" />;
  };

  const handleDownloadInvoice = () => {
    toast.info('Función de descarga próximamente');
  };

  const handleCancelOrder = () => {
    toast.info('Función de cancelación próximamente');
  };

  const handleTrackOrder = () => {
    toast.info('Función de rastreo próximamente');
  };

  const handleContactSupport = () => {
    router.push('/support');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center">
        <Card className="max-w-md mx-4 p-6 text-center border-red-200 bg-red-50">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error al cargar pedido</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={refetch} variant="outline">
              Reintentar
            </Button>
            <Button onClick={() => router.push('/profile/orders')}>
              Volver a Pedidos
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center">
        <Card className="max-w-md mx-4 p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedido no encontrado</h2>
          <p className="text-gray-600 mb-4">El pedido solicitado no existe o no tienes acceso a él.</p>
          <Button onClick={() => router.push('/profile/orders')}>
            Volver a Pedidos
          </Button>
        </Card>
      </div>
    );
  }

  const progress = order.tracking ? getOrderProgress(order.tracking) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container max-w-4xl mx-auto py-2 sm:py-4 md:py-6 px-3 sm:px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="overflow-hidden shadow-lg border-0">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-3 sm:p-4 md:p-6 text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${getOrderStatusColor(order.status)} border font-medium`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{getOrderStatusText(order.status)}</span>
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Pedido {order.orderNumber}
                  </h1>
                  <p className="text-emerald-100 opacity-90">
                    Realizado el {formatOrderDate(order.orderDate)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Productos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Productos ({order.summary.productCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                          {item.images && item.images[0] ? (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <span>Cantidad: {item.quantity}</span>
                              <span className="ml-4">Precio: ${item.unitPrice.toFixed(2)} CAD</span>
                            </div>
                            <div className="font-semibold text-gray-900">
                              ${item.totalPrice.toFixed(2)} CAD
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información de Envío */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Dirección de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-1">
                      {order.shipping.recipientName}
                    </p>
                    <p className="text-gray-700">{order.shipping.address}</p>
                    <p className="text-gray-700">
                      {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
                    </p>
                    <p className="text-gray-700">{order.shipping.country}</p>
                    {order.shipping.phone && (
                      <p className="text-gray-600 mt-2">Tel: {order.shipping.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tracking Progress */}
            {order.tracking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Estado del Envío
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Progreso</span>
                        <span className="text-sm font-medium text-gray-900">{progress.toFixed(0)}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { key: 'orderPlaced', label: 'Pedido Realizado', icon: CheckCircle },
                          { key: 'paymentConfirmed', label: 'Pago Confirmado', icon: CreditCard },
                          { key: 'processing', label: 'Procesando', icon: RefreshCcw },
                          { key: 'shipped', label: 'Enviado', icon: Truck },
                          { key: 'delivered', label: 'Entregado', icon: Package }
                        ].map((stage) => {
                          const isCompleted = !!order.tracking?.[stage.key as keyof typeof order.tracking];
                          const Icon = stage.icon;
                          
                          return (
                            <div key={stage.key} className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                              }`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className={`${
                                isCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'
                              }`}>
                                {stage.label}
                              </span>
                              {isCompleted && order.tracking?.[stage.key as keyof typeof order.tracking] && (
                                <span className="text-sm text-gray-500 ml-auto">
                                  {formatOrderDate(order.tracking[stage.key as keyof typeof order.tracking] as string)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Resumen de Precios */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${order.pricing.subtotal.toFixed(2)} CAD</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">TPS</span>
                      <span>${order.pricing.taxes.tps.toFixed(2)} CAD</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVQ</span>
                      <span>${order.pricing.taxes.tvq.toFixed(2)} CAD</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío</span>
                      <span>${order.pricing.shipping.toFixed(2)} CAD</span>
                    </div>
                    
                    {order.pricing.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento{order.pricing.couponCode && ` (${order.pricing.couponCode})`}</span>
                        <span>-${order.pricing.discount.toFixed(2)} CAD</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${order.pricing.finalTotal.toFixed(2)} CAD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información de Pago */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Información de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Método de pago</span>
                      <p className="font-medium">{order.paymentInfo.method}</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 text-sm">Fecha de pago</span>
                      <p className="font-medium">{formatOrderDate(order.paymentInfo.paymentDate)}</p>
                    </div>
                    
                    {order.paymentInfo.refundInfo && order.paymentInfo.refundInfo.isRefunded && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-red-800 font-medium">Reembolsado</p>
                        <p className="text-red-600 text-sm">
                          ${order.paymentInfo.refundInfo.refundAmount.toFixed(2)} CAD
                        </p>
                        {order.paymentInfo.refundInfo.refundDate && (
                          <p className="text-red-600 text-sm">
                            {formatOrderDate(order.paymentInfo.refundInfo.refundDate)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Acciones */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleDownloadInvoice} 
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Factura
                    </Button>
                    
                    {canTrackOrder(order) && (
                      <Button 
                        onClick={handleTrackOrder} 
                        className="w-full"
                        variant="outline"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Rastrear Envío
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleContactSupport} 
                      className="w-full"
                      variant="outline"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contactar Soporte
                    </Button>
                    
                    {canCancelOrder(order) && (
                      <Button 
                        onClick={handleCancelOrder} 
                        className="w-full"
                        variant="destructive"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Cancelar Pedido
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Notas del Pedido */}
            {order.notes && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Notas del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm">{order.notes}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}