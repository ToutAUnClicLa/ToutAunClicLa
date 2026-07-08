// Helpers para el perfil público /card/[slug] (server + client)

export interface PublicRed {
  plataforma: string;
  url: string;
}

export interface PublicGaleriaItem {
  imagen_url: string;
  titulo?: string | null;
  descripcion?: string | null;
  orden?: number;
}

export interface PublicPro {
  slug: string;
  nombre: string;
  apellido?: string | null;
  empresa?: string | null;
  foto_url?: string | null;
  titulo?: string | null;
  bio?: string | null;
  telefono?: string | null;
  sitio_web?: string | null;
  ciudad?: string | null;
  email_contacto?: string | null;
  idiomas_hablados?: string[];
  categoria_id?: string | null;
  subcategoria_id?: string | null;
  tier: 'free' | 'pro' | 'max';
  destacado?: boolean;
  redes?: PublicRed[];
  galeria?: PublicGaleriaItem[];
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5500/api/v1';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// URLs de vCard / QR (apuntan al backend).
export const vcardUrl = (slug: string) => `${API_BASE}/pro/${slug}/vcard`;
export const qrUrl = (slug: string) => `${API_BASE}/pro/${slug}/qr`;

// SSR: descarga el QR del backend y lo devuelve como data URL (evita todo
// problema de CORS/CORP/CSP al embeberlo en un <img> desde el frontend).
export async function fetchQrDataUrl(slug: string): Promise<string | null> {
  try {
    const res = await fetch(qrUrl(slug), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

export interface ProCategoria {
  id: string;
  slug: string;
  nombre_fr: string;
  nombre_en: string;
  nombre_es: string;
}

// SSR: resuelve la categoría del profesional (para el back link contextual).
export async function fetchCategoriaById(
  categoriaId: string | null | undefined,
  lang: 'fr' | 'en' | 'es' = 'fr',
): Promise<{ slug: string; nombre: string } | null> {
  if (!categoriaId) return null;
  try {
    const res = await fetch(`${API_BASE}/pro/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const { categorias } = (await res.json()) as { categorias: ProCategoria[] };
    const cat = categorias.find((c) => c.id === categoriaId);
    if (!cat) return null;
    return { slug: cat.slug, nombre: cat[`nombre_${lang}` as const] || cat.nombre_fr };
  } catch {
    return null;
  }
}

// SSR: obtiene el perfil público (cache corto para no matar la BD ante SEO crawlers)
export async function fetchPublicProfile(slug: string, lang = 'fr'): Promise<PublicPro | null> {
  try {
    const res = await fetch(`${API_BASE}/pro/${encodeURIComponent(slug)}?lang=${lang}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { pro: PublicPro };
    return data.pro;
  } catch {
    return null;
  }
}

// Cliente: registra un evento sin bloquear. Fire-and-forget.
export function trackProEvent(
  evento: 'vista_perfil' | 'clic_red' | 'descarga_vcard' | 'scan_qr' | 'add_wallet' | 'clic_telefono' | 'clic_web',
  slug: string,
  metadata: Record<string, unknown> = {},
): void {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify({ evento, slug, metadata });
  const url = `${API_BASE}/pro/analytics`;
  // sendBeacon si está disponible: no bloquea la navegación
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
    return;
  }
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}
