"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/pro/ui/button';
import { getProT, validLang, type Lang } from '@/lib/pro/i18n';

const STORAGE_KEY = 'pro_consent';

// Lee el idioma del mismo modo que los server components de /pro: cookie
// 'preferred-language', default fr. Se hace en cliente para evitar mismatch.
function readLang(): Lang {
  if (typeof document === 'undefined') return 'fr';
  const match = document.cookie.match(/(?:^|;\s*)preferred-language=([^;]+)/);
  return validLang(match?.[1]);
}

export function ProConsentBanner() {
  // Oculto por defecto: evita hydration mismatch (localStorage solo en cliente).
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setLang(readLang());
        setVisible(true);
      }
    } catch {
      // localStorage no disponible (modo privado): no mostramos el banner.
    }
  }, []);

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
      className="pro-banner-in fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-[14px] border border-border bg-card p-4 shadow-[var(--shadow-lg)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:left-auto"
    >
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
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          size="sm"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => decide(false)}
        >
          {t.reject}
        </Button>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => decide(true)}>
          {t.accept}
        </Button>
      </div>
    </div>
  );
}
