const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5500/api/v1' 
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backendtoutaunclicla-production.up.railway.app/api/v1');

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentConfirmation {
  status: string;
  paymentIntent: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
  };
}

export interface Order {
  id: string;
  usuario_id: string;
  direccion_envio_id: string;
  total: number;
  estado: string;
  fecha_pedido: string;
  stripe_payment_intent_id: string;
  detalles_pedido: OrderDetail[];
  direcciones_envio: {
    id: string;
    direccion: string;
    ciudad: string;
    codigo_postal: string;
    pais: string;
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
  };
}

/**
 * Crear Payment Intent para procesar pago
 */
export async function createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntentResponse> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/stripe/payment-intent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al crear payment intent:', error);
    throw error;
  }
}

/**
 * Confirmar pago con método de pago
 */
export async function confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentConfirmation> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/stripe/confirm-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId,
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to confirm payment');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al confirmar pago:', error);
    throw error;
  }
}

/**
 * Obtener historial de órdenes del usuario
 */
export async function getOrderHistory(page: number = 1, limit: number = 10, status?: string): Promise<{ orders: Order[]; pagination: any }> {
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
      throw new Error(errorData.message || 'Failed to get order history');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al obtener historial de órdenes:', error);
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
      throw new Error(errorData.message || 'Failed to get order details');
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
export async function createOrder(orderData: {
  direccion_envio_id: string;
  detalles_pedido: {
    producto_id: number;
    quantity: number;
    price: number;
  }[];
}): Promise<Order> {
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
      throw new Error(errorData.message || 'Failed to create order');
    }

    const data = await response.json();
    return data.order;
  } catch (error: any) {
    console.error('Error al crear orden:', error);
    throw error;
  }
}