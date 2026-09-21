"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const COOKIE_KEY = 'preferred-language';

// El contexto global de idioma arranca en 'es' (default del e-commerce), pero
// /servicios es el directorio profesional (Loi 96: francés primero en
// Quebec). Si el visitante no tiene preferencia guardada, alineamos el estado
// en memoria a 'fr' — sin persistir nada: la preferencia solo se guarda
// cuando el usuario elige explícitamente un idioma con el selector.
export function ServiciosLangSync() {
  const { syncLanguage } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (saved) return; // ya hay preferencia explícita del usuario
    syncLanguage('fr');
  }, [syncLanguage]);

  return null;
}
