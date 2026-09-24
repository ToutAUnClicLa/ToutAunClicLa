"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Sparkles, ArrowUpRight } from 'lucide-react';
import type { DirectoryPro } from '@/lib/pro/endpoints';
import { socialIcon } from '@/components/pro/socialBrand';
import { useTranslation } from '@/hooks/useTranslation';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

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
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--shop-hairline)] text-[var(--shop-muted)]"
            title={r.plataforma}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
          </span>
        );
      })}
      {redes.length > 4 && (
        <span className="text-xs text-[var(--shop-muted)]">+{redes.length - 4}</span>
      )}
    </div>
  );
}

type Variant = 'max' | 'pro' | 'free';

const PILL: Record<Variant, string> = {
  max: 'border-[var(--shop-hairline)] bg-[var(--food-wash)] text-[var(--food-ink)]',
  pro: 'border-[var(--shop-purple-muted)] bg-[var(--shop-purple-wash)] text-[var(--svc-ink)]',
  free: 'border-[var(--shop-hairline)] bg-white text-[var(--shop-muted)]',
};

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
        <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--shop-hairline)] sm:w-28">
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
          className={cn(
            'flex aspect-[4/5] w-24 shrink-0 items-center justify-center rounded-xl border border-[var(--shop-hairline)] text-2xl font-semibold sm:w-28',
            isMax
              ? 'bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]'
              : 'bg-[var(--shop-canvas-muted)] text-[var(--shop-muted)]',
          )}
        >
          {initials(pro)}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              PILL[variant],
            )}
          >
            {isMax && <Star className="h-3 w-3" aria-hidden />}
            {isMax ? 'Max' : variant === 'pro' ? 'Pro' : 'Free'}
          </span>
          {isMax && pro.destacado && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--food-ink)]">
              <Sparkles className="h-3 w-3" aria-hidden />
              {t('pro.directory.featured')}
            </span>
          )}
        </div>

        <h3
          className={cn(
            'mt-1.5 line-clamp-1 text-base font-semibold text-[var(--shop-ink)]',
            clickable && 'transition-colors group-hover:text-[var(--shop-purple)]',
          )}
        >
          {pro.nombre} {pro.apellido}
        </h3>
        {pro.titulo && (
          <p className="mt-0.5 line-clamp-1 text-sm text-[var(--shop-muted)]">
            {pro.titulo}
            {pro.empresa && (
              <span className="text-gray-400"> · {pro.empresa}</span>
            )}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-3">
          {pro.ciudad && (
            <span className="inline-flex items-center gap-1 text-xs text-[var(--shop-muted)]">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {pro.ciudad}
            </span>
          )}
          <Socials redes={pro.redes} />
        </div>
      </div>

      {clickable && (
        <ArrowUpRight
          className="h-5 w-5 shrink-0 self-start text-[var(--shop-hairline)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--shop-purple)]"
          aria-hidden
        />
      )}
    </>
  );
}

const paidCard =
  'pro-glow group flex gap-4 rounded-xl bg-white p-3 sm:p-4';

export function DirectoryCardMax({ pro }: { pro: DirectoryPro }) {
  return (
    <Link href={`/card/${pro.slug}`} className={cn(paidCard, 'pro-glow-max', shopChrome.focus)}>
      <ProCardContent pro={pro} variant="max" clickable />
    </Link>
  );
}

export function DirectoryCardPro({ pro }: { pro: DirectoryPro }) {
  return (
    <Link href={`/card/${pro.slug}`} className={cn(paidCard, 'pro-glow-pro', shopChrome.focus)}>
      <ProCardContent pro={pro} variant="pro" clickable />
    </Link>
  );
}

export function DirectoryCardFree({ pro }: { pro: DirectoryPro }) {
  return (
    <div className="flex gap-4 rounded-xl border border-[var(--shop-hairline)] bg-white p-3 sm:p-4">
      <ProCardContent pro={pro} variant="free" clickable={false} />
    </div>
  );
}

export function DirectoryCard({ pro }: { pro: DirectoryPro }) {
  if (pro.tier === 'max') return <DirectoryCardMax pro={pro} />;
  if (pro.tier === 'pro') return <DirectoryCardPro pro={pro} />;
  return <DirectoryCardFree pro={pro} />;
}
