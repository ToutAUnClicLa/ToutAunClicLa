// Constantes de la aplicación
export const APP_CONFIG = {
  name: 'Tout À Un Clic La',
  version: '1.0.0',
  description: 'Plataforma de e-commerce moderna',
  author: 'ToutAunClic Team',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register-secure',
    logout: '/api/auth/logout',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verifyEmail: '/api/auth/verify-email',
    syncVerification: '/api/auth/sync-verification',
    resendVerification: '/api/auth/resend-verification',
  },
  user: {
    profile: '/api/user/profile',
    addresses: '/api/user/addresses',
    orders: '/api/user/orders',
    favorites: '/api/user/favorites',
  },
  admin: {
    users: '/api/admin/users',
    fixRls: '/api/admin/fix-rls-policies',
    security: '/api/admin/apply-security-improvements',
  },
} as const;

export const NAVIGATION_ROUTES = {
  home: '/',
  products: '/productos',
  boutique: '/boutique',
  food: '/comidas',
  checkout: '/checkout',
  profile: '/profile',
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
  },
} as const;

export const VALIDATION_RULES = {
  email: {
    required: 'El email es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email inválido',
    },
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 8,
      message: 'La contraseña debe tener al menos 8 caracteres',
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo',
    },
  },
  name: {
    required: 'El nombre es requerido',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres',
    },
    maxLength: {
      value: 50,
      message: 'El nombre no puede exceder 50 caracteres',
    },
  },
  phone: {
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Número de teléfono inválido',
    },
  },
} as const;

export const UI_CONSTANTS = {
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
  },
  animations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  zIndex: {
    modal: 1000,
    dropdown: 100,
    header: 50,
    overlay: 40,
  },
} as const;
