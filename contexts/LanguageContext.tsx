'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Language = 'es' | 'en' | 'fr';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  /** Alinea el estado en memoria sin persistir (cookie/localStorage intactos). */
  syncLanguage: (language: Language) => void;
  availableLanguages: { code: Language; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const availableLanguages = [
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
];

// Cookie legible por el server (SSR de /card/[slug], metadata OG, etc.)
const COOKIE_KEY = 'preferred-language';
const setLangCookie = (lang: Language) => {
  if (typeof document === 'undefined') return;
  // 1 año, todo el dominio, SameSite=Lax para no romper navegación normal
  document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
};

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export function LanguageProvider({ children, initialLanguage = 'es' }: LanguageProviderProps) {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLanguage);

  const setLanguage = useCallback(
    (language: Language) => {
      setCurrentLanguage(language);
      if (typeof window !== 'undefined') {
        localStorage.setItem(COOKIE_KEY, language);
        setLangCookie(language);
        document.documentElement.lang = language;
        // Refresca los server components (SSR) para que rehidraten con el idioma nuevo.
        router.refresh();
      }
    },
    [router],
  );

  // Alinea el estado sin escribir cookie/localStorage (p. ej. /pro default fr vía SSR).
  const syncLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, []);

  // Load saved language on mount + sincroniza cookie por si venía solo de localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(COOKIE_KEY) as Language;
      if (savedLanguage && availableLanguages.some((l) => l.code === savedLanguage)) {
        setCurrentLanguage(savedLanguage);
        setLangCookie(savedLanguage);
        document.documentElement.lang = savedLanguage;
      } else {
        document.documentElement.lang = initialLanguage;
      }
    }
  }, [initialLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        syncLanguage,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
