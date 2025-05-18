"use client";

import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { UsuarioData, getCurrentUser } from '@/lib/supabase/auth';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  userData: UsuarioData | null;
  error: Error | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    userData: null,
    error: null,
  });

  // Cargar datos del usuario
  const loadUserData = useCallback(async (user: User) => {
    try {
      const { auth, usuario } = await getCurrentUser();
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: !!auth,
        user: auth,
        userData: usuario,
      }));
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, []);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
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
        console.error('Error al obtener sesión inicial:', error);
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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState(prev => ({
        ...prev,
        isAuthenticated: !!session,
        user: session?.user || null,
      }));

      if (session?.user) {
        loadUserData(session.user);
      } else {
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

  return {
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    userData: state.userData,
    error: state.error,
    refreshAuth,
  };
}