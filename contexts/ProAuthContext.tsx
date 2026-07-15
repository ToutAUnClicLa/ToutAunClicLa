"use client";

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  proFetch,
  getProToken,
  setProToken,
  clearProToken,
} from '@/lib/pro/api';

export interface ProUser {
  id: string;
  email: string;
  slug: string;
  nombre: string;
  apellido?: string | null;
  empresa?: string | null;
  foto_url?: string | null;
  verificado: boolean;
  autenticacion_social: boolean;
  tier: 'free' | 'pro' | 'max';
  titulo_fr?: string | null;
  titulo_en?: string | null;
  titulo_es?: string | null;
  bio_fr?: string | null;
  bio_en?: string | null;
  bio_es?: string | null;
  idioma_principal?: 'fr' | 'en' | 'es';
  idiomas_hablados?: string[];
  telefono?: string | null;
  sitio_web?: string | null;
  ciudad?: string | null;
  codigo_postal?: string | null;
  email_contacto?: string | null;
  categoria_id?: string | null;
  subcategoria_id?: string | null;
  destacado?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
}

interface ProAuthContextValue {
  proUser: ProUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ message: string }>;
  deleteAccount: (payload: { password?: string; confirmarEmail?: string }) => Promise<{ message: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const ProAuthContext = createContext<ProAuthContextValue | undefined>(undefined);

// El tier que devuelve /me es una caché (pro_profesionales.tier) que el
// webhook de Stripe puede dejar desincronizada del estado real de la
// suscripción. /me/subscription sí lo deriva en vivo (getEffectiveTier), así
// que lo usamos para corregir el tier mostrado en vez de esperar a que el
// usuario vuelva de un checkout/portal (único caso que hoy refresca esto).
// Si la reconciliación falla, seguimos con el tier de /me tal cual — no debe
// bloquear el login.
const reconcileTier = async (pro: ProUser): Promise<ProUser> => {
  try {
    const sub = await proFetch<{ tier: ProUser['tier'] }>('/me/subscription');
    if (sub.tier && sub.tier !== pro.tier) {
      return { ...pro, tier: sub.tier };
    }
  } catch {
    // No bloqueante: nos quedamos con el tier de /me.
  }
  return pro;
};

export function ProAuthProvider({ children }: { children: React.ReactNode }) {
  const [proUser, setProUser] = useState<ProUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getProToken()) {
      setProUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await proFetch<{ pro: ProUser }>('/me');
      setProUser(await reconcileTier(data.pro));
    } catch {
      clearProToken();
      setProUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await proFetch<{ token: string; pro: ProUser }>('/login', {
      method: 'POST',
      body: { email, password },
    });
    setProToken(data.token);
    setProUser(await reconcileTier(data.pro));
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await proFetch<{ token: string; pro: ProUser }>('/register', {
      method: 'POST',
      body: payload,
    });
    setProToken(data.token);
    setProUser(await reconcileTier(data.pro));
  }, []);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const data = await proFetch<{ pro: ProUser }>('/verify-email', {
      method: 'POST',
      body: { email, code },
    });
    setProUser(await reconcileTier(data.pro));
  }, []);

  const resendCode = useCallback(async (email: string) => {
    await proFetch('/resend-verification', { method: 'POST', body: { email } });
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    return proFetch<{ message: string }>('/forgot-password', {
      method: 'POST',
      body: { email },
    });
  }, []);

  const resetPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      return proFetch<{ message: string }>('/reset-password', {
        method: 'POST',
        body: { email, code, newPassword },
      });
    },
    [],
  );

  // No limpia el token en catch/finally: si Stripe falla (502) la cuenta
  // sigue existiendo y la sesión debe seguir siendo válida para reintentar.
  const deleteAccount = useCallback(
    async (payload: { password?: string; confirmarEmail?: string }) => {
      const data = await proFetch<{ message: string }>('/me', {
        method: 'DELETE',
        body: payload,
      });
      clearProToken();
      setProUser(null);
      return data;
    },
    [],
  );

  const logout = useCallback(() => {
    clearProToken();
    setProUser(null);
  }, []);

  return (
    <ProAuthContext.Provider
      value={{
        proUser,
        loading,
        login,
        register,
        verifyEmail,
        resendCode,
        forgotPassword,
        resetPassword,
        deleteAccount,
        logout,
        refresh,
      }}
    >
      {children}
    </ProAuthContext.Provider>
  );
}

export function useProAuth(): ProAuthContextValue {
  const ctx = useContext(ProAuthContext);
  if (!ctx) throw new Error('useProAuth debe usarse dentro de <ProAuthProvider>');
  return ctx;
}
