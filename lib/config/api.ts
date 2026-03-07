/**
 * Configuración centralizada para la API del backend Express
 */

export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:5500/api/v1'
    : 'https://backendtoutaunclicla-production.up.railway.app/api/v1',
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh-token',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      CHECK_EMAIL: '/auth/check-email',
    },
    // Users endpoints
    USERS: {
      PROFILE: '/users/profile',
      PASSWORD: '/users/password',
    },
    // Products endpoints
    PRODUCTS: {
      LIST: '/products',
      DETAIL: '/products',
      SEARCH: '/products/search',
      CATEGORIES: '/products/categories',
      FEATURED: '/products/featured',
    },
    // Cart endpoints
    CART: {
      LIST: '/cart',
      ADD: '/cart',
      UPDATE: '/cart',
      REMOVE: '/cart',
      CLEAR: '/cart/clear',
      COUNT: '/cart/count',
    },
    // Favorites endpoints
    FAVORITES: {
      LIST: '/favorites',
      ADD: '/favorites',
      REMOVE: '/favorites',
      CHECK: '/favorites/check',
    },
    // Reviews endpoints
    REVIEWS: {
      LIST: '/reviews',
      CREATE: '/reviews',
      UPDATE: '/reviews',
      DELETE: '/reviews',
    },
    // Addresses endpoints
    ADDRESSES: {
      LIST: '/addresses',
      CREATE: '/addresses',
      UPDATE: '/addresses',
      DELETE: '/addresses',
    },
    // Orders endpoints
    ORDERS: {
      LIST: '/orders',
      CREATE: '/orders',
      DETAIL: '/orders',
      MY_ORDERS: '/orders/my-orders',
      CANCEL: '/orders',
      UPDATE_STATUS: '/orders',
    },
    // Stripe endpoints
    STRIPE: {
      PAYMENT_INTENT: '/stripe/payment-intent',
      CONFIRM_PAYMENT: '/stripe/confirm-payment',
      WEBHOOKS: '/stripe/webhooks',
    },
    // Restaurant Admin endpoints
    RESTAURANTS: {
      LOGIN: '/restaurants/login',
      SESSION: '/restaurants/session',
      PROFILE: '/restaurants/profile',
      PRODUCTS: '/restaurants/products',
      ORDERS: '/restaurants/orders',
      STATS: '/restaurants/stats',
    },
    // Super Admin endpoints (Requiere token user normal + ser admin)
    SUPER_ADMIN: {
      RESTAURANTS_LIST: '/super-admin/restaurants',
      RESTAURANT_PROFILE: '/super-admin/restaurants/:id/profile',
      RESTAURANTS_CREATE: '/super-admin/restaurants',
      CREDENTIALS_CREATE: '/super-admin/restaurants/credentials',
      CREDENTIALS_UPDATE: '/super-admin/restaurants/credentials',
      STATS: '/super-admin/stats',
    },
    // Subida de archivos (Restaurantes)
    UPLOAD: {
      IMAGE: '/upload/image',
    }
  },
} as const;

/**
 * Obtiene headers comunes para las requests a la API
 */
export function getApiHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Construye una URL completa para un endpoint
 */
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * Tipos de respuesta estándar de la API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
