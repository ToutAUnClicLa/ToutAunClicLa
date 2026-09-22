"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ProLogo } from '@/components/pro/ProLogo';
import { ProLangSwitcher } from '@/components/pro/ProLangSwitcher';
import { ProHeaderUserSkeleton, useProHeaderAccountLoading } from '@/components/pro/ProHeaderUserSkeleton';
import { Button } from '@/components/pro/ui/button';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { proUser, loading, logout } = useProAuth();
  const accountLoading = useProHeaderAccountLoading();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && (!proUser || !proUser.verificado)) {
      router.replace('/pro');
    }
  }, [loading, proUser, router]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-5">
          <Link href="/pro/dashboard" className="min-w-0" aria-label="Tout à un Clic Là Pro">
            <ProLogo />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <ProLangSwitcher />
            {accountLoading ? (
              <ProHeaderUserSkeleton />
            ) : proUser ? (
              <div className="hidden items-center gap-2 sm:flex">
                {proUser.foto_url ? (
                  <Image
                    src={proUser.foto_url}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {(proUser.nombre || '?').slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium text-foreground">
                  {`${proUser.nombre} ${proUser.apellido || ''}`.trim()}
                </span>
              </div>
            ) : null}
            <Button
              variant="secondary"
              size="sm"
              aria-label={t('pro.dashboard.logout')}
              disabled={!proUser}
              onClick={async () => {
                await logout();
                router.replace('/pro');
              }}
            >
              <LogOut className="h-4 w-4 sm:hidden" aria-hidden />
              <span className="hidden sm:inline">{t('pro.dashboard.logout')}</span>
            </Button>
          </div>
        </div>
      </header>
      {loading || !proUser ? (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6" aria-busy="true">
          <div className="pro-skeleton h-8 w-56" />
          <div className="mt-2 pro-skeleton h-4 w-72 max-w-full" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pro-card">
                <div className="pro-skeleton h-10 w-10" />
                <div className="pro-skeleton mt-4 h-4 w-32" />
                <div className="pro-skeleton mt-2 h-3 w-full" />
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      )}
    </div>
  );
}
