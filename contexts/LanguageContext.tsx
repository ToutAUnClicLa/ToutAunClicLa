'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en' | 'fr';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  availableLanguages: { code: Language; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const availableLanguages = [
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
];

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    // Optionally save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', language);
    }
  };

  // Load saved language on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language') as Language;
      if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
        setCurrentLanguage(savedLanguage);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
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
