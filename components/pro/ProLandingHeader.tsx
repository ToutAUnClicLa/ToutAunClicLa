"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ProLogo } from '@/components/pro/ProLogo';
import { ProLangSwitcher } from '@/components/pro/ProLangSwitcher';
import { ProHeaderUserSkeleton, useProHeaderAccountLoading } from '@/components/pro/ProHeaderUserSkeleton';
import { Button } from '@/components/pro/ui/button';

export function ProLandingHeader() {
  const { proUser } = useProAuth();
  const accountLoading = useProHeaderAccountLoading();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  // Borde inferior hairline que aparece solo al hacer scroll (listener pasivo).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-card/90 backdrop-blur transition-[border-color] duration-200 ${
        scrolled ? 'border-border' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-5">
        <Link href="/pro" className="min-w-0" aria-label="Tout à un Clic Là Pro">
          <ProLogo />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ProLangSwitcher />

          {accountLoading ? (
            <ProHeaderUserSkeleton />
          ) : proUser ? (
            <Link href="/pro/dashboard" className="flex items-center gap-3">
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
              <Button size="sm">{t('pro.header.dashboard')}</Button>
            </Link>
          ) : (
            <Link
              href="/pro/login"
              className="inline-flex min-h-11 items-center whitespace-nowrap text-sm font-medium text-foreground hover:text-primary"
            >
              {t('pro.header.signIn')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
