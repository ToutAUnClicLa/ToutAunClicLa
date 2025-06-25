/**
 * Servicio de autenticación que se conecta al backend
 * Base URL: https://backendtoutaunclicla-production.up.railway.app/api/v1/auth
 */

// Configuración para usar siempre el backend de producción
const AUTH_BASE_URL = 'https://backendtoutaunclicla-production.up.railway.app/api/v1/auth';

// Headers comunes para todas las requests
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'https://toutaunclicla.com',
    'Referer': 'https://toutaunclicla.com',
  };
};

export interface User {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  verified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  verificationRequired?: boolean;
  needsVerification?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Registrar un nuevo usuario
 */
export async function registerUser(userData: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al registrar usuario');
    }

    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    // Guardar email pendiente de verificación
    setPendingVerificationEmail(userData.email);

    return data;
  } catch (error: any) {
    console.error('Error en registerUser:', error);
    throw error;
  }
}

/**
 * Iniciar sesión
 */
export async function loginUser(loginData: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Manejar errores específicos
      if (response.status === 403 && data.needsVerification) {
        throw new Error('Tu cuenta requiere verificación. Revisa tu correo electrónico.');
      }
      if (response.status === 423) {
        throw new Error('Cuenta bloqueada por múltiples intentos fallidos. Contacta al soporte.');
      }
      throw new Error(data.message || data.error || 'Error al iniciar sesión');
    }

    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    return data;
  } catch (error: any) {
    console.error('Error en loginUser:', error);
    throw error;
  }
}

/**
 * Verificar email con código
 */
export async function verifyEmail(code: string, email: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/verify-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Código de verificación inválido');
    }

    // Actualizar token si se proporciona uno nuevo
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    // Limpiar email pendiente de verificación
    clearPendingVerificationEmail();

    return data;
  } catch (error: any) {
    console.error('Error en verifyEmail:', error);
    throw error;
  }
}

/**
 * Reenviar código de verificación
 */
export async function resendVerification(email: string): Promise<{ message: string; email: string }> {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/resend-verification`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al reenviar verificación');
    }

    return data;
  } catch (error: any) {
    console.error('Error en resendVerification:', error);
    throw error;
  }
}

/**
 * Verificar estado de verificación
 */
export async function checkVerificationStatus(email: string): Promise<{ verified: boolean; email: string }> {
  try {
    const { 'Content-Type': _, ...headers } = getHeaders();
    
    const response = await fetch(`${AUTH_BASE_URL}/verification-status?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al verificar estado');
    }

    return data;
  } catch (error: any) {
    console.error('Error en checkVerificationStatus:', error);
    throw error;
  }
}

/**
 * Obtener perfil del usuario autenticado
 */
export async function getUserProfile(): Promise<{ user: User }> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const headers = {
      ...getHeaders(),
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(`${AUTH_BASE_URL}/profile`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('auth_token');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(data.message || data.error || 'Error al obtener perfil');
    }

    return data;
  } catch (error: any) {
    console.error('Error en getUserProfile:', error);
    throw error;
  }
}

/**
 * Cerrar sesión
 */
export function logout(): void {
  localStorage.removeItem('auth_token');
}

/**
 * Verificar si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('auth_token');
  return !!token;
}

/**
 * Obtener token actual
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Verificar si un email ya está registrado
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Usamos el endpoint de verification-status para verificar si el email existe
    // Si el usuario no existe, el backend responderá con 404
    await checkVerificationStatus(email);
    return true; // Si no da error 404, el email existe
  } catch (error: any) {
    // Si es un error 404, significa que el usuario no existe
    if (error.message.includes('404') || error.message.includes('User not found')) {
      return false;
    }
    // Si es otro tipo de error, asumimos que el email existe pero hay otro problema
    console.warn('Error checking email existence:', error);
    return true;
  }
}

/**
 * Guardar email pendiente de verificación
 */
export function setPendingVerificationEmail(email: string): void {
  localStorage.setItem('pending_verification_email', email);
}

/**
 * Obtener email pendiente de verificación
 */
export function getPendingVerificationEmail(): string | null {
  return localStorage.getItem('pending_verification_email');
}

/**
 * Limpiar email pendiente de verificación
 */
export function clearPendingVerificationEmail(): void {
  localStorage.removeItem('pending_verification_email');
}
