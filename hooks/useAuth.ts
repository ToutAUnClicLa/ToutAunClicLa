"use client";

import { useState, useEffect, useCallback } from 'react';
import * as authService from '@/lib/services/auth';
import { toast } from 'sonner';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: authService.User | null;
  error: Error | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  // Función para actualizar el estado después de operaciones de autenticación
  const refreshAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getUserProfile();
        setState({
          isLoading: false,
          isAuthenticated: true,
          user: response.user,
          error: null,
        });
      } else {
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error al actualizar auth:', error);
      // Si hay error, limpiar token y estado
      authService.logout();
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error as Error,
      });
    }
  }, []);

  // Función de login
  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.loginUser({ email, password });
      
      // Actualizar estado inmediatamente con los datos del usuario
      const newState = {
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
        error: null,
      };
      
      setState(newState);
      
      return response;
    } catch (error: any) {
      console.error('Error en login:', error);
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error,
      });
      
      throw error;
    }
  }, []);

  // Función de registro
  const register = useCallback(async ({ email, password, nombre, telefono }: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.registerUser({ email, password, nombre, telefono });
      
      setState({
        isLoading: false,
        isAuthenticated: false, // No autenticado hasta verificar email
        user: null,
        error: null,
      });
      
      return response;
    } catch (error: any) {
      console.error('Error en registro:', error);
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error,
      });
      
      throw error;
    }
  }, []);

  // Función de logout
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      authService.logout();
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    } catch (error: any) {
      console.error('Error en logout:', error);
      // Incluso si hay error, limpiamos el estado local
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    }
  }, []);

  // Función para verificar email
  const verifyEmail = useCallback(async (code: string, email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.verifyEmail(code, email);
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
        error: null,
      });
      
      toast.success('Email verificado correctamente. ¡Bienvenido!');
      return response;
    } catch (error: any) {
      console.error('Error en verificación:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error,
      }));
      
      toast.error(error.message || 'Código de verificación inválido');
      throw error;
    }
  }, []);

  // Función para reenviar verificación
  const resendVerification = useCallback(async (email: string) => {
    try {
      await authService.resendVerification(email);
      toast.success('Código de verificación reenviado');
    } catch (error: any) {
      console.error('Error al reenviar verificación:', error);
      toast.error(error.message || 'Error al reenviar código');
      throw error;
    }
  }, []);

  // Función para verificar estado de verificación
  const checkVerificationStatus = useCallback(async (email: string) => {
    try {
      return await authService.checkVerificationStatus(email);
    } catch (error: any) {
      console.error('Error al verificar estado:', error);
      throw error;
    }
  }, []);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    refreshAuth();
  }, []); // Eliminar refreshAuth de las dependencias para evitar loop infinito

  return {
    // Estado
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    userData: state.user, // Alias para compatibilidad
    error: state.error,
    
    // Acciones
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    checkVerificationStatus,
    refreshAuth,
  };
}
