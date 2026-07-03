// Helpers tipados del módulo Pro sobre proFetch.
import { proFetch } from './api';
import type { ProUser } from '@/contexts/ProAuthContext';

export interface Subcategoria {
  id: string;
  categoria_id: string;
  slug: string;
  nombre_fr: string;
  nombre_en: string;
  nombre_es: string;
}

export interface Categoria {
  id: string;
  slug: string;
  nombre_fr: string;
  nombre_en: string;
  nombre_es: string;
  icono?: string;
  subcategorias: Subcategoria[];
}

export interface RedSocial {
  id: string;
  plataforma: string;
  url: string;
  orden?: number;
}

export const getCategories = () =>
  proFetch<{ categorias: Categoria[] }>('/categories').then((r) => r.categorias);

export const updateMe = (patch: Record<string, unknown>) =>
  proFetch<{ pro: ProUser }>('/me', { method: 'PUT', body: patch }).then((r) => r.pro);

export const listSocial = () =>
  proFetch<{ redes: RedSocial[] }>('/me/social').then((r) => r.redes);

export const addSocial = (body: { plataforma: string; url: string }) =>
  proFetch<{ red: RedSocial }>('/me/social', { method: 'POST', body }).then((r) => r.red);

export const deleteSocial = (id: string) =>
  proFetch(`/me/social/${id}`, { method: 'DELETE' });

export const uploadAvatar = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return proFetch<{ foto_url: string; pro: ProUser }>('/me/avatar', { method: 'POST', body: fd });
};

// --- Suscripciones ----------------------------------------------------------

export interface SubscriptionState {
  tier: 'free' | 'pro' | 'max';
  subscription: null | {
    plan: 'pro' | 'max';
    periodo: 'mensual' | 'anual';
    estado: string;
    trial_fin: string | null;
    periodo_actual_fin: string | null;
    cancelar_al_final: boolean;
  };
}

export const getSubscription = () => proFetch<SubscriptionState>('/me/subscription');

// Fuerza re-sync desde Stripe (post-checkout / post-portal).
export const syncSubscription = () =>
  proFetch<SubscriptionState>('/me/subscription/sync', { method: 'POST', body: {} });

export const createCheckout = (plan: 'pro' | 'max', periodo: 'mensual' | 'anual') =>
  proFetch<{ url: string }>('/me/checkout', { method: 'POST', body: { plan, periodo } }).then(
    (r) => r.url,
  );

export const openBillingPortal = () =>
  proFetch<{ url: string }>('/me/billing-portal', { method: 'POST', body: {} }).then((r) => r.url);

// --- Directorio público -----------------------------------------------------

export interface DirectoryRed {
  plataforma: string;
  url: string;
}

export interface DirectoryPro {
  slug: string;
  nombre: string;
  apellido?: string | null;
  tier: 'free' | 'pro' | 'max';
  categoria_id: string;
  subcategoria_id?: string | null;
  empresa?: string | null;
  foto_url?: string | null;
  titulo?: string | null;
  ciudad?: string | null;
  idiomas_hablados?: string[];
  redes?: DirectoryRed[];
  bio?: string | null;
  destacado?: boolean;
}

export interface DirectoryResponse {
  items: DirectoryPro[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DirectoryFilters {
  category?: string;
  subcategory?: string;
  idioma?: string;
  ciudad?: string;
  q?: string;
  lang?: string;
  page?: number;
  pageSize?: number;
}

export const getServices = (filters: DirectoryFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  const qs = params.toString();
  return proFetch<DirectoryResponse>(`/services${qs ? `?${qs}` : ''}`);
};
