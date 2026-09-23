"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import * as authService from '@/lib/services/auth';
import { persistShopAuthNext } from '@/lib/shop-auth';
import { toast } from 'sonner';

interface AuthContextType {
  // Estado
  user: authService.User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones de autenticación
  login: (credentials: { email: string; password: string }) => Promise<authService.AuthResponse>;
  register: (data: { email: string; password: string; nombre: string; telefono?: string }) => Promise<authService.AuthResponse>;
  logout: () => Promise<void>;
  verifyEmail: (code: string, email: string) => Promise<authService.AuthResponse>;
  resendVerification: (email: string) => Promise<void>;
  checkVerificationStatus: (email: string) => Promise<{ verified: boolean; email: string }>;
  refreshAuth: () => Promise<void>;
  
  // Google Auth
  initiateGoogleAuth: (next?: string) => Promise<void>;
  handleGoogleCallback: () => Promise<authService.AuthResponse>;
  
  // Utilidades
  clearError: () => void;
  requireAuth: (action: () => void, message?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext }; // Exportar el contexto para poder usarlo en el hook

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<authService.User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Función para requerir autenticación
  const requireAuth = useCallback((action: () => void, message = "Debes iniciar sesión para realizar esta acción") => {
    if (!isAuthenticated || !user) {
      toast.error(message);
      return false;
    }
    
    if (!user.verified) {
      toast.error("Debes verificar tu cuenta para realizar esta acción"); // TODO: Use translation when context supports it
      return false;
    }
    
    action();
    return true;
  }, [isAuthenticated, user]);

  // Verificar autenticación al cargar (con manejo automático de sesión)
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getUserProfile();
        setUser(response.user);
        setIsAuthenticated(true);
        
        console.log('Usuario autenticado:', response.user.email);
      } else {
        // Limpiar estado si no hay token
        setUser(null);
        setIsAuthenticated(false);
        console.log('No hay token, usuario no autenticado');
      }
    } catch (error: any) {
      console.error('Error al verificar estado de autenticación:', error);
      
      // Si hay error de token expirado o inválido, limpiar estado
      if (error.message.includes('Sesión expirada') || 
          error.message.includes('No hay token') ||
          error.message.includes('401') ||
          error.message.includes('Unauthorized')) {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        console.log('Token inválido o expirado, limpiando sesión');
      } else {
        // Para otros errores, no mostrar al usuario pero log en consola
        console.warn('Error de autenticación (no crítico):', error.message);
        // No setear error en el estado para evitar mostrar errores al cargar
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const refreshAuth = useCallback(async () => {
    await initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.loginUser(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      
      console.log('Login exitoso para:', response.user.email);
      
      return response;
    } catch (error: any) {
      console.error('Error en login:', error);
      
      let errorMessage = 'Error al iniciar sesión';
      
      // Manejo específico de errores
      if (error.message.includes('verificación') || error.message.includes('403')) {
        errorMessage = 'Tu cuenta requiere verificación. Revisa tu correo electrónico.';
      } else if (error.message.includes('401') || error.message.includes('credentials')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.message.includes('423') || error.message.includes('locked')) {
        errorMessage = 'Cuenta bloqueada por múltiples intentos fallidos';
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        errorMessage = 'Demasiados intentos. Espera unos minutos';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; nombre: string; telefono?: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.registerUser(data);
      
      // No establecemos el usuario hasta que se verifique el email
      console.log('Registro exitoso para:', data.email);
      
      return response;
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      let errorMessage = 'Error al crear cuenta';
      
      // Manejo específico de errores
      if (error.message.includes('409') || error.message.includes('already exists')) {
        errorMessage = 'Este email ya está registrado';
      } else if (error.message.includes('400') || error.message.includes('validation')) {
        errorMessage = 'Datos inválidos. Verifica la información';
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        errorMessage = 'Demasiados intentos. Espera unos minutos';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error: any) {
      console.error('Error en logout:', error);
      // Incluso si hay error, limpiamos el estado local
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (code: string, email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.verifyEmail(code, email);
      setUser(response.user);
      setIsAuthenticated(true);
      
      console.log('Email verificado exitosamente para:', email);
      
      return response;
    } catch (error: any) {
      console.error('Error en verificación:', error);
      
      let errorMessage = 'Código de verificación inválido';
      
      // Manejo específico de errores
      if (error.message.includes('400') || error.message.includes('invalid')) {
        errorMessage = 'Código incorrecto o expirado';
      } else if (error.message.includes('404')) {
        errorMessage = 'Usuario no encontrado';
      } else if (error.message.includes('409') || error.message.includes('already verified')) {
        errorMessage = 'Esta cuenta ya está verificada';
      } else if (error.message.includes('429')) {
        errorMessage = 'Demasiados intentos. Espera unos minutos';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    try {
      await authService.resendVerification(email);
      toast.success('Código de verificación reenviado'); // TODO: Use translation when context supports it
    } catch (error: any) {
      console.error('Error al reenviar verificación:', error);
      const errorMessage = error.message || 'Error al reenviar código';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const checkVerificationStatus = useCallback(async (email: string) => {
    try {
      return await authService.checkVerificationStatus(email);
    } catch (error: any) {
      console.error('Error al verificar estado:', error);
      const errorMessage = error.message || 'Error al verificar estado';
      setError(errorMessage);
      throw error;
    }
  }, []);

  const initiateGoogleAuth = useCallback(async (next?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      persistShopAuthNext(next);
      const { url } = await authService.initiateGoogleAuth();
      // Redirigir a Google OAuth
      window.location.href = url;
    } catch (error: any) {
      console.error('Error iniciando autenticación con Google:', error);
      const errorMessage = error.message || 'Error al iniciar autenticación con Google';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleGoogleCallback = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.handleGoogleCallback();
      setUser(response.user);
      setIsAuthenticated(true);
      
      console.log('Google Auth exitoso para:', response.user.email);
      // Eliminar el toast de aquí para evitar duplicados
      // El toast se mostrará en la página de callback
      
      return response;
    } catch (error: any) {
      console.error('Error en callback de Google:', error);
      
      let errorMessage = 'Error al procesar autenticación con Google';
      
      if (error.message.includes('Invalid token') || error.message.includes('session')) {
        errorMessage = 'Sesión de Google inválida o expirada';
      } else if (error.message.includes('User not found')) {
        errorMessage = 'Error al crear tu cuenta con Google';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Acciones de autenticación
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    checkVerificationStatus,
    refreshAuth,
    
    // Google Auth
    initiateGoogleAuth,
    handleGoogleCallback,
    
    // Utilidades
    clearError,
    requireAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
