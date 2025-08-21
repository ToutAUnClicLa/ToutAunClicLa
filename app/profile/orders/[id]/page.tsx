"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  ArrowLeft, 
  Download, 
  Truck, 
  MessageCircle, 
  Copy,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  RefreshCcw,
  AlertCircle,
  Eye,
  Phone,
  Mail,
  Receipt,
  Share2,
  Star,
  ChevronRight,
  Info,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';
import { Progress } from '@/components/common/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { useOrderDetail } from '@/hooks/useOrders';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  getOrderStatusText, 
  getOrderStatusColor, 
  formatOrderDate, 
  getOrderProgress,
  canTrackOrder,
  canCancelOrder
} from '@/lib/services/orders';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const getTrackingSteps = () => [
  { key: 'orderPlaced', icon: Receipt, label: 'Pedido Realizado' },
  { key: 'paymentConfirmed', icon: CreditCard, label: 'Pago Confirmado' },
  { key: 'processing', icon: RefreshCcw, label: 'Procesando' },
  { key: 'shipped', icon: Truck, label: 'Enviado' },
  { key: 'delivered', icon: CheckCircle, label: 'Entregado' }
];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Función auxiliar para asegurar que las traducciones sean strings
  const tSafe = (key: string, fallback: string = key) => {
    try {
      const result = t(key);
      return typeof result === 'string' ? result : fallback;
    } catch {
      return fallback;
    }
  };

  const orderId = params?.id ? parseInt(params.id as string) : null;
  const { order, loading, error, refetch } = useOrderDetail({ orderId });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleCopyOrderNumber = async () => {
    if (order?.orderNumber) {
      try {
        await navigator.clipboard.writeText(order.orderNumber);
        setCopied(true);
        toast.success(t('orderDetail.orderNumberCopied') || 'Copiado al portapapeles');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('Error al copiar');
      }
    }
  };

  const handleDownloadInvoice = () => {
    toast.info(t('orderDetail.help.invoiceComingSoon'));
  };

  const handleTrackShipment = () => {
    if (order && canTrackOrder(order)) {
      toast.info(t('orderDetail.help.trackingComingSoon'));
    }
  };

  const handleContactSupport = () => {
    toast.info(t('orderDetail.help.redirectingSupport'));
  };

  const getStatusIcon = (status: string) => {
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
    
    const IconComponent = iconMap[status as keyof typeof iconMap] || Package;
    return <IconComponent className="h-5 w-5" />;
  };

  const calculateProgress = () => {
    if (!order?.tracking) return 20;
    return getOrderProgress(order.tracking);
  };

  if (isLoading || loading) {
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
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar el pedido</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <Button onClick={() => router.back()} variant="outline" className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <Button onClick={refetch} className="flex-1">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('orderDetail.notFound')}</h2>
          <p className="text-gray-600 mb-6">{t('orderDetail.notFoundDesc')}</p>
          <Button onClick={() => router.push('/profile/orders')} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('orderDetail.backToOrders')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container max-w-6xl mx-auto py-2 sm:py-4 md:py-6 px-3 sm:px-4">
        
        {/* Header Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="overflow-hidden shadow-lg border-0">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-3 sm:p-4 md:p-6 text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
              <div className="absolute top-2 right-2 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                          {order.orderNumber}
                        </h1>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyOrderNumber}
                                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                              >
                                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copied ? 'Copiado!' : t('orderDetail.copyOrderNumber') || 'Copiar número'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-emerald-100 text-sm sm:text-base opacity-90">
                        {formatOrderDate(order.orderDate)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/profile/orders')}
                    className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <ArrowLeft className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{t('common.back') || 'Volver'}</span>
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <Badge 
                    className={`${getOrderStatusColor(order.status)} border-0 text-sm font-medium w-fit`}
                  >
                    {getOrderStatusText(order.status)}
                  </Badge>
                  <div className="text-white">
                    <span className="text-2xl sm:text-3xl font-bold">
                      ${order.pricing.finalTotal.toFixed(2)} CAD
                    </span>
                    <span className="text-emerald-100 text-sm ml-2">
                      {order.summary.totalItems} productos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tracking Progress */}
        {order.tracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">{t('orderDetail.status.title') || 'Estado del Envío'}</h2>
              </div>
              
              <div className="mb-4">
                <Progress value={calculateProgress()} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {getTrackingSteps().map((step, index) => {
                  const isCompleted = order.tracking && order.tracking[step.key as keyof typeof order.tracking];
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full mb-2 ${
                        isCompleted 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className={`text-xs font-medium ${
                        isCompleted ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </p>
                      {isCompleted && order.tracking && order.tracking[step.key as keyof typeof order.tracking] && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatOrderDate(order.tracking[step.key as keyof typeof order.tracking] as string)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={handleDownloadInvoice}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Download className="h-5 w-5" />
              <span className="text-sm">{t('orderDetail.actions.downloadInvoice')}</span>
            </Button>
            
            {canTrackOrder(order) && (
              <Button
                variant="outline"
                onClick={handleTrackShipment}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Truck className="h-5 w-5" />
                <span className="text-sm">{t('orderDetail.actions.trackShipment')}</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleContactSupport}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{t('orderDetail.actions.contactSupport')}</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => toast.info(t('orderDetail.help.comingSoon'))}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm">{t('orderDetail.actions.share')}</span>
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Order Items */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  {t('orderDetail.sections.products') || 'Productos Pedidos'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>SKU: {item.sku}</span>
                        <span>Cantidad: {item.quantity}</span>
                        <span className="font-semibold text-gray-900">
                          ${item.unitPrice.toFixed(2)} CAD c/u
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${item.totalPrice.toFixed(2)} CAD
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary & Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            {/* Pricing Breakdown */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-emerald-600" />
                  {t('orderDetail.sections.pricing') || 'Resumen de Precios'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orderDetail.pricing.subtotal')}</span>
                  <span className="font-medium">${order.pricing.subtotal.toFixed(2)} CAD</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('orderDetail.pricing.tps')}</span>
                    <span>${order.pricing.taxes.tps.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('orderDetail.pricing.tvq')}</span>
                    <span>${order.pricing.taxes.tvq.toFixed(2)} CAD</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orderDetail.pricing.totalTaxes')}</span>
                  <span className="font-medium">${order.pricing.taxes.total.toFixed(2)} CAD</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orderDetail.pricing.shipping')}</span>
                  <span className="font-medium">
                    {order.pricing.shipping === 0 ? t('orderDetail.pricing.freeShipping') : `$${order.pricing.shipping.toFixed(2)} CAD`}
                  </span>
                </div>
                
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('orderDetail.pricing.discount')} {order.pricing.couponCode && `(${order.pricing.couponCode})`}</span>
                    <span>-${order.pricing.discount.toFixed(2)} CAD</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('orderDetail.pricing.finalTotal')}</span>
                  <span>${order.pricing.finalTotal.toFixed(2)} CAD</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  {t('orderDetail.sections.shipping') || 'Información de Envío'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">{order.shipping.recipientName}</p>
                    <p className="text-sm text-gray-600">{order.shipping.address}</p>
                    <p className="text-sm text-gray-600">
                      {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{order.shipping.country}</p>
                  </div>
                  
                  {order.shipping.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{order.shipping.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  {t('orderDetail.sections.payment') || 'Información de Pago'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('orderDetail.payment.method')}</span>
                    <span className="font-medium capitalize">{order.paymentInfo.method}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('orderDetail.payment.paymentDate')}</span>
                    <span className="font-medium">
                      {formatOrderDate(order.paymentInfo.paymentDate)}
                    </span>
                  </div>
                  
                  {order.paymentInfo.refundInfo?.isRefunded && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 text-orange-800 mb-1">
                        <Info className="h-4 w-4" />
                        <span className="font-medium">{t('orderDetail.payment.refundProcessed')}</span>
                      </div>
                      <p className="text-sm text-orange-700">
{t('orderDetail.payment.refundAmount')}: ${order.paymentInfo.refundInfo.refundAmount.toFixed(2)} CAD
                      </p>
                      {order.paymentInfo.refundInfo.refundDate && (
                        <p className="text-sm text-orange-700">
{t('orderDetail.payment.refundDate')}: {formatOrderDate(order.paymentInfo.refundInfo.refundDate)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    {t('orderDetail.sections.notes') || 'Notas del Pedido'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {order.notes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {(canCancelOrder(order) || canTrackOrder(order)) && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
{t('orderDetail.sections.availableActions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {canCancelOrder(order) && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => toast.info(t('orderDetail.help.cancelComingSoon'))}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
{t('orderDetail.actions.cancelOrder')}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/products')}
                  >
                    <Package className="h-4 w-4 mr-2" />
{t('orderDetail.actions.buyAgain')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>

        {/* Related Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <h3 className="font-semibold text-gray-900 mb-4">{t('orderDetail.help.title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full justify-start" onClick={handleContactSupport}>
                <MessageCircle className="h-4 w-4 mr-2" />
{t('orderDetail.actions.liveChat')}
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.info(t('orderDetail.help.comingSoon'))}>
                <Mail className="h-4 w-4 mr-2" />
                {t('orderDetail.actions.sendEmail')}
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.info(t('orderDetail.help.comingSoon'))}>
                <Star className="h-4 w-4 mr-2" />
                {t('orderDetail.actions.rateOrder')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}