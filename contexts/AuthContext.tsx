"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import * as authService from '@/lib/services/auth';
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
      toast.error("Debes verificar tu cuenta para realizar esta acción");
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
      } else {
        // Limpiar estado si no hay token
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error('Error al verificar estado de autenticación:', error);
      
      // Si hay error de token expirado o inválido, limpiar estado
      if (error.message.includes('Sesión expirada') || error.message.includes('No hay token')) {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setError(error.message || 'Error al verificar autenticación');
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
      toast.success('¡Bienvenido! Has iniciado sesión correctamente');
      return response;
    } catch (error: any) {
      console.error('Error en login:', error);
      const errorMessage = error.message || 'Error al iniciar sesión';
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
      toast.success('Cuenta creada. Revisa tu email para verificar tu cuenta');
      return response;
    } catch (error: any) {
      console.error('Error en registro:', error);
      const errorMessage = error.message || 'Error al crear cuenta';
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
      toast.success('Sesión cerrada correctamente');
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
      toast.success('Email verificado correctamente. ¡Bienvenido!');
      return response;
    } catch (error: any) {
      console.error('Error en verificación:', error);
      const errorMessage = error.message || 'Código de verificación inválido';
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
      toast.success('Código de verificación reenviado');
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
