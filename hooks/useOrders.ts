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
      
      if (append) {
        setOrders(prev => [...prev, ...response.orders]);
      } else {
        setOrders(response.orders);
      }
      
      setPagination(response.pagination);
      setCurrentPage(pageNum);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, status]);

  const refetch = useCallback(async () => {
    await fetchOrders(1, false);
  }, [fetchOrders]);

  const fetchMore = useCallback(async () => {
    if (pagination?.hasNextPage) {
      await fetchOrders(currentPage + 1, true);
    }
  }, [fetchOrders, pagination?.hasNextPage, currentPage]);

  useEffect(() => {
    fetchOrders(page, false);
  }, [page, limit, status]); // Solo re-fetch cuando cambien los parámetros de consulta

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
      setStats(response);
    } catch (err: any) {
      console.error('Error fetching order stats:', err);
      setError(err.message || 'Error al cargar estadísticas');
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
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getOrderDetails(orderId);
      setOrder(response);
    } catch (err: any) {
      console.error('Error fetching order detail:', err);
      setError(err.message || 'Error al cargar detalle del pedido');
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