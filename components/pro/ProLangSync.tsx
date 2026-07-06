"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const COOKIE_KEY = 'preferred-language';

const readCookieLang = (): string | null => {
  const match = document.cookie.match(/(?:^|;\s*)preferred-language=(\w+)/);
  return match ? match[1] : null;
};

// El contexto global de idioma arranca en 'es' (default del e-commerce), pero el
// SSR de /pro usa 'fr' (Loi 96). Si el visitante no tiene preferencia guardada,
// alineamos el estado en memoria con lo que el server ya renderizó — sin
// persistir nada: la preferencia solo se guarda cuando el usuario elige.
export function ProLangSync() {
  const { syncLanguage } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (saved) return; // el efecto del provider ya lo aplica
    const cookieLang = readCookieLang();
    const effective = cookieLang === 'en' || cookieLang === 'es' ? cookieLang : 'fr';
    syncLanguage(effective);
  }, [syncLanguage]);

  return null;
}
