"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getServices, type DirectoryPro, type DirectoryResponse } from '@/lib/pro/endpoints';
import { DirectoryCard } from '@/components/features/services/directory/DirectoryCard';
import { DirectoryFilters } from '@/components/features/services/directory/DirectoryFilters';
import { DirectorySkeleton } from '@/components/features/services/directory/DirectorySkeleton';

interface CategoryInfo {
  slug: string;
  nombre_fr: string;
  nombre_en: string;
  nombre_es: string;
  descripcion_fr?: string;
  descripcion_en?: string;
  descripcion_es?: string;
}

interface Props {
  category: CategoryInfo;
}

const PAGE_SIZE = 12;

function useDebounced<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function CategoryDirectory({ category }: Props) {
  const { t, locale } = useTranslation();
  const lang = (locale as 'fr' | 'en' | 'es') || 'fr';

  const [q, setQ] = useState('');
  const [idioma, setIdioma] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const dq = useDebounced(q);
  const dciudad = useDebounced(ciudad);

  const [items, setItems] = useState<DirectoryPro[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const requestId = useRef(0);

  const nombre = (category[`nombre_${lang}` as keyof CategoryInfo] as string) || category.nombre_fr;
  const descripcion =
    (category[`descripcion_${lang}` as keyof CategoryInfo] as string) || category.descripcion_fr || '';

  const anyFilterActive = Boolean(dq || idioma || dciudad);

  const fetchPage = useCallback(
    async (targetPage: number, replace: boolean) => {
      const rid = ++requestId.current;
      if (replace) setLoading(true);
      else setLoadingMore(true);
      try {
        const res: DirectoryResponse = await getServices({
          category: category.slug,
          q: dq || undefined,
          idioma: idioma || undefined,
          ciudad: dciudad || undefined,
          lang,
          page: targetPage,
          pageSize: PAGE_SIZE,
        });
        if (rid !== requestId.current) return; // request obsoleto
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setPage(res.page);
        setItems((prev) => (replace ? res.items : [...prev, ...res.items]));
      } finally {
        if (rid === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [category.slug, dq, idioma, dciudad, lang],
  );

  // Refetch al cambiar filtros o idioma → reinicia a página 1
  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const onChangeFilters = (patch: { q?: string; idioma?: string; ciudad?: string }) => {
    if (patch.q !== undefined) setQ(patch.q);
    if (patch.idioma !== undefined) setIdioma(patch.idioma);
    if (patch.ciudad !== undefined) setCiudad(patch.ciudad);
  };
  const clearFilters = () => {
    setQ('');
    setIdioma('');
    setCiudad('');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Hero compacto */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#004d40] via-[#00332a] to-[#0f172a] text-white">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('pro.directory.backToCategories')}
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{nombre}</h1>
          {descripcion && (
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/80 sm:text-base">{descripcion}</p>
          )}
          {!loading && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-100/70">
              <Users className="h-3.5 w-3.5" aria-hidden />
              {total}{' '}
              {total === 1 ? t('pro.directory.proCountOne') : t('pro.directory.proCountMany')}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Toggle filtros en móvil */}
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 lg:hidden"
        >
          <Sliders className="h-4 w-4" aria-hidden />
          {t('pro.directory.filters')}
        </button>

        <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
          {/* Sidebar filtros */}
          <aside
            className={`${showFilters ? 'block' : 'hidden'} lg:sticky lg:top-24 lg:block lg:self-start`}
          >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <DirectoryFilters
                q={q}
                idioma={idioma}
                ciudad={ciudad}
                onChange={onChangeFilters}
                onClear={clearFilters}
                active={anyFilterActive}
              />
            </div>
          </aside>

          {/* Resultados */}
          <section>
            {loading ? (
              <DirectorySkeleton />
            ) : items.length === 0 ? (
              <EmptyState anyFilterActive={anyFilterActive} onClear={clearFilters} t={t} />
            ) : (
              <div className="space-y-6">
                {/* Grid simétrico: todos los tiers, misma tarjeta, 2 columnas.
                    El orden (Max destacado → Max → Pro → Free) lo da el backend. */}
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {items.map((p) => (
                    <DirectoryCard key={p.slug} pro={p} />
                  ))}
                </div>

                {page < totalPages && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => fetchPage(page + 1, false)}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-50"
                    >
                      {loadingMore ? t('pro.directory.loading') : t('pro.directory.loadMore')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  anyFilterActive,
  onClear,
  t,
}: {
  anyFilterActive: boolean;
  onClear: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/40 p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Users className="h-5 w-5 text-slate-400" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {anyFilterActive
          ? t('pro.directory.emptyFiltersTitle')
          : t('pro.directory.emptyCategoryTitle')}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {anyFilterActive
          ? t('pro.directory.emptyFiltersHint')
          : t('pro.directory.emptyCategoryHint')}
      </p>
      <div className="mt-5">
        {anyFilterActive ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-slate-900 hover:opacity-90"
          >
            {t('pro.directory.clearFilters')}
          </button>
        ) : (
          <Link
            href="/pro"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {t('pro.directory.createProfile')}
          </Link>
        )}
      </div>
    </div>
  );
}
