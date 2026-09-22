"use client";

import { create } from 'zustand';
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

// El tier de /me es caché; /me/subscription deriva el real (webhooks Stripe).
const reconcileTier = async (pro: ProUser): Promise<ProUser> => {
  try {
    const sub = await proFetch<{ tier: ProUser['tier'] }>('/me/subscription');
    if (sub.tier && sub.tier !== pro.tier) {
      return { ...pro, tier: sub.tier };
    }
  } catch {
    // No bloqueante.
  }
  return pro;
};

type ProAuthState = {
  proUser: ProUser | null;
  loading: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ message: string }>;
  deleteAccount: (payload: { password?: string; confirmarEmail?: string }) => Promise<{ message: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
  ensureSession: () => Promise<void>;
};

let ensureInflight: Promise<void> | null = null;
let refreshInflight: Promise<void> | null = null;

async function loadMe(set: (partial: Partial<ProAuthState>) => void): Promise<void> {
  if (!getProToken()) {
    set({ proUser: null, loading: false, hydrated: true });
    return;
  }
  set({ loading: true });
  try {
    const data = await proFetch<{ pro: ProUser }>('/me');
    set({ proUser: await reconcileTier(data.pro), loading: false, hydrated: true });
  } catch {
    clearProToken();
    set({ proUser: null, loading: false, hydrated: true });
  }
}

export const useProAuthStore = create<ProAuthState>((set, get) => ({
  proUser: null,
  loading: false,
  hydrated: false,

  // Primera visita al árbol Pro. Si ya hidratamos, no toca /me (evita
  // re-render al reentrar al dashboard). Recarga: refresh() — checkout,
  // portal, perfil, o token que cambió.
  ensureSession: async () => {
    if (get().hydrated) return;
    if (ensureInflight) return ensureInflight;
    ensureInflight = loadMe(set).finally(() => {
      ensureInflight = null;
    });
    return ensureInflight;
  },

  refresh: async () => {
    if (refreshInflight) return refreshInflight;
    refreshInflight = loadMe(set).finally(() => {
      refreshInflight = null;
    });
    return refreshInflight;
  },

  login: async (email, password) => {
    const data = await proFetch<{ token: string; pro: ProUser }>('/login', {
      method: 'POST',
      body: { email, password },
    });
    setProToken(data.token);
    set({ proUser: await reconcileTier(data.pro), loading: false, hydrated: true });
  },

  register: async (payload) => {
    const data = await proFetch<{ token: string; pro: ProUser }>('/register', {
      method: 'POST',
      body: payload,
    });
    setProToken(data.token);
    set({ proUser: await reconcileTier(data.pro), loading: false, hydrated: true });
  },

  verifyEmail: async (email, code) => {
    const data = await proFetch<{ pro: ProUser }>('/verify-email', {
      method: 'POST',
      body: { email, code },
    });
    set({ proUser: await reconcileTier(data.pro), loading: false, hydrated: true });
  },

  resendCode: async (email) => {
    await proFetch('/resend-verification', { method: 'POST', body: { email } });
  },

  forgotPassword: async (email) => {
    return proFetch<{ message: string }>('/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  resetPassword: async (email, code, newPassword) => {
    return proFetch<{ message: string }>('/reset-password', {
      method: 'POST',
      body: { email, code, newPassword },
    });
  },

  deleteAccount: async (payload) => {
    const data = await proFetch<{ message: string }>('/me', {
      method: 'DELETE',
      body: payload,
    });
    clearProToken();
    set({ proUser: null, loading: false, hydrated: true });
    return data;
  },

  logout: () => {
    clearProToken();
    set({ proUser: null, loading: false, hydrated: true });
  },
}));

export function useProAuth(): Omit<ProAuthState, 'hydrated' | 'ensureSession'> {
  return useProAuthStore();
}
