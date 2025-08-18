/**
 * Servicio para gestión del carrito de compras
 * Conecta con el backend de carrito en Railway
 */

// Configuración dinámica de URL basada en el entorno
const getCartBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // En el cliente
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '/api/backend/cart';  // Proxy de Next.js
    }
  }
  // En producción o SSR
  return 'https://backendtoutaunclicla-production.up.railway.app/api/v1/cart';
};

const CART_BASE_URL = getCartBaseUrl();

// Headers comunes para todas las requests
const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    // Headers condicionales basados en el entorno
    ...(isLocalhost ? {} : {
      'Origin': 'https://toutaunclicla.com',
      'Referer': 'https://toutaunclicla.com',
    })
  };
};

// Interfaces basadas en la documentación del backend
export interface CartProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_principal: string;
  imagen_secundaria?: string;
  imagen_terciaria?: string;
  stock: number;
  TPS?: number;
  TVQ?: number;
  consigne?: number;
  provedor?: string;
  categoria_id: number;
  subcategoria_id?: number;
  categorias?: {
    id: number;
    nombre: string;
  };
  subcategorias?: {
    id: number;
    nombre: string;
    Imagen?: string;
    Descripcion?: string;
  };
}

export interface CartItem {
  id: string;
  usuario_id: string;
  producto_id: number;
  cantidad: number;
  productos: CartProduct;
  addedAt?: string;
}

export interface CartSummary {
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  subtotalWithTaxes?: number;
  subtotalWithConsigne?: number;
  totalTPS?: number;
  totalTVQ?: number;
  totalConsigne?: number;
  totalTaxes?: number;
  shippingCost?: number;
  shippingThreshold?: number;
  total: number;
}

export interface CartPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CartResponse {
  cartItems: CartItem[];
  total: number;
  itemCount: number;
  pagination: CartPagination;
  summary: CartSummary;
}

export interface Coupon {
  codigo: string;
  tipo: 'percentage' | 'fixed';
  valor: number;
  descripcion: string;
}

export interface DeliveryOptions {
  horaEntregaPreferida: string;  // "HH:MM" format (12:00-22:00)
  metodoEntrega: 'puerta' | 'manos' | 'recepcion';
  notasEntrega?: string | null;
  aplicarATodos?: boolean;
}

export interface CartWithCouponResponse extends CartResponse {
  coupon?: Coupon;
  summary: CartSummary & {
    discount?: number;
    savings?: number;
  };
}

/**
 * Obtener carrito del usuario con paginación
 */
export async function getCart(page: number = 1, limit: number = 20): Promise<CartResponse> {
  try {
    const response = await fetch(`${CART_BASE_URL}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al obtener carrito');
    }

    return data;
  } catch (error: any) {
    console.error('Error en getCart:', error);
    throw error;
  }
}

/**
 * Obtener carrito con cupón aplicado
 */
export async function getCartWithCoupon(couponCode?: string): Promise<CartWithCouponResponse> {
  try {
    const url = couponCode 
      ? `${CART_BASE_URL}/with-coupon?couponCode=${encodeURIComponent(couponCode)}`
      : `${CART_BASE_URL}/with-coupon`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al obtener carrito con cupón');
    }

    return data;
  } catch (error: any) {
    console.error('Error en getCartWithCoupon:', error);
    throw error;
  }
}

/**
 * Agregar producto al carrito
 */
export async function addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
  try {
    const response = await fetch(`${CART_BASE_URL}/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && data.error === 'Insufficient stock') {
        throw new Error(`Solo quedan ${data.availableStock} unidades disponibles`);
      }
      if (response.status === 404) {
        throw new Error('Producto no encontrado');
      }
      throw new Error(data.message || data.error || 'Error al agregar al carrito');
    }

    return data.cartItem;
  } catch (error: any) {
    console.error('Error en addToCart:', error);
    throw error;
  }
}

/**
 * Actualizar cantidad de un item en el carrito
 */
export async function updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
  try {
    const response = await fetch(`${CART_BASE_URL}/items/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && data.error === 'Insufficient stock') {
        throw new Error(`Solo quedan ${data.availableStock} unidades disponibles`);
      }
      if (response.status === 404) {
        throw new Error('Item no encontrado en el carrito');
      }
      if (response.status === 403) {
        throw new Error('No tienes permisos para modificar este item');
      }
      throw new Error(data.message || data.error || 'Error al actualizar item');
    }

    return data.cartItem;
  } catch (error: any) {
    console.error('Error en updateCartItem:', error);
    throw error;
  }
}

/**
 * Eliminar producto del carrito
 */
export async function removeFromCart(itemId: string): Promise<void> {
  try {
    const response = await fetch(`${CART_BASE_URL}/items/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      if (response.status === 404) {
        throw new Error('Item no encontrado en el carrito');
      }
      if (response.status === 403) {
        throw new Error('No tienes permisos para eliminar este item');
      }
      throw new Error(data.message || data.error || 'Error al eliminar item');
    }
  } catch (error: any) {
    console.error('Error en removeFromCart:', error);
    throw error;
  }
}

/**
 * Vaciar carrito completo
 */
export async function clearCart(): Promise<{ itemsRemoved: number }> {
  try {
    const response = await fetch(`${CART_BASE_URL}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al limpiar carrito');
    }

    return { itemsRemoved: data.itemsRemoved || 0 };
  } catch (error: any) {
    console.error('Error en clearCart:', error);
    throw error;
  }
}

/**
 * Aplicar cupón al carrito
 */
export async function applyCoupon(couponCode: string): Promise<{
  coupon: Coupon;
  summary: CartSummary & { discount: number; savings: number };
}> {
  try {
    const response = await fetch(`${CART_BASE_URL}/apply-coupon`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ couponCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Cupón no válido o expirado');
      }
      if (response.status === 400) {
        throw new Error(data.message || 'El cupón no se puede aplicar');
      }
      if (response.status === 429) {
        throw new Error('Has alcanzado el límite de intentos. Intenta más tarde.');
      }
      throw new Error(data.message || data.error || 'Error al aplicar cupón');
    }

    return {
      coupon: data.coupon,
      summary: data.summary || {
        ...data.discount,
        total: data.newTotal
      },
    };
  } catch (error: any) {
    console.error('Error en applyCoupon:', error);
    throw error;
  }
}

/**
 * Actualizar opciones de entrega para el carrito
 */
export async function updateDeliveryOptions(options: DeliveryOptions): Promise<{
  message: string;
  updatedItems: number;
  deliveryOptions: DeliveryOptions;
}> {
  try {
    const response = await fetch(`${CART_BASE_URL}/delivery-options`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        if (data.message?.includes('delivery time')) {
          throw new Error('La hora de entrega debe estar entre 12:00 PM y 10:00 PM');
        }
        if (data.message?.includes('delivery method')) {
          throw new Error('Método de entrega inválido');
        }
      }
      throw new Error(data.message || data.error || 'Error al actualizar opciones de entrega');
    }

    return data;
  } catch (error: any) {
    console.error('Error en updateDeliveryOptions:', error);
    throw error;
  }
}

/**
 * Obtener conteo total de items en el carrito
 */
export async function getCartCount(): Promise<number> {
  try {
    const cart = await getCart(1, 1);
    return cart.summary?.totalQuantity || 0;
  } catch (error: any) {
    console.error('Error en getCartCount:', error);
    return 0;
  }
}

/**
 * Obtener resumen del carrito (totales sin items)
 */
export async function getCartSummary(): Promise<CartSummary> {
  try {
    const cart = await getCart(1, 1);
    return cart.summary || {
      totalItems: 0,
      totalQuantity: 0,
      subtotal: 0,
      total: 0,
    };
  } catch (error: any) {
    console.error('Error en getCartSummary:', error);
    return {
      totalItems: 0,
      totalQuantity: 0,
      subtotal: 0,
      total: 0,
    };
  }
}

// Servicio unificado para manejo del carrito
export const cartService = {
  getCart,
  getCartWithCoupon,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  updateDeliveryOptions,
  getCartCount,
  getCartSummary,
};
