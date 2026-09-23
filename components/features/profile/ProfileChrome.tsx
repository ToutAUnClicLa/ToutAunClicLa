"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { shopChrome } from '@/lib/shop-theme';
import { PROFILE } from '@/lib/shop-profile';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

export function ProfileBackLink() {
  const pathname = usePathname();
  const { t } = useTranslation();
  if (!pathname || pathname === PROFILE.root) return null;
  return (
    <Link
      href={PROFILE.root}
      className={cn(
        'mb-5 inline-flex h-11 items-center gap-1.5 text-sm font-medium text-[var(--shop-ink)]',
        shopChrome.focus
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {t('profile.navigation.profile')}
    </Link>
  );
}

export function ProfilePageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--shop-ink)] sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--shop-muted)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function Bone({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-[var(--shop-hairline)]', className)} />;
}

function SkeletonHeader() {
  return (
    <div className="mb-6 sm:mb-8">
      <Bone className="h-8 w-48" />
      <Bone className="mt-2 h-4 w-72 max-w-full" />
    </div>
  );
}

export function ProfileCard({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-[var(--shop-hairline)] bg-white', className)}>
      {children}
    </div>
  );
}

export function profileCtaClass() {
  return cn('h-11 min-h-11 px-5 py-2.5', shopChrome.inkCta);
}

export function profileOutlineClass() {
  return cn(
    'inline-flex h-11 min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--shop-hairline)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--shop-ink)] hover:bg-[var(--shop-canvas-muted)]',
    shopChrome.focus
  );
}

export function ProfileHubSkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <ProfileCard className="mb-6 flex items-center gap-4 p-5">
        <Bone className="h-16 w-16 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Bone className="h-4 w-40" />
          <Bone className="h-3 w-56 max-w-full" />
        </div>
      </ProfileCard>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <ProfileCard key={i} className="flex items-center gap-3 p-4">
            <Bone className="h-10 w-10 shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-4 w-28" />
              <Bone className="h-3 w-40 max-w-full" />
            </div>
          </ProfileCard>
        ))}
      </div>
    </div>
  );
}

export function ProfileFavoritesSkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProfileCard key={i} className={cn('p-4', i === 2 && 'col-span-2 sm:col-span-1')}>
            <Bone className="h-6 w-10" />
            <Bone className="mt-2 h-3 w-16" />
          </ProfileCard>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProfileCard key={i} className="flex gap-4 p-4">
            <Bone className="h-20 w-20 shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-4 w-2/3" />
              <Bone className="h-3 w-1/3" />
              <Bone className="h-11 w-28 rounded-full" />
            </div>
          </ProfileCard>
        ))}
      </div>
    </div>
  );
}

export function ProfileAddressesSkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <div className="mb-6 grid grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <ProfileCard key={i} className="p-4">
            <Bone className="h-6 w-10" />
            <Bone className="mt-2 h-3 w-20" />
          </ProfileCard>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <ProfileCard key={i} className="space-y-2 p-5">
            <Bone className="h-4 w-40" />
            <Bone className="h-3 w-64 max-w-full" />
            <Bone className="h-3 w-48" />
          </ProfileCard>
        ))}
      </div>
    </div>
  );
}

export function ProfileOrdersSkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <ProfileCard className="mb-6 h-11" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProfileCard key={i} className="space-y-3 p-5">
            <div className="flex justify-between gap-3">
              <Bone className="h-4 w-32" />
              <Bone className="h-4 w-20" />
            </div>
            <Bone className="h-12 w-full" />
            <Bone className="h-11 w-36 rounded-full" />
          </ProfileCard>
        ))}
      </div>
    </div>
  );
}

export function ProfileOrderDetailSkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileCard className="space-y-3 p-5">
            <Bone className="h-4 w-32" />
            <Bone className="h-16 w-full" />
            <Bone className="h-16 w-full" />
          </ProfileCard>
          <ProfileCard className="space-y-2 p-5">
            <Bone className="h-4 w-40" />
            <Bone className="h-3 w-56" />
            <Bone className="h-3 w-40" />
          </ProfileCard>
        </div>
        <div className="space-y-6">
          <ProfileCard className="space-y-2 p-5">
            <Bone className="h-4 w-36" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-full" />
            <Bone className="h-4 w-24" />
          </ProfileCard>
          <ProfileCard className="p-5">
            <Bone className="h-11 w-full rounded-full" />
          </ProfileCard>
        </div>
      </div>
    </div>
  );
}

export function ProfileSettingsSkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <div className="grid gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <ProfileCard key={i} className="space-y-3 p-5">
            <Bone className="h-4 w-32" />
            <Bone className="h-11 w-full rounded-full" />
            <Bone className="h-3 w-2/3" />
          </ProfileCard>
        ))}
      </div>
    </div>
  );
}

export function ProfileSecuritySkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProfileCard key={i} className="space-y-3 p-5">
            <Bone className="h-4 w-40" />
            <Bone className="h-11 w-full" />
            <Bone className="h-11 w-full" />
            <Bone className="h-11 w-32 rounded-full" />
          </ProfileCard>
        ))}
      </div>
    </div>
  );
}
