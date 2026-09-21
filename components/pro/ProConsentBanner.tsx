"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/pro/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProT, validLang } from '@/lib/pro/i18n';

const STORAGE_KEY = 'pro_consent';

export function ProConsentBanner() {
  const [visible, setVisible] = useState(false);
  const { currentLanguage } = useLanguage();
  const lang = validLang(currentLanguage);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage no disponible (modo privado): no mostramos el banner.
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('pro-consent-open', visible);
    return () => document.documentElement.classList.remove('pro-consent-open');
  }, [visible]);

  const decide = (analytics: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics, ts: Date.now() }));
    } catch {
      // Ignorar: si no podemos persistir, al menos cerramos el banner.
    }
    setVisible(false);
  };

  if (!visible) return null;

  const t = getProT(lang).consent;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t.ariaLabel}
      className="pro-banner-in fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-4 py-3 backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{t.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t.message}{' '}
            <Link
              href="/pro/politica-privacidad"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {t.learnMore}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button size="sm" variant="secondary" className="w-full sm:w-auto" onClick={() => decide(false)}>
            {t.reject}
          </Button>
          <Button size="sm" className="w-full sm:w-auto" onClick={() => decide(true)}>
            {t.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
