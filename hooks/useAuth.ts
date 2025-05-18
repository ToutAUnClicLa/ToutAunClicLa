"use client";

import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { UsuarioData, getCurrentUser } from '@/lib/supabase/auth';
import { toast } from 'sonner';

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

  // Función para sincronizar verificación cuando se detectan inconsistencias
  const syncVerification = useCallback(async (email: string) => {
    try {
      console.log('Intentando sincronizar estado de verificación para:', email);
      const response = await fetch('/api/auth/sync-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        console.log('Estado de verificación sincronizado correctamente');
        return true;
      } else {
        console.error('Error al sincronizar verificación:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('Error al sincronizar verificación:', error);
      return false;
    }
  }, []);

  // Cargar datos del usuario
  const loadUserData = useCallback(async (user: User) => {
    try {
      const { auth, usuario } = await getCurrentUser();
      
      // Detectar inconsistencias en el estado de verificación
      if (auth && usuario) {
        const authConfirmed = !!auth.email_confirmed_at;
        const dbConfirmed = usuario.verificado;
        
        // Si hay inconsistencia en verificación 
        if (dbConfirmed && !authConfirmed) {
          console.log('Detectada inconsistencia en verificación. DB confirma, Auth no');
          // Intentar sincronizar (solo si el usuario está verificado en DB)
          await syncVerification(usuario.correo_electronico);
        }
      }
      
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
  }, [syncVerification]);

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
    syncVerification,
  };
}