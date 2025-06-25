"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as authService from '@/lib/services/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: authService.User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<authService.AuthResponse>;
  register: (email: string, password: string, nombre: string, telefono?: string) => Promise<authService.AuthResponse>;
  logout: () => void;
  verifyEmail: (code: string, email: string) => Promise<authService.AuthResponse>;
  resendVerification: (email: string) => Promise<void>;
  checkVerificationStatus: (email: string) => Promise<{ verified: boolean; email: string }>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<authService.User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getUserProfile();
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
      // Si hay error, limpiar estado
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    setIsLoading(true);
    await checkAuthStatus();
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.loginUser({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('¡Bienvenido! Has iniciado sesión correctamente');
      return response;
    } catch (error: any) {
      console.error('Error en login:', error);
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, nombre: string, telefono?: string) => {
    setIsLoading(true);
    try {
      const response = await authService.registerUser({ email, password, nombre, telefono });
      // No establecemos el usuario hasta que se verifique el email
      toast.success('Cuenta creada. Revisa tu email para verificar tu cuenta');
      return response;
    } catch (error: any) {
      console.error('Error en registro:', error);
      toast.error(error.message || 'Error al crear cuenta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Sesión cerrada correctamente');
  };

  const verifyEmail = async (code: string, email: string) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyEmail(code, email);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Email verificado correctamente. ¡Bienvenido!');
      return response;
    } catch (error: any) {
      console.error('Error en verificación:', error);
      toast.error(error.message || 'Código de verificación inválido');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    try {
      await authService.resendVerification(email);
      toast.success('Código de verificación reenviado');
    } catch (error: any) {
      console.error('Error al reenviar verificación:', error);
      toast.error(error.message || 'Error al reenviar código');
      throw error;
    }
  };

  const checkVerificationStatus = async (email: string) => {
    try {
      return await authService.checkVerificationStatus(email);
    } catch (error: any) {
      console.error('Error al verificar estado:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    checkVerificationStatus,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
