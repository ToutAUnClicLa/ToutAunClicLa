const API_BASE_URL = 'https://backendtoutaunclicla-production.up.railway.app/api/v1';

export interface Order {
  id: string;
  usuario_id: string;
  direccion_envio_id: string;
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  fecha_pedido: string;
  stripe_payment_intent_id: string;
  detalles_pedido: OrderDetail[];
  direcciones_envio: {
    id: string;
    direccion: string;
    ciudad: string;
    codigo_postal: string;
    pais: string;
    nombre: string;
    telefono?: string;
  };
}

export interface OrderDetail {
  id: string;
  pedido_id: string;
  producto_id: number;
  quantity: number;
  price: number;
  productos: {
    nombre: string;
    precio: number;
    imagen_principal: string;
    descripcion?: string;
  };
}

export interface CreateOrderData {
  direccion_envio_id: string;
  detalles_pedido: {
    producto_id: number;
    quantity: number;
    price: number;
  }[];
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * Obtener mis órdenes
 */
export async function getMyOrders(
  page: number = 1, 
  limit: number = 10, 
  status?: string
): Promise<OrdersResponse> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${API_BASE_URL}/orders/my-orders?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener órdenes');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al obtener mis órdenes:', error);
    throw error;
  }
}

/**
 * Obtener detalles de una orden específica
 */
export async function getOrderDetails(orderId: string): Promise<Order> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener detalles de la orden');
    }

    const data = await response.json();
    return data.order;
  } catch (error: any) {
    console.error('Error al obtener detalles de orden:', error);
    throw error;
  }
}

/**
 * Crear una nueva orden
 */
export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear orden');
    }

    const data = await response.json();
    return data.order;
  } catch (error: any) {
    console.error('Error al crear orden:', error);
    throw error;
  }
}

/**
 * Actualizar estado de una orden (solo para admins)
 */
export async function updateOrderStatus(orderId: string, estado: Order['estado']): Promise<Order> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar estado de la orden');
    }

    const data = await response.json();
    return data.order;
  } catch (error: any) {
    console.error('Error al actualizar estado de orden:', error);
    throw error;
  }
}

/**
 * Cancelar una orden
 */
export async function cancelOrder(orderId: string): Promise<Order> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cancelar orden');
    }

    const data = await response.json();
    return data.order;
  } catch (error: any) {
    console.error('Error al cancelar orden:', error);
    throw error;
  }
}

/**
 * Obtener todas las órdenes (solo admins)
 */
export async function getAllOrders(
  page: number = 1, 
  limit: number = 10, 
  status?: string
): Promise<OrdersResponse> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${API_BASE_URL}/orders?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener todas las órdenes');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al obtener todas las órdenes:', error);
    throw error;
  }
}
