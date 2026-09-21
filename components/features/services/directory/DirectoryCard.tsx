"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Sparkles, ArrowUpRight } from 'lucide-react';
import type { DirectoryPro } from '@/lib/pro/endpoints';
import { socialIcon } from '@/components/pro/socialBrand';
import { useTranslation } from '@/hooks/useTranslation';

function initials(pro: DirectoryPro) {
  return `${(pro.nombre || '')[0] || ''}${(pro.apellido || '')[0] || ''}`.toUpperCase() || '?';
}

function Socials({ redes }: { redes?: DirectoryPro['redes'] }) {
  if (!redes || redes.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {redes.slice(0, 4).map((r) => {
        const Icon = socialIcon(r.plataforma);
        return (
          <span
            key={r.plataforma + r.url}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            title={r.plataforma}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
          </span>
        );
      })}
      {redes.length > 4 && (
        <span className="text-xs text-slate-400 dark:text-slate-500">+{redes.length - 4}</span>
      )}
    </div>
  );
}

type Variant = 'max' | 'pro' | 'free';

const PILL: Record<Variant, string> = {
  max: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
  pro: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  free: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
};

// Contenido compartido: foto 4:5 a la izquierda, info a la derecha. Idéntico en
// los tres tiers para un grid simétrico; lo que cambia es el borde y el pill.
function ProCardContent({
  pro,
  variant,
  clickable,
}: {
  pro: DirectoryPro;
  variant: Variant;
  clickable: boolean;
}) {
  const { t } = useTranslation();
  const isMax = variant === 'max';
  return (
    <>
      {pro.foto_url ? (
        <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl sm:w-28">
          <Image
            src={pro.foto_url}
            alt=""
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={`flex aspect-[4/5] w-24 shrink-0 items-center justify-center rounded-xl text-2xl font-semibold sm:w-28 ${
            isMax
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          {initials(pro)}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${PILL[variant]}`}
          >
            {isMax && <Star className="h-3 w-3" aria-hidden />}
            {isMax ? 'Max' : variant === 'pro' ? 'Pro' : 'Free'}
          </span>
          {isMax && pro.destacado && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3 w-3" aria-hidden />
              {t('pro.directory.featured')}
            </span>
          )}
        </div>

        <h3
          className={`mt-1.5 line-clamp-1 text-base font-semibold text-slate-900 dark:text-slate-100 ${
            clickable ? 'transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400' : ''
          }`}
        >
          {pro.nombre} {pro.apellido}
        </h3>
        {pro.titulo && (
          <p className="mt-0.5 line-clamp-1 text-sm text-slate-600 dark:text-slate-400">
            {pro.titulo}
            {pro.empresa && (
              <span className="text-slate-400 dark:text-slate-500"> · {pro.empresa}</span>
            )}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-3">
          {pro.ciudad && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {pro.ciudad}
            </span>
          )}
          <Socials redes={pro.redes} />
        </div>
      </div>

      {clickable && (
        <ArrowUpRight
          className="h-5 w-5 shrink-0 self-start text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:text-slate-600"
          aria-hidden
        />
      )}
    </>
  );
}

// ─── MAX — borde dorado+esmeralda iluminado ──────────────────────────────────
export function DirectoryCardMax({ pro }: { pro: DirectoryPro }) {
  return (
    <Link
      href={`/card/${pro.slug}`}
      className="pro-glow pro-glow-max group flex gap-4 rounded-2xl bg-white p-3 dark:bg-slate-900 sm:p-4"
    >
      <ProCardContent pro={pro} variant="max" clickable />
    </Link>
  );
}

// ─── PRO — borde esmeralda iluminado (más sobrio) ────────────────────────────
export function DirectoryCardPro({ pro }: { pro: DirectoryPro }) {
  return (
    <Link
      href={`/card/${pro.slug}`}
      className="pro-glow pro-glow-pro group flex gap-4 rounded-2xl bg-white p-3 dark:bg-slate-900 sm:p-4"
    >
      <ProCardContent pro={pro} variant="pro" clickable />
    </Link>
  );
}

// ─── FREE — misma tarjeta, borde neutro y SIN perfil público (no clicable) ───
// El perfil /card/:slug es de pago; Free aparece completo en el directorio pero
// no enlaza a ningún lado.
export function DirectoryCardFree({ pro }: { pro: DirectoryPro }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <ProCardContent pro={pro} variant="free" clickable={false} />
    </div>
  );
}

export function DirectoryCard({ pro }: { pro: DirectoryPro }) {
  if (pro.tier === 'max') return <DirectoryCardMax pro={pro} />;
  if (pro.tier === 'pro') return <DirectoryCardPro pro={pro} />;
  return <DirectoryCardFree pro={pro} />;
}
