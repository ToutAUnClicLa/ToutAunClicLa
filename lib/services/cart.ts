/**
 * Servicio para gestión del carrito de compras
 * Conecta con el backend de carrito en Railway
 * Incluye deduplicación de requests y manejo avanzado de errores
 */

import { deduplicateRequest, retryWithBackoff } from '@/lib/utils/request-deduplication';

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
  ecoprecio?: boolean;
  provedor?: string;
  categoria_id: number;
  subcategoria_id?: number;
  hasVariations?: boolean;
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
  metodo_entrega?: 'puerta' | 'manos' | 'recepcion';
  notas_entrega?: string;
  productos: CartProduct;
  addedAt?: string;
  // Variations from backend - matches backend response structure
  variations?: Array<{
    cart_item_id: string;
    quantity: number;
    price_at_time: number;
    product_variations: {
      id: number;
      name: string;
      description: string;
      price_modifier: number;
    };
  }>;
  // Computed fields for convenience
  baseSubtotal?: number;
  variationModifier?: number;
  finalSubtotal?: number;
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
  originalShippingCost?: number;  // ✨ NEW - Original shipping cost before promotion
  shippingDiscount?: number;       // ✨ NEW - Shipping discount amount from promotion
  shippingThreshold?: number;
  totalBeforeDiscount?: number;
  total: number;
  discount?: number;
  savings?: number;
  freeShippingApplied?: boolean;
  promotionApplied?: boolean;      // ✨ NEW - Whether Maison de Poulet promotion is active
  // New fields for backend shipping calculation system
  shippingMessage?: string | null;
  needsAddress?: boolean;
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
  id?: number;
  code?: string;
  codigo?: string;
  discount?: number;
  tipo?: 'percentage' | 'fixed';
  valor?: number;
  type?: 'discount' | 'free_shipping';
  description?: string;
  descripcion?: string;
}

export interface DeliveryOptions {
  metodoEntrega: 'puerta' | 'manos' | 'recepcion';
  notasEntrega?: string | null;
  aplicarATodos?: boolean;
}

export interface DeliveryInfo {
  description: string;
}

export interface DeliveryUpdateResponse {
  message: string;
  updatedItems: number;
  deliveryOptions: DeliveryOptions;
  deliveryInfo?: DeliveryInfo;
  availableHours?: string[];
  suggestTomorrow?: boolean;
  error?: {
    code: string;
    message: string;
    availableHours?: string[];
    suggestTomorrow?: boolean;
  };
}

export interface CartWithCouponResponse extends CartResponse {
  coupon?: Coupon;
  appliedCoupon?: Coupon;
  subtotal?: number;
  discountAmount?: number;
  summary: CartSummary & {
    discount?: number;
    savings?: number;
    shippingMessage?: string | null;
    needsAddress?: boolean;
  };
}

// ✨ NEW - Stripe checkout response interface with promotion fields
export interface StripeCheckoutResponse {
  sessionId: string;
  url: string;
  orderSummary: {
    originalShippingCost: string;
    shippingCost: string;
    shippingDiscount: string;
    promotionApplied: boolean;
    savings: string;
    total: string;
  };
}

/**
 * Obtener carrito del usuario con paginación
 * Incluye deduplicación de requests y reintentos con backoff
 */
export async function getCart(page: number = 1, limit: number = 20): Promise<CartResponse> {
  const url = `${CART_BASE_URL}?page=${page}&limit=${limit}`;
  
  return deduplicateRequest('GET', url, async (abortSignal) => {
    return retryWithBackoff(
      async (signal) => {
        const response = await fetch(url, {
          method: 'GET',
          headers: getHeaders(),
          signal
        });

        const data = await response.json();

        // Log cart data for variations debugging
        if (data.cartItems && data.cartItems.length > 0) {
          console.log('🛒 Datos del carrito recibidos del backend:', {
            itemCount: data.cartItems.length,
            variations: data.cartItems
              .filter((item: any) => item.variations && item.variations.length > 0)
              .map((item: any) => ({
                productName: item.productos.nombre,
                variationCount: item.variations.length,
                variations: item.variations.map((v: any) => ({
                  name: v.product_variations?.name,
                  modifier: v.price_at_time || v.product_variations?.price_modifier,
                  quantity: v.quantity
                }))
              }))
          });
        }

        if (!response.ok) {
          // Enhanced error handling for different backend issues
          if (data.message?.includes('shippingThreshold is not defined') || data.error?.includes('shippingThreshold is not defined')) {
            console.warn('Backend shippingThreshold error, using fallback');
            throw new Error('FALLBACK_CART_NEEDED');
          }
          
          if (response.status >= 500) {
            throw new Error(`Server error: ${data.message || data.error || 'Internal server error'}`);
          }
          
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          
          throw new Error(data.message || data.error || 'Error al obtener carrito');
        }

        // Ensure shippingThreshold has a default value if not provided by backend
        if (data.summary && data.summary.shippingThreshold === undefined) {
          data.summary.shippingThreshold = 200; // Default shipping threshold
        }

        return data;
      },
      {
        maxAttempts: 3,
        baseDelayMs: 500,
        abortSignal,
        onRetry: (attempt, error) => {
          console.warn(`🔄 Retrying cart request (attempt ${attempt}):`, error.message);
        }
      }
    );
  }).catch((error: any) => {
    console.error('🚨 Final error in getCart after retries:', error);
    
    // Return fallback cart for specific errors
    if (error.message?.includes('FALLBACK_CART_NEEDED') || error.message?.includes('shippingThreshold')) {
      console.warn('Returning fallback cart due to backend field issues');
      return {
        cartItems: [],
        total: 0,
        itemCount: 0,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20,
          hasNextPage: false,
          hasPrevPage: false
        },
        summary: {
          totalItems: 0,
          totalQuantity: 0,
          subtotal: 0,
          total: 0,
          shippingThreshold: 200,
          shippingCost: 0,
          shippingMessage: 'Error calculando envío, usando valores por defecto',
          needsAddress: true,
          totalTPS: 0,
          totalTVQ: 0,
          totalConsigne: 0,
          totalTaxes: 0
        }
      };
    }
    
    throw error;
  });
}

/**
 * Obtener carrito con cupón aplicado
 * Este endpoint es GET con couponCode como query parameter
 * Incluye deduplicación de requests y reintentos con backoff
 */
export async function getCartWithCoupon(couponCode: string): Promise<CartWithCouponResponse> {
  const url = `${CART_BASE_URL}/with-coupon?couponCode=${encodeURIComponent(couponCode)}`;
  
  return deduplicateRequest('GET', url, async (abortSignal) => {
    return retryWithBackoff(
      async (signal) => {
        const response = await fetch(url, {
          method: 'GET',
          headers: getHeaders(),
          signal
        });

        const data = await response.json();

        if (!response.ok) {
          // Enhanced error handling for different backend issues
          if (data.message?.includes('shippingThreshold is not defined') || data.error?.includes('shippingThreshold is not defined')) {
            console.warn('Backend shippingThreshold error in getCartWithCoupon, using fallback');
            throw new Error('FALLBACK_COUPON_CART_NEEDED');
          }
          
          if (response.status === 400 && (data.message?.includes('Personal usage limit reached') || data.message?.includes('límite personal de uso') || data.message?.includes('userUsageCount'))) {
            throw new Error('Ya has usado este cupón el máximo número de veces permitido');
          }
          
          if (response.status >= 500) {
            throw new Error(`Server error: ${data.message || data.error || 'Internal server error'}`);
          }
          
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          
          throw new Error(data.message || data.error || 'Error al obtener carrito con cupón');
        }

        // Ensure shippingThreshold has a default value if not provided by backend
        if (data.summary && data.summary.shippingThreshold === undefined) {
          data.summary.shippingThreshold = 200; // Default shipping threshold
        }

        return data;
      },
      {
        maxAttempts: 3,
        baseDelayMs: 500,
        abortSignal,
        onRetry: (attempt, error) => {
          console.warn(`🔄 Retrying getCartWithCoupon request (attempt ${attempt}):`, error.message);
        }
      }
    );
  }).catch((error: any) => {
    console.error('🚨 Final error in getCartWithCoupon after retries:', error);
    
    // Return fallback cart for specific errors
    if (error.message?.includes('FALLBACK_COUPON_CART_NEEDED') || error.message?.includes('shippingThreshold')) {
      console.warn('Returning fallback cart with coupon due to backend field issues');
      return {
        cartItems: [],
        total: 0,
        itemCount: 0,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20,
          hasNextPage: false,
          hasPrevPage: false
        },
        summary: {
          totalItems: 0,
          totalQuantity: 0,
          subtotal: 0,
          total: 0,
          shippingThreshold: 200,
          shippingCost: 0,
          shippingMessage: 'Error calculando envío con cupón, usando valores por defecto',
          needsAddress: true,
          totalTPS: 0,
          totalTVQ: 0,
          totalConsigne: 0,
          totalTaxes: 0,
          discount: 0,
          savings: 0
        }
      };
    }
    
    throw error;
  });
}

/**
 * Agregar producto al carrito con opciones de entrega y variaciones
 * Incluye deduplicación de requests y reintentos con backoff
 */
export async function addToCart(
  productId: number,
  quantity: number = 1,
  deliveryOptions?: {
    metodoEntrega?: 'puerta' | 'manos' | 'recepcion';
    notasEntrega?: string;
  },
  variations?: Array<{
    variationId: number;
    quantity: number;
  }>
): Promise<{ cartItem: CartItem; deliveryInfo?: any }> {
  const payload: any = { productId, quantity };
  
  // Agregar opciones de entrega si se proporcionan
  if (deliveryOptions?.metodoEntrega) {
    payload.metodoEntrega = deliveryOptions.metodoEntrega;
  }
  if (deliveryOptions?.notasEntrega) {
    payload.notasEntrega = deliveryOptions.notasEntrega;
  }
  
  // Agregar variaciones si se proporcionan
  if (variations && variations.length > 0) {
    payload.variations = variations;
    console.log('🛒 Agregando variaciones al payload del carrito:', {
      variations,
      payload
    });
  }

  const url = `${CART_BASE_URL}/items`;
  
  return deduplicateRequest('POST', url, async (abortSignal) => {
    return retryWithBackoff(
      async (signal) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload),
          signal
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400 && data.error === 'Insufficient stock') {
            throw new Error(`Solo quedan ${data.availableStock} unidades disponibles`);
          }
          if (response.status === 404) {
            throw new Error('Producto no encontrado');
          }
          if (response.status >= 500) {
            throw new Error(`Server error: ${data.message || data.error || 'Internal server error'}`);
          }
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          throw new Error(data.message || data.error || 'Error al agregar al carrito');
        }

        // Log successful cart addition with variations
        if (variations && variations.length > 0) {
          console.log('✅ Producto agregado al carrito con variaciones exitosamente:', {
            cartItem: data.cartItem,
            variationsDetected: data.cartItem?.selectedVariations?.length || 0,
            baseSubtotal: data.cartItem?.baseSubtotal,
            variationModifier: data.cartItem?.variationModifier,
            finalSubtotal: data.cartItem?.finalSubtotal
          });
        }

        return {
          cartItem: data.cartItem,
          deliveryInfo: data.deliveryInfo
        };
      },
      {
        maxAttempts: 3,
        baseDelayMs: 500,
        abortSignal,
        onRetry: (attempt, error) => {
          console.warn(`🔄 Retrying addToCart request (attempt ${attempt}):`, error.message);
        }
      }
    );
  }, payload);
}

/**
 * Actualizar cantidad de un item en el carrito
 * Incluye deduplicación de requests y reintentos con backoff
 */
export async function updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
  const payload = { quantity };
  const url = `${CART_BASE_URL}/items/${itemId}`;
  
  return deduplicateRequest('PUT', url, async (abortSignal) => {
    return retryWithBackoff(
      async (signal) => {
        const response = await fetch(url, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(payload),
          signal
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
          if (response.status >= 500) {
            throw new Error(`Server error: ${data.message || data.error || 'Internal server error'}`);
          }
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          throw new Error(data.message || data.error || 'Error al actualizar item');
        }

        return data.cartItem;
      },
      {
        maxAttempts: 3,
        baseDelayMs: 500,
        abortSignal,
        onRetry: (attempt, error) => {
          console.warn(`🔄 Retrying updateCartItem request (attempt ${attempt}):`, error.message);
        }
      }
    );
  }, payload);
}

/**
 * Eliminar producto del carrito
 * Incluye deduplicación de requests y reintentos con backoff
 */
export async function removeFromCart(itemId: string): Promise<void> {
  const url = `${CART_BASE_URL}/items/${itemId}`;
  
  return deduplicateRequest('DELETE', url, async (abortSignal) => {
    return retryWithBackoff(
      async (signal) => {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: getHeaders(),
          signal
        });

        if (!response.ok) {
          const data = await response.json();
          if (response.status === 404) {
            throw new Error('Item no encontrado en el carrito');
          }
          if (response.status === 403) {
            throw new Error('No tienes permisos para eliminar este item');
          }
          if (response.status >= 500) {
            throw new Error(`Server error: ${data.message || data.error || 'Internal server error'}`);
          }
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          throw new Error(data.message || data.error || 'Error al eliminar item');
        }
      },
      {
        maxAttempts: 3,
        baseDelayMs: 500,
        abortSignal,
        onRetry: (attempt, error) => {
          console.warn(`🔄 Retrying removeFromCart request (attempt ${attempt}):`, error.message);
        }
      }
    );
  });
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
        if (data.message?.includes('Personal usage limit reached') || data.message?.includes('límite personal de uso') || data.message?.includes('userUsageCount')) {
          throw new Error('Ya has usado este cupón el máximo número de veces permitido');
        }
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
export async function updateDeliveryOptions(options: DeliveryOptions): Promise<DeliveryUpdateResponse> {
  try {
    console.log('📤 Enviando opciones de entrega al backend:', {
      url: `${CART_BASE_URL}/delivery-options`,
      method: 'PUT',
      payload: options
    });
    
    const response = await fetch(`${CART_BASE_URL}/delivery-options`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(options),
    });

    const data = await response.json();
    console.log('📥 Respuesta del backend para delivery options:', {
      status: response.status,
      ok: response.ok,
      data
    });

    if (!response.ok) {
      if (response.status === 400) {
        // El backend puede devolver horarios alternativos
        if (data.availableHours || data.suggestTomorrow) {
          return {
            message: data.message || 'Horario no disponible',
            updatedItems: 0,
            deliveryOptions: options,
            error: {
              code: 'INVALID_TIME',
              message: data.message || 'Horario no disponible',
              availableHours: data.availableHours,
              suggestTomorrow: data.suggestTomorrow
            }
          };
        }
        if (data.message?.includes('delivery time')) {
          throw new Error('La hora de entrega debe estar entre 11:00 AM y 8:00 PM');
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
      shippingThreshold: 200,
      shippingMessage: null,
      needsAddress: false
    };
  } catch (error: any) {
    console.error('Error en getCartSummary:', error);
    return {
      totalItems: 0,
      totalQuantity: 0,
      subtotal: 0,
      total: 0,
      shippingThreshold: 200,
      shippingMessage: null,
      needsAddress: false
    };
  }
}

/**
 * Remover cupón aplicado del carrito
 */
export async function removeCoupon(): Promise<boolean> {
  return deduplicateRequest('DELETE', `${CART_BASE_URL}/remove-coupon`, async (abortSignal) => {
    return retryWithBackoff(
      async (signal) => {
        try {
          console.log('📤 Removiendo cupón del backend:', {
            url: `${CART_BASE_URL}/remove-coupon`,
            method: 'DELETE'
          });

          const response = await fetch(`${CART_BASE_URL}/remove-coupon`, {
            method: 'DELETE',
            headers: getHeaders(),
            signal,
          });

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 404 || response.status === 400) {
              // No coupon applied or already removed - this is OK
              console.log('No hay cupón aplicado o ya fue removido');
              return true;
            }
            if (response.status === 401) {
              throw new Error('No autorizado para remover cupón');
            }
            throw new Error(data.message || data.error || 'Error al remover cupón');
          }

          console.log('✅ Cupón removido exitosamente del backend');
          return true;
        } catch (error: any) {
          console.error('🚨 Error in removeCoupon request:', error);
          throw error;
        }
      },
      {
        maxAttempts: 2,  // Less retries for delete operations
        baseDelayMs: 500,
        abortSignal,
        onRetry: (attempt, error) => {
          console.warn(`🔄 Retrying removeCoupon request (attempt ${attempt}):`, error.message);
        }
      }
    );
  });
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
  removeCoupon,
  updateDeliveryOptions,
  getCartCount,
  getCartSummary,
};
