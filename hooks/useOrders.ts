import { useState, useEffect, useCallback } from 'react';
import { 
  getUserOrders, 
  getUserOrderStats, 
  getOrderDetails,
  Order, 
  OrderDetail, 
  OrdersResponse, 
  OrderStats 
} from '@/lib/services/orders';

interface UseOrdersProps {
  page?: number;
  limit?: number;
  status?: string;
}

interface UseOrdersReturn {
  orders: Order[];
  pagination: OrdersResponse['pagination'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
}

/**
 * Hook para gestionar órdenes del usuario
 */
export const useOrders = ({ 
  page = 1, 
  limit = 10, 
  status 
}: UseOrdersProps = {}): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OrdersResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchOrders = useCallback(async (pageNum: number = currentPage, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUserOrders(pageNum, limit, status);
      
      // Validar estructura de respuesta
      if (!response || !Array.isArray(response.orders)) {
        throw new Error('Respuesta de API inválida');
      }
      
      if (append) {
        setOrders(prev => {
          // Evitar duplicados al agregar más elementos
          const existingIds = new Set(prev.map(order => order.id));
          const newOrders = response.orders.filter(order => !existingIds.has(order.id));
          return [...prev, ...newOrders];
        });
      } else {
        setOrders(response.orders);
      }
      
      setPagination(response.pagination);
      setCurrentPage(pageNum);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      const errorMessage = err?.message || 'Error al cargar pedidos';
      setError(errorMessage);
      
      // En caso de error, mantener datos existentes si es append
      if (!append) {
        setOrders([]);
        setPagination(null);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, status]);

  const refetch = useCallback(async () => {
    setCurrentPage(1);
    await fetchOrders(1, false);
  }, [fetchOrders]);

  const fetchMore = useCallback(async () => {
    if (pagination?.hasNextPage && !loading) {
      await fetchOrders(currentPage + 1, true);
    }
  }, [fetchOrders, pagination?.hasNextPage, currentPage, loading]);

  useEffect(() => {
    // Reset page to 1 when filters change
    if (page !== 1 && (currentPage !== page)) {
      setCurrentPage(1);
      fetchOrders(1, false);
    } else {
      fetchOrders(page, false);
    }
  }, [page, limit, status, fetchOrders]);

  return {
    orders,
    pagination,
    loading,
    error,
    refetch,
    fetchMore,
    hasMore: pagination?.hasNextPage || false
  };
};

interface UseOrderStatsReturn {
  stats: OrderStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener estadísticas de órdenes del usuario
 */
export const useOrderStats = (): UseOrderStatsReturn => {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUserOrderStats();
      
      // Validar estructura de respuesta
      if (!response || typeof response !== 'object') {
        throw new Error('Respuesta de API inválida');
      }
      
      // Validar campos obligatorios y proporcionar valores por defecto
      const validatedStats: OrderStats = {
        totalOrders: response.totalOrders || 0,
        totalSpent: response.totalSpent || 0,
        ordersByStatus: response.ordersByStatus || {},
        recentOrdersCount: response.recentOrdersCount || 0,
        averageOrderValue: response.averageOrderValue || 0,
        lastOrderDate: response.lastOrderDate || undefined
      };
      
      setStats(validatedStats);
    } catch (err: any) {
      console.error('Error fetching order stats:', err);
      const errorMessage = err?.message || 'Error al cargar estadísticas';
      setError(errorMessage);
      
      // Proporcionar estadísticas por defecto en caso de error
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        ordersByStatus: {},
        recentOrdersCount: 0,
        averageOrderValue: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch
  };
};

interface UseOrderDetailProps {
  orderId: number | null;
}

interface UseOrderDetailReturn {
  order: OrderDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener el detalle de una orden específica
 */
export const useOrderDetail = ({ orderId }: UseOrderDetailProps): UseOrderDetailReturn => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId || orderId <= 0) {
      setLoading(false);
      setError('ID de pedido inválido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setOrder(null);

      const response = await getOrderDetails(orderId);
      
      // Validar estructura de respuesta
      if (!response || typeof response !== 'object') {
        throw new Error('Respuesta de API inválida');
      }
      
      // Validar campos obligatorios
      if (!response.id || !response.orderNumber || !response.status) {
        throw new Error('Datos de pedido incompletos');
      }
      
      setOrder(response);
    } catch (err: any) {
      console.error('Error fetching order detail:', err);
      const errorMessage = err?.message || 'Error al cargar detalle del pedido';
      setError(errorMessage);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const refetch = useCallback(async () => {
    await fetchOrderDetail();
  }, [fetchOrderDetail]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  return {
    order,
    loading,
    error,
    refetch
  };
};

/**
 * Hook combinado para el dashboard de órdenes
 * Incluye tanto las órdenes como las estadísticas
 */
export const useOrdersDashboard = () => {
  const { 
    orders, 
    pagination, 
    loading: ordersLoading, 
    error: ordersError, 
    refetch: refetchOrders 
  } = useOrders({ limit: 5 });

  const { 
    stats, 
    loading: statsLoading, 
    error: statsError, 
    refetch: refetchStats 
  } = useOrderStats();

  const loading = ordersLoading || statsLoading;
  const error = ordersError || statsError;

  const refetch = useCallback(async () => {
    await Promise.all([refetchOrders(), refetchStats()]);
  }, [refetchOrders, refetchStats]);

  return {
    orders,
    pagination,
    stats,
    loading,
    error,
    refetch
  };
};