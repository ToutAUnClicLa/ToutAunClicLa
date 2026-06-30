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
  logout: () => void;
  refresh: () => Promise<void>;
}

const ProAuthContext = createContext<ProAuthContextValue | undefined>(undefined);

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
      setProUser(data.pro);
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
    setProUser(data.pro);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await proFetch<{ token: string; pro: ProUser }>('/register', {
      method: 'POST',
      body: payload,
    });
    setProToken(data.token);
    setProUser(data.pro);
  }, []);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const data = await proFetch<{ pro: ProUser }>('/verify-email', {
      method: 'POST',
      body: { email, code },
    });
    setProUser(data.pro);
  }, []);

  const resendCode = useCallback(async (email: string) => {
    await proFetch('/resend-verification', { method: 'POST', body: { email } });
  }, []);

  const logout = useCallback(() => {
    clearProToken();
    setProUser(null);
  }, []);

  return (
    <ProAuthContext.Provider
      value={{ proUser, loading, login, register, verifyEmail, resendCode, logout, refresh }}
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
