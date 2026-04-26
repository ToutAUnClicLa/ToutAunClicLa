import { getAuthToken } from './auth';

const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5500/api/v1' 
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backendtoutaunclicla-production.up.railway.app/api/v1');

// ============================================================================
// TIPOS E INTERFACES ACTUALIZADOS SEGÚN LA DOCUMENTACIÓN API
// ============================================================================

export interface OrderItem {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  subcategory?: string;
  images: string[];
  sku: string;
}

export interface OrderItemPreview {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface OrderPricing {
  subtotal: number;
  taxes: {
    tps: number;
    tvq: number;
    total: number;
  };
  shipping: number;
  discount: number;
  couponCode?: string;
  finalTotal: number;
}

export interface OrderShipping {
  recipientName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderSummary {
  totalItems: number;
  productCount: number;
}

export interface OrderPaymentInfo {
  method: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paymentDate: string;
  refundInfo?: {
    isRefunded: boolean;
    refundAmount: number;
    refundDate?: string;
  };
}

export interface OrderTracking {
  orderPlaced?: string;
  paymentConfirmed?: string;
  processing?: string;
  shipped?: string;
  delivered?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: 'pendiente' | 'pagado' | 'procesando' | 'enviado' | 'entregado' | 'cancelado' | 'reembolsado' | 'parcialmente_reembolsado';
  total: number;
  orderDate: string;
  pricing: OrderPricing;
  summary: OrderSummary;
  shipping: OrderShipping;
  itemsPreview: OrderItemPreview[];
  paymentInfo: OrderPaymentInfo;
  tracking?: OrderTracking;
  emails?: {
    confirmationSent: boolean;
    shippingSent: boolean;
  };
  notes?: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  ordersByStatus: Record<string, number>;
  recentOrdersCount: number;
  averageOrderValue: number;
  lastOrderDate?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage?: number;
    previousPage?: number;
  };
}

// ============================================================================
// FUNCIONES DEL SERVICIO ACTUALIZADAS
// ============================================================================

/**
 * Obtiene el historial de pedidos del usuario
 */
export const getUserOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<OrdersResponse> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status })
  });

  const response = await fetch(
    `${API_BASE_URL}/orders/my-orders?${queryParams}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching orders');
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch orders');
  }

  return data.data;
};

/**
 * Obtiene estadísticas resumidas de pedidos del usuario
 */
export const getUserOrderStats = async (): Promise<OrderStats> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(
    `${API_BASE_URL}/orders/stats/summary`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching order stats');
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch order stats');
  }

  return data.data;
};

/**
 * Obtiene los detalles completos de un pedido específico
 */
export const getOrderDetails = async (orderId: number): Promise<OrderDetail> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching order details');
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch order details');
  }

  return data.data.order;
};

/**
 * Obtiene el estado de una sesión de checkout de Stripe
 */
export const getCheckoutSessionStatus = async (sessionId: string) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(
    `${API_BASE_URL}/stripe/checkout/session-status/${sessionId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching checkout session status');
  }

  const data = await response.json();
  return data;
};

// ============================================================================
// UTILIDADES Y HELPERS
// ============================================================================

/**
 * Obtiene el texto localizado para el estado de un pedido
 */
export const getOrderStatusText = (status: Order['status'], language: string = 'es'): string => {
  const statusTexts: Record<string, Record<string, string>> = {
    es: {
      pendiente: 'Pendiente',
      pagado: 'Pagado',
      procesando: 'Procesando',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
      reembolsado: 'Reembolsado',
      parcialmente_reembolsado: 'Parcialmente Reembolsado'
    },
    en: {
      pendiente: 'Pending',
      pagado: 'Paid',
      procesando: 'Processing',
      enviado: 'Shipped',
      entregado: 'Delivered',
      cancelado: 'Cancelled',
      reembolsado: 'Refunded',
      parcialmente_reembolsado: 'Partially Refunded'
    },
    fr: {
      pendiente: 'En attente',
      pagado: 'Payé',
      procesando: 'En cours',
      enviado: 'Expédié',
      entregado: 'Livré',
      cancelado: 'Annulé',
      reembolsado: 'Remboursé',
      parcialmente_reembolsado: 'Partiellement Remboursé'
    }
  };

  return statusTexts[language]?.[status] || status;
};

/**
 * Obtiene el color CSS para el estado de un pedido
 */
export const getOrderStatusColor = (status: Order['status']): string => {
  const statusColors: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pagado: 'bg-green-100 text-green-800 border-green-200',
    procesando: 'bg-blue-100 text-blue-800 border-blue-200',
    enviado: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    entregado: 'bg-purple-100 text-purple-800 border-purple-200',
    cancelado: 'bg-red-100 text-red-800 border-red-200',
    reembolsado: 'bg-gray-100 text-gray-800 border-gray-200',
    parcialmente_reembolsado: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Formatea una fecha para mostrar
 */
export const formatOrderDate = (dateString: string, language: string = 'es'): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  const locales: Record<string, string> = {
    es: 'es-ES',
    en: 'en-US',
    fr: 'fr-FR'
  };

  return date.toLocaleDateString(locales[language] || 'es-ES', options);
};

/**
 * Calcula el progreso del tracking de un pedido
 */
export const getOrderProgress = (tracking: OrderTracking): number => {
  const stages = ['orderPlaced', 'paymentConfirmed', 'processing', 'shipped', 'delivered'];
  let completedStages = 0;

  stages.forEach(stage => {
    if (tracking[stage as keyof OrderTracking]) {
      completedStages++;
    }
  });

  return (completedStages / stages.length) * 100;
};

/**
 * Verifica si un pedido puede ser cancelado
 */
export const canCancelOrder = (order: Order): boolean => {
  return ['pendiente', 'pagado', 'procesando'].includes(order.status);
};

/**
 * Verifica si un pedido puede ser rastreado
 */
export const canTrackOrder = (order: Order): boolean => {
  return ['enviado', 'entregado'].includes(order.status);
};

// Mantener compatibilidad con funciones existentes
export const getMyOrders = getUserOrders;
