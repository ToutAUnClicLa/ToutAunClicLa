/**
 * Servicio de autenticación que se conecta al backend
 * Base URL: https://backendtoutaunclicla-production.up.railway.app/api/v1/auth
 * 
 * Este servicio está preparado para funcionar tanto con localStorage como con cookies HttpOnly
 */

// Configuración para usar siempre el backend de producción
const AUTH_BASE_URL = 'https://backendtoutaunclicla-production.up.railway.app/api/v1/auth';

// Configuración de autenticación
const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  PENDING_EMAIL_KEY: 'pending_verification_email',
  USE_HTTP_ONLY_COOKIES: false, // Cambiar a true cuando migres a cookies
};

// Headers comunes para todas las requests
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'https://toutaunclicla.com',
    'Referer': 'https://toutaunclicla.com',
  };
};

/**
 * Abstracción para manejo de tokens - preparado para localStorage y cookies
 */
class TokenManager {
  private static setToken(token: string): void {
    if (AUTH_CONFIG.USE_HTTP_ONLY_COOKIES) {
      // En el futuro: hacer request al backend para set cookie
      console.log('Setting token via HTTP-only cookie (not implemented yet)');
    } else {
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    }
  }

  private static getToken(): string | null {
    if (AUTH_CONFIG.USE_HTTP_ONLY_COOKIES) {
      // En el futuro: el token vendrá automáticamente en las cookies
      return null; // Las cookies se manejan automáticamente
    } else {
      return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    }
  }

  private static removeToken(): void {
    if (AUTH_CONFIG.USE_HTTP_ONLY_COOKIES) {
      // En el futuro: hacer request al backend para clear cookie
      console.log('Removing token via HTTP-only cookie (not implemented yet)');
    } else {
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    }
  }

  static saveToken(token: string): void {
    this.setToken(token);
  }

  static retrieveToken(): string | null {
    return this.getToken();
  }

  static clearToken(): void {
    this.removeToken();
  }

  static hasToken(): boolean {
    return !!this.getToken();
  }
}

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

    // Guardar token usando TokenManager
    if (data.token) {
      TokenManager.saveToken(data.token);
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

    // Guardar token usando TokenManager
    if (data.token) {
      TokenManager.saveToken(data.token);
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
      TokenManager.saveToken(data.token);
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
    if (!email || !email.trim()) {
      throw new Error('Email es requerido para verificar estado');
    }

    const response = await fetch(`${AUTH_BASE_URL}/verification-status?email=${encodeURIComponent(email.trim())}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Origin': 'https://toutaunclicla.com',
        'Referer': 'https://toutaunclicla.com',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `Error ${response.status}: ${response.statusText}`);
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
    const token = TokenManager.retrieveToken();
    
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
        TokenManager.clearToken();
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
  TokenManager.clearToken();
}

/**
 * Verificar si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return TokenManager.hasToken();
}

/**
 * Obtener token actual
 */
export function getAuthToken(): string | null {
  return TokenManager.retrieveToken();
}

/**
 * Verificar si un email ya está registrado
 * Simplificado: deja que el backend maneje la validación durante el registro
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    if (!email || !email.trim()) {
      return false; // Email vacío no existe
    }

    const response = await fetch(`${AUTH_BASE_URL}/verification-status?email=${encodeURIComponent(email.trim())}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Si el response es exitoso (200), el usuario existe
    if (response.ok) {
      return true;
    }

    // Para cualquier otro caso, asumimos que no existe
    // El backend validará durante el registro real
    return false;

  } catch (error: any) {
    console.warn('No se pudo verificar la existencia del email, continuando con el flujo:', error);
    // En caso de error, asumimos que no existe y dejamos que el registro maneje la validación
    return false;
  }
}

/**
 * Guardar email pendiente de verificación
 */
export function setPendingVerificationEmail(email: string): void {
  localStorage.setItem(AUTH_CONFIG.PENDING_EMAIL_KEY, email);
}

/**
 * Obtener email pendiente de verificación
 */
export function getPendingVerificationEmail(): string | null {
  return localStorage.getItem(AUTH_CONFIG.PENDING_EMAIL_KEY);
}

/**
 * Limpiar email pendiente de verificación
 */
export function clearPendingVerificationEmail(): void {
  localStorage.removeItem(AUTH_CONFIG.PENDING_EMAIL_KEY);
}

// ===== GOOGLE AUTHENTICATION =====

/**
 * Iniciar autenticación con Google usando Supabase
 * Este método redirige directamente a Google OAuth a través de Supabase
 */
export async function initiateGoogleAuth(): Promise<{ url: string }> {
  const { supabase, AUTH_CONFIG } = await import('@/lib/config/supabase');
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: AUTH_CONFIG.GOOGLE_REDIRECT_URL,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      console.error('Error iniciando autenticación con Google:', error);
      throw new Error(`Error al iniciar autenticación con Google: ${error.message}`);
    }

    if (data.url) {
      return { url: data.url };
    } else {
      throw new Error('No se pudo obtener la URL de autenticación de Google');
    }
  } catch (error: any) {
    console.error('Error en initiateGoogleAuth:', error);
    throw error;
  }
}

/**
 * Manejar el callback de Google OAuth usando Supabase
 * Esta función se ejecuta en la página de callback después de la redirección de Google
 */
export async function handleGoogleCallback(): Promise<AuthResponse> {
  const { supabase } = await import('@/lib/config/supabase');
  
  try {
    // Verificar si hay un código en la URL (desde Google)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Intercambiar el código por una sesión
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error intercambiando código:', error);
        throw new Error(`Error procesando autenticación: ${error.message}`);
      }
      
      if (data.session && data.user) {
        return await syncUserWithBackend(data.session, data.user);
      }
    }
    
    // Si no hay código, intentar obtener la sesión actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error obteniendo sesión:', sessionError);
      throw new Error(`Error de sesión: ${sessionError.message}`);
    }

    if (!session || !session.user) {
      throw new Error('No se pudo obtener la sesión de autenticación');
    }

    return await syncUserWithBackend(session, session.user);
  } catch (error: any) {
    console.error('Error en callback de Google:', error);
    throw error;
  }
}

/**
 * Sincronizar usuario de Supabase con nuestro backend
 */
async function syncUserWithBackend(session: any, supabaseUser: any): Promise<AuthResponse> {
  try {
    console.log('Sincronizando usuario con backend:', supabaseUser.email);

    // Enviar solo los tokens que el backend necesita
    // El backend se encargará de obtener los datos del usuario desde Supabase
    const response = await fetch(`${AUTH_BASE_URL}/google`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error del backend:', data);
      throw new Error(data.message || 'Error sincronizando usuario con backend');
    }

    // Guardar el JWT personalizado
    TokenManager.saveToken(data.token);

    console.log('Usuario sincronizado exitosamente:', data.user.email);

    return {
      message: data.message,
      user: data.user,
      token: data.token,
      verificationRequired: false
    };
  } catch (error: any) {
    console.error('Error sincronizando con backend:', error);
    throw error;
  }
}

/**
 * Verificar si el usuario está autenticado con Supabase
 */
export async function checkSupabaseAuth(): Promise<{ session: any; user: any } | null> {
  try {
    const { supabase } = await import('@/lib/config/supabase');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session || !session.user) {
      return null;
    }
    
    return { session, user: session.user };
  } catch (error) {
    console.error('Error verificando auth de Supabase:', error);
    return null;
  }
}

/**
 * Cerrar sesión de Supabase
 */
export async function signOutFromSupabase(): Promise<void> {
  try {
    const { supabase } = await import('@/lib/config/supabase');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error cerrando sesión en Supabase:', error);
    }
  } catch (error) {
    console.error('Error en signOutFromSupabase:', error);
  }
}
