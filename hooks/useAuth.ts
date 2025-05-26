"use client";

import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/supabase/auth';
import { toast } from 'sonner';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  userData: any | null;
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
    userData: null,
    error: null,
  });

  // Función para actualizar el estado después de operaciones de autenticación
  const refreshAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { auth, usuario } = await getCurrentUser();
      setState({
        isLoading: false,
        isAuthenticated: !!auth,
        user: auth,
        userData: usuario,
        error: null,
      });
    } catch (error) {
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        userData: null,
        error: error as Error,
      });
    }
  }, []);

  // Cargar datos del usuario
  const loadUserData = useCallback(async (user: User) => {
    try {
      console.log('👤 Cargando datos del usuario para:', user.email);
      const { auth, usuario } = await getCurrentUser();
      console.log('📋 Datos obtenidos - Auth:', !!auth, 'Usuario:', !!usuario, usuario?.nombre);
      
      // Detectar inconsistencias en el estado de verificación
      if (auth && usuario) {
        // Si el usuario está verificado en nuestra tabla, lo consideramos verificado
        // sin importar lo que diga Auth
        if (usuario.verificado) {
          console.log('✅ Usuario verificado, autenticando...');
          setState(prev => ({
            ...prev,
            isLoading: false,
            isAuthenticated: true, // Consideramos autenticado si está en nuestra tabla
            user: auth,
            userData: usuario,
          }));
          return;
        }
      }
      
      console.log('⚠️ Usuario no verificado o datos incompletos');
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: !!auth,
        user: auth,
        userData: usuario,
      }));
    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, []);

  // Función para hacer login usando nuestra API segura
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      console.log('🔑 Iniciando login para:', credentials.email);
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('📡 Respuesta del login:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Después del login exitoso en el servidor, necesitamos establecer la sesión en el cliente
      console.log('🔄 Estableciendo sesión en el cliente...');
      
      // Intentar iniciar sesión directamente en el cliente también
      const { data: clientAuth, error: clientError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (clientError) {
        console.warn('⚠️ Error al establecer sesión en cliente, pero login exitoso en servidor:', clientError);
        // Aún así, intentamos obtener la sesión
      }
      
      // Esperar un momento para que la sesión se establezca
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Forzar verificación de sesión múltiples veces
      console.log('🔄 Verificando sesión después del login...');
      let session = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!session && attempts < maxAttempts) {
        const { data: sessionData } = await supabase.auth.getSession();
        session = sessionData.session;
        console.log(`🎯 Intento ${attempts + 1}: Sesión verificada:`, !!session, session?.user?.email);
        
        if (!session) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        attempts++;
      }
      
      if (session) {
        console.log('✅ Sesión establecida correctamente');
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: true,
          user: session.user,
        }));
        await loadUserData(session.user);
      } else {
        console.log('⚠️ No se pudo establecer sesión, pero login fue exitoso. Refrescando...');
        await refreshAuth();
      }
      
      toast.success('Sesión iniciada correctamente');
      return { success: true, data };
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      setState(prev => ({ ...prev, isLoading: false, error }));
      toast.error(error.message || 'Error al iniciar sesión');
      return { success: false, error: error.message };
    }
  }, [refreshAuth, loadUserData]);

  // Función para registrarse usando nuestra API segura
  const register = useCallback(async (userData: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/register-secure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      toast.success('Registro exitoso. Revisa tu email para verificar tu cuenta.');
      return { success: true, data };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error }));
      toast.error(error.message || 'Error al registrarse');
      return { success: false, error: error.message };
    }
  }, []);

  // Función para solicitar reset de contraseña
  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al solicitar reset de contraseña');
      }

      toast.success('Si tu email está registrado, recibirás instrucciones para restablecer tu contraseña');
      return { success: true, data };
    } catch (error: any) {
      toast.error(error.message || 'Error al solicitar reset de contraseña');
      return { success: false, error: error.message };
    }
  }, []);

  // Función para hacer logout
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await supabase.auth.signOut();
      
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        userData: null,
        error: null,
      });
      
      toast.success('Sesión cerrada correctamente');
      return { success: true };
    } catch (error: any) {
      toast.error('Error al cerrar sesión');
      return { success: false, error: error.message };
    }
  }, []);

  // Función para sincronizar verificación manualmente
  const syncVerification = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/sync-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al sincronizar verificación');
      }

      await refreshAuth();
      toast.success('Verificación sincronizada correctamente');
      return { success: true, data };
    } catch (error: any) {
      toast.error(error.message || 'Error al sincronizar verificación');
      return { success: false, error: error.message };
    }
  }, []);

  // Función para reenviar email de verificación
  const resendVerification = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al reenviar email de verificación');
      }

      toast.success('Email de verificación enviado');
      return { success: true, data };
    } catch (error: any) {
      toast.error(error.message || 'Error al reenviar email de verificación');
      return { success: false, error: error.message };
    }
  }, []);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        console.log('🔍 Obteniendo sesión inicial...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Sesión obtenida:', !!session, session?.user?.email);
        
        if (session) {
          setState(prev => ({
            ...prev,
            isAuthenticated: true,
            user: session.user,
          }));
          loadUserData(session.user);
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isAuthenticated: false,
          }));
        }
      } catch (error) {
        console.error('❌ Error al obtener sesión inicial:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));
      }
    };

    getInitialSession();

    // Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Cambio de estado de auth:', event, !!session, session?.user?.email);
      setState(prev => ({
        ...prev,
        isAuthenticated: !!session,
        user: session?.user || null,
      }));

      if (session?.user) {
        loadUserData(session.user);
      } else {
        console.log('❌ No hay sesión, limpiando estado...');
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          userData: null,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  return {
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    userData: state.userData,
    error: state.error,
    login,
    register,
    logout,
    forgotPassword,
    refreshAuth,
    syncVerification,
    resendVerification,
  };
}