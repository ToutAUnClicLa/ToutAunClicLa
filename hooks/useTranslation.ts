import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import es from '@/translations/es';
import fr from '@/translations/fr';
import en from '@/translations/en';

const translations = {
  es,
  fr,
  en
};

type TranslationType = typeof translations.es;

export function useTranslation() {
  const { currentLanguage } = useLanguage();
  
  const t = useCallback(<T = string>(key: string, params?: Record<string, any>): T => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key as T; // Retorna la key si no encuentra la traducción
      }
    }
    
    // Si hay parámetros y el valor es una cadena, realizar interpolación
    if (params && typeof value === 'string') {
      Object.keys(params).forEach(param => {
        const regex = new RegExp(`\\{${param}\\}`, 'g');
        value = value.replace(regex, params[param]);
      });
    }
    
    return value as T;
  }, [currentLanguage]);

  return { t, locale: currentLanguage };
}