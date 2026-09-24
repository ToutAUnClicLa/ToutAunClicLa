"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Sliders, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getServices, type DirectoryPro, type DirectoryResponse } from '@/lib/pro/endpoints';
import { DirectoryCard } from '@/components/features/services/directory/DirectoryCard';
import { DirectoryFilters } from '@/components/features/services/directory/DirectoryFilters';
import { DirectorySkeleton } from '@/components/features/services/directory/DirectorySkeleton';
import { shopChrome, shopHeroFigure } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

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

const CATEGORY_IMAGE: Record<string, string> = {
  lawyers: '/services/lawyers.png',
  health: '/services/health.png',
  accounting: '/services/accounting.png',
  finance: '/services/finance.png',
  realestate: '/services/home-services.png',
  cars: '/services/cars.png',
  beauty: '/services/beauty.png',
  translation: '/services/translation.png',
  money: '/services/money.png',
  maintenance: '/services/maintenance.png',
};

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
  const heroImage = CATEGORY_IMAGE[category.slug];

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
        if (rid !== requestId.current) return;
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
    <div className="min-h-screen bg-white text-[var(--shop-ink)]">
      <section className="border-b border-[var(--shop-hairline)] bg-white">
        <div className="container py-10 sm:py-14 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
            <div>
              <Link
                href="/servicios"
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-medium text-[var(--shop-muted)] hover:text-[var(--shop-purple)]',
                  shopChrome.focus,
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                {t('pro.directory.backToCategories')}
              </Link>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--shop-ink)] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {nombre}
              </h1>
              {descripcion ? (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--shop-muted)]">
                  {descripcion}
                </p>
              ) : null}
              {!loading && (
                <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[var(--shop-hairline)] px-3 py-1 text-xs font-medium text-[var(--shop-muted)]">
                  <Users className="h-3.5 w-3.5 text-[var(--shop-purple)]" aria-hidden />
                  {total}{' '}
                  {total === 1 ? t('pro.directory.proCountOne') : t('pro.directory.proCountMany')}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container py-10 sm:py-14 lg:py-16">
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className={cn(shopChrome.filterChip, 'mb-4 h-11 min-h-11 px-4 text-sm lg:hidden', shopChrome.focus)}
        >
          <Sliders className="mr-1.5 h-4 w-4" aria-hidden />
          {t('pro.directory.filters')}
        </button>

        <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
          <aside
            className={`${showFilters ? 'block' : 'hidden'} lg:sticky lg:top-[calc(var(--shop-header-h)+1rem)] lg:block lg:self-start`}
          >
            <div className="rounded-xl border border-[var(--shop-hairline)] bg-white p-5">
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

          <section>
            {loading ? (
              <DirectorySkeleton />
            ) : items.length === 0 ? (
              <EmptyState anyFilterActive={anyFilterActive} onClear={clearFilters} t={t} />
            ) : (
              <div className="space-y-6">
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
                      className={cn(shopChrome.filterChip, 'h-11 min-h-11 px-5 text-sm disabled:opacity-50', shopChrome.focus)}
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
    <div className="rounded-xl border border-[var(--shop-hairline)] py-16 text-center">
      <Users className="mx-auto mb-4 h-8 w-8 text-[var(--shop-hairline)]" aria-hidden />
      <h3 className="text-lg font-medium text-[var(--shop-ink)]">
        {anyFilterActive
          ? t('pro.directory.emptyFiltersTitle')
          : t('pro.directory.emptyCategoryTitle')}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--shop-muted)]">
        {anyFilterActive
          ? t('pro.directory.emptyFiltersHint')
          : t('pro.directory.emptyCategoryHint')}
      </p>
      <div className="mt-6">
        {anyFilterActive ? (
          <button type="button" onClick={onClear} className={cn(shopChrome.inkCta)}>
            {t('pro.directory.clearFilters')}
          </button>
        ) : (
          <Link href="/pro" className={shopChrome.inkCta}>
            {t('pro.directory.createProfile')}
          </Link>
        )}
      </div>
    </div>
  );
}
