import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { CategoryDirectory } from './CategoryDirectory';
import { getProT, validLang } from '@/lib/pro/i18n';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5500/api/v1';

interface CategoriaAPI {
  slug: string;
  nombre_fr: string;
  nombre_en: string;
  nombre_es: string;
  descripcion_fr?: string;
  descripcion_en?: string;
  descripcion_es?: string;
}

async function getCategoria(slug: string): Promise<CategoriaAPI | null> {
  try {
    const res = await fetch(`${API_BASE}/pro/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { categorias: CategoriaAPI[] };
    return data.categorias.find((c) => c.slug === slug) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  // Idioma: cookie del visitante (si viene de un cliente ya con idioma seteado),
  // fallback a fr (Loi 96).
  const lang = validLang(cookies().get('preferred-language')?.value);
  const t = getProT(lang);
  const cat = await getCategoria(params.category);
  if (!cat) return { title: t.card.categoryNotFound };
  const nombre =
    (cat as unknown as Record<string, string>)[`nombre_${lang}`] || cat.nombre_fr;
  const descripcion =
    (cat as unknown as Record<string, string>)[`descripcion_${lang}`] || cat.descripcion_fr;
  const description =
    descripcion || t.card.metaCategoryDescription.replace('{nombre}', nombre);
  return {
    title: `${nombre} · ${t.card.backGeneric}`,
    description,
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const cat = await getCategoria(params.category);
  if (!cat) notFound();
  return <CategoryDirectory category={cat} />;
}
