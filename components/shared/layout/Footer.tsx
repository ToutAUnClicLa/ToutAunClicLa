"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

type Lang = 'es' | 'fr' | 'en';

const socialLinks = [
  {
    name: "Twitter",
    url: "https://twitter.com/toutaunclicla",
    icon: <Twitter className="h-5 w-5" />,
    ariaLabel: "Visita nuestro Twitter"
  },
  {
    name: "Instagram",
    url: "https://instagram.com/toutaunclicla",
    icon: <Instagram className="h-5 w-5" />,
    ariaLabel: "Síguenos en Instagram"
  },
  {
    name: "Facebook",
    url: "https://facebook.com/toutaunclicla",
    icon: <Facebook className="h-5 w-5" />,
    ariaLabel: "Visita nuestra página de Facebook"
  },
  {
    name: "YouTube",
    url: "https://youtube.com/toutaunclicla",
    icon: <Youtube className="h-5 w-5" />,
    ariaLabel: "Suscríbete a nuestro canal de YouTube"
  }
];

const getMainCategories = (t: (key: string) => string) => [
  { name: t('footer.explore.home'), url: "/" },
  { name: t('footer.explore.foods'), url: "/comidas" },
  { name: t('nav.services'), url: "/servicios" },
  { name: t('footer.explore.boutique'), url: "/boutique" }
];

const getCompanyLinks = (t: (key: string) => string) => [
  { name: t('footer.company.aboutUs'), url: "/sobre-nosotros" },
  { name: t('footer.company.blog'), url: "/blog" },
  { name: t('footer.company.terms'), url: "/terminos" },
  { name: t('footer.company.privacy'), url: "/politicas" },
  { name: t('footer.company.faq'), url: "/faq" }
];

const FOOTER_LANGS: { code: Lang; key: string }[] = [
  { code: 'es', key: 'footer.languages.spanish' },
  { code: 'fr', key: 'footer.languages.french' },
  { code: 'en', key: 'footer.languages.english' },
];

export function Footer() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguage();
  const currentYear = new Date().getFullYear();

  const mainCategories = getMainCategories(t);
  const companyLinks = getCompanyLinks(t);

  const isDashboardRoute = (pathname?.startsWith('/restaurante') && pathname !== '/restaurante/login') ||
    (pathname?.startsWith('/admin') && pathname !== '/admin/login') ||
    pathname?.startsWith('/factura');

  if (isDashboardRoute) {
    return null;
  }

  const link = cn(
    "text-white/75 hover:text-white text-sm inline-flex min-h-11 items-center",
    shopChrome.focusOnPurple,
  );

  return (
    <footer className="bg-[var(--shop-purple)] text-white" itemScope itemType="https://schema.org/WPFooter">
      <div className="container pt-16 pb-10 sm:pt-20">
        <div className="mb-12 flex items-center">
          <img
                src="/logotoutaunclic.png"
                alt=""
                className="h-[60px] w-[60px] shrink- rounded-full"
                width="60"
                height="60"
              /> 
          <p className={shopChrome.wordmark}>
            <span className="text-sm font-medium text-white whitespace-nowrap sm:text-[15px]">Tout à un</span>
            <span className="text-sm font-bold text-white whitespace-nowrap sm:text-[15px]">Clic Là</span>
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16 md:items-start">
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">
              {t('footer.about.title')}
            </h3>
            <p className="text-white/75 text-sm mb-5 leading-relaxed">
              {t('footer.about.description')}
            </p>
            <div className="flex space-x-1">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white",
                    shopChrome.tap,
                    shopChrome.focusOnPurple,
                  )}
                  aria-label={social.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                  itemProp="sameAs"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">
              {t('footer.explore.title')}
            </h3>
            <nav>
              <ul className="space-y-0.5">
                {mainCategories.map((item, index) => (
                  <li key={index}>
                    <Link href={item.url} className={link}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">
              {t('footer.contact.title')}
            </h3>
            <address className="not-italic" itemScope itemType="https://schema.org/Organization">
              <meta itemProp="name" content="Tout à un Clic LA" />
              <ul className="space-y-3">
                <li className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 text-white/70 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-white/75" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    {t('footer.contact.address')}
                  </span>
                </li>
                <li className="flex min-w-0 items-center text-sm">
                  <Mail className="h-4 w-4 text-white/70 mr-2 flex-shrink-0" />
                  <a href="mailto:serviceclient@toutaunclicla.com" className={cn(link, 'block min-w-0 max-w-full break-all')} itemProp="email">
                    {t('footer.contact.email')}
                  </a>
                </li>
                <li className="mt-3">
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-11 min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-[var(--shop-purple)] hover:bg-white/90",
                      shopChrome.focusOnPurple,
                    )}
                    onClick={() => window.open('https://wa.me/14384626255?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20productos%20y%20servicios.', '_blank')}
                  >
                    {t('footer.contact.contactNow')}
                  </button>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {companyLinks.map((item, index) => (
              <Link key={index} href={item.url} className={link}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-white/20 mt-6 pt-6">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
              <div className="flex items-center gap-1" role="group" aria-label="Language">
                {FOOTER_LANGS.map((lang, i) => {
                  const active = currentLanguage === lang.code;
                  return (
                    <span key={lang.code} className="flex items-center">
                      {i > 0 && <span className="mx-1 text-white/30" aria-hidden>|</span>}
                      <button
                        type="button"
                        onClick={() => setLanguage(lang.code)}
                        aria-pressed={active}
                        lang={lang.code}
                        className={cn(
                          "inline-flex min-h-11 items-center px-1 text-sm",
                          shopChrome.focusOnPurple,
                          active ? "font-semibold text-white" : "text-white/70 hover:text-white",
                        )}
                      >
                        {t(lang.key)}
                      </button>
                    </span>
                  );
                })}
              </div>

              <div className="flex space-x-4 items-center">
                <Link href="/admin" className={cn("text-white/70 hover:text-white text-xs inline-flex min-h-11 items-center gap-1", shopChrome.focusOnPurple)}>
                  <span>{t('portals.footer.admin')}</span>
                </Link>
                <span className="text-white/30">|</span>
                <Link href="/restaurante" className={cn("text-white/70 hover:text-white text-xs inline-flex min-h-11 items-center gap-1", shopChrome.focusOnPurple)}>
                  <span>{t('portals.footer.restaurantAdmin')}</span>
                </Link>
              </div>
            </div>

            <p className="text-white/70 text-xs md:text-sm text-center">
              {t('footer.copyright').replace('{year}', currentYear.toString())}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
