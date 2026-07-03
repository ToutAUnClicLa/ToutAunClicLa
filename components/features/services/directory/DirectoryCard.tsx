"use client";

import Link from 'next/link';
import { MapPin, Star, Sparkles, ArrowUpRight } from 'lucide-react';
import type { DirectoryPro } from '@/lib/pro/endpoints';
import { useTranslation } from '@/hooks/useTranslation';

const SOCIAL_ICON_CLASS =
  'inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase';

function initials(pro: DirectoryPro) {
  return `${(pro.nombre || '')[0] || ''}${(pro.apellido || '')[0] || ''}`.toUpperCase() || '?';
}

function Socials({ redes }: { redes?: DirectoryPro['redes'] }) {
  if (!redes || redes.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {redes.slice(0, 4).map((r) => (
        <span key={r.plataforma + r.url} className={SOCIAL_ICON_CLASS} title={r.plataforma}>
          {r.plataforma.slice(0, 2)}
        </span>
      ))}
      {redes.length > 4 && (
        <span className="text-xs text-slate-400 dark:text-slate-500">+{redes.length - 4}</span>
      )}
    </div>
  );
}

// ─── MAX destacado (banner ancho arriba de la grilla) ────────────────────────
export function DirectoryCardMaxFeatured({ pro }: { pro: DirectoryPro }) {
  const { t } = useTranslation();
  return (
    <Link
      href={`/card/${pro.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/10"
    >
      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-500/20">
        <Sparkles className="h-3 w-3" aria-hidden />
        {t('pro.directory.featured')}
      </span>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {pro.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pro.foto_url}
            alt=""
            className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
            {initials(pro)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {pro.nombre} {pro.apellido}
          </h3>
          {pro.titulo && (
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
              {pro.titulo}
              {pro.empresa && <span className="text-slate-400 dark:text-slate-500"> · {pro.empresa}</span>}
            </p>
          )}
          {pro.bio && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{pro.bio}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            {pro.ciudad && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {pro.ciudad}
              </span>
            )}
            {pro.idiomas_hablados && pro.idiomas_hablados.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                {pro.idiomas_hablados.slice(0, 4).map((l) => (
                  <span
                    key={l}
                    className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase"
                  >
                    {l}
                  </span>
                ))}
              </span>
            )}
            <Socials redes={pro.redes} />
          </div>
        </div>

        <ArrowUpRight
          className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600"
          aria-hidden
        />
      </div>
    </Link>
  );
}

// ─── MAX (grid, sin ser featured) ────────────────────────────────────────────
export function DirectoryCardMax({ pro }: { pro: DirectoryPro }) {
  return (
    <Link
      href={`/card/${pro.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-800/30 bg-white dark:bg-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/5"
    >
      <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-500/20">
        <Star className="h-3 w-3" aria-hidden />
        Max
      </span>

      {pro.foto_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={pro.foto_url} alt="" className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-3xl font-semibold text-emerald-700 dark:text-emerald-300">
          {initials(pro)}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {pro.nombre} {pro.apellido}
        </h3>
        {pro.titulo && (
          <p className="mt-0.5 line-clamp-1 text-sm text-slate-600 dark:text-slate-400">{pro.titulo}</p>
        )}
        {pro.empresa && (
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-500">{pro.empresa}</p>
        )}

        <div className="mt-auto pt-4 space-y-2.5">
          {pro.ciudad && (
            <p className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {pro.ciudad}
            </p>
          )}
          <Socials redes={pro.redes} />
        </div>
      </div>
    </Link>
  );
}

// ─── PRO ──────────────────────────────────────────────────────────────────────
export function DirectoryCardPro({ pro }: { pro: DirectoryPro }) {
  return (
    <Link
      href={`/card/${pro.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md"
    >
      {pro.foto_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={pro.foto_url} alt="" className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-2xl font-semibold text-slate-500 dark:text-slate-400">
          {initials(pro)}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {pro.nombre} {pro.apellido}
        </h3>
        {pro.titulo && (
          <p className="mt-0.5 line-clamp-1 text-sm text-slate-600 dark:text-slate-400">{pro.titulo}</p>
        )}
        {pro.ciudad && (
          <p className="mt-auto pt-3 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {pro.ciudad}
          </p>
        )}
        <Socials redes={pro.redes} />
      </div>
    </Link>
  );
}

// ─── FREE (discreta, al final) ────────────────────────────────────────────────
export function DirectoryCardFree({ pro }: { pro: DirectoryPro }) {
  return (
    <Link
      href={`/card/${pro.slug}`}
      className="group flex items-center justify-between rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-3 transition-colors hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
          {pro.nombre} {pro.apellido}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

export function DirectoryCard({ pro, featured = false }: { pro: DirectoryPro; featured?: boolean }) {
  if (pro.tier === 'max') {
    return featured ? <DirectoryCardMaxFeatured pro={pro} /> : <DirectoryCardMax pro={pro} />;
  }
  if (pro.tier === 'pro') return <DirectoryCardPro pro={pro} />;
  return <DirectoryCardFree pro={pro} />;
}
