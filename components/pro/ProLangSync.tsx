"use client";

import { useLayoutEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Lang } from '@/lib/pro/i18n';

const COOKIE_KEY = 'preferred-language';

// El contexto global arranca con cookie / x-app-lang (middleware: /pro → fr si no hay cookie).
// Si el usuario ya eligió idioma en localStorage, el provider lo aplica; si no, alineamos
// con el idioma que el server ya renderizó — sin persistir.
export function ProLangSync({ ssrLang }: { ssrLang: Lang }) {
  const { syncLanguage } = useLanguage();

  useLayoutEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (saved === 'en' || saved === 'es' || saved === 'fr') return;
    syncLanguage(ssrLang);
  }, [ssrLang, syncLanguage]);

  return null;
}
