// Helper de i18n para server components (que no pueden usar useTranslation).
import es from '@/translations/es';
import en from '@/translations/en';
import fr from '@/translations/fr';

export type Lang = 'fr' | 'en' | 'es';

const DICTS = { fr, en, es } as const;

// Devuelve las cadenas del módulo Pro para el idioma pedido, con fallback a fr.
export function getProT(lang: Lang) {
  const dict = DICTS[lang] || DICTS.fr;
  return {
    directory: dict.pro.directory,
    card: dict.pro.card,
    landing: dict.pro.landing,
    consent: dict.pro.consent,
    privacy: dict.pro.privacy,
    header: dict.pro.header,
    auth: dict.pro.auth,
    dashboard: dict.pro.dashboard,
    pricingPage: dict.pro.pricingPage,
  };
}

export const validLang = (l?: string | null): Lang =>
  l === 'en' || l === 'es' ? l : 'fr';
