"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  ArrowLeft, 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Eye, 
  Filter,
  RefreshCcw,
  ChevronRight,
  CheckCircle,
  Truck,
  AlertCircle,
  Clock,
  Search
} from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Input } from '@/components/common/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';
import { Separator } from '@/components/common/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useOrders, useOrderStats } from '@/hooks/useOrders';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Order, 
  getOrderStatusText, 
  getOrderStatusColor, 
  formatOrderDate, 
  canTrackOrder 
} from '@/lib/services/orders';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  const { 
    orders, 
    pagination, 
    loading: ordersLoading, 
    error, 
    refetch, 
    fetchMore, 
    hasMore 
  } = useOrders({ 
    page, 
    limit: 10, 
    status: statusFilter || undefined 
  });

  const { stats, loading: statsLoading } = useOrderStats();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Filtrar órdenes por búsqueda
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    
    return orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemsPreview.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [orders, searchTerm]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === 'all' ? '' : value);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (hasMore && !ordersLoading) {
      fetchMore();
    }
  };

  const getStatusIcon = (status: Order['status']) => {
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
    return <IconComponent className="h-4 w-4" />;
  };

  if (isLoading || (ordersLoading && page === 1)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        {t('profile.sections.orders.title')}
                      </h1>
                      <p className="text-emerald-100 text-sm sm:text-base opacity-90">
                        {t('profile.sections.orders.description')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <ArrowLeft className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{t('common.back')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Estadísticas */}
        {stats && !statsLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <ShoppingBag className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
                <div className="text-sm text-gray-600">Total de Pedidos</div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número de pedido o producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                  <SelectItem value="procesando">Procesando</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="entregado">Entregado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={refetch}
                disabled={ordersLoading}
                className="sm:w-auto"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Lista de pedidos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {error && (
            <Card className="p-6 text-center border-red-200 bg-red-50">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={refetch} variant="outline">
                Reintentar
              </Button>
            </Card>
          )}

          {!error && filteredOrders.length === 0 && !ordersLoading && (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron pedidos' : 'No hay pedidos aún'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Intenta cambiar los términos de búsqueda'
                  : 'Cuando realices tu primera compra, aparecerá aquí'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push('/products')}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Explorar Productos
                </Button>
              )}
            </Card>
          )}

          <AnimatePresence>
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="p-4 sm:p-6">
                      {/* Header del pedido */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatOrderDate(order.orderDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge 
                            className={`${getOrderStatusColor(order.status)} border font-medium`}
                          >
                            {getOrderStatusText(order.status)}
                          </Badge>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ${order.total.toFixed(2)} CAD
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.summary.totalItems} productos
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Preview de productos */}
                      <div className="space-y-3 mb-4">
                        {order.itemsPreview.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Cantidad: {item.quantity} • ${item.unitPrice.toFixed(2)} CAD
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {order.itemsPreview.length > 3 && (
                          <p className="text-sm text-gray-600 pl-15">
                            +{order.itemsPreview.length - 3} productos más
                          </p>
                        )}
                      </div>

                      {/* Información de envío */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {order.shipping.recipientName}
                            </p>
                            <p className="text-gray-600">
                              {order.shipping.address}, {order.shipping.city}
                            </p>
                            <p className="text-gray-600">
                              {order.shipping.state} {order.shipping.postalCode}, {order.shipping.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => router.push(`/profile/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                        
                        {canTrackOrder(order) && (
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => toast.info('Función de rastreo próximamente')}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Rastrear Envío
                          </Button>
                        )}
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cargar más */}
          {hasMore && !error && (
            <div className="text-center py-6">
              <Button 
                onClick={handleLoadMore}
                disabled={ordersLoading}
                variant="outline"
                size="lg"
              >
                {ordersLoading ? (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    Cargar más pedidos
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Enlaces rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <h3 className="font-semibold text-gray-900 mb-4">Enlaces rápidos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/products">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Seguir Comprando
                </Button>
              </Link>
              <Link href="/profile/addresses">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Mis Direcciones
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Soporte
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}