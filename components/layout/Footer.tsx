"use client";

import Link from "next/link";
import { Globe2, Mail, MapPin, Phone, ShoppingBag, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/useTranslation';

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

// Enlaces para categorías principales
const getMainCategories = (t: any) => [
  { name: t('footer.explore.home'), url: "/" },
  { name: t('footer.explore.products'), url: "/productos" },
  { name: t('footer.explore.foods'), url: "/comidas" },
  { name: t('footer.explore.boutique'), url: "/boutique" }
];

// Enlaces para subcategorías de productos
const getProductCategories = (t: any) => [
  { name: t('footer.popularProducts.flourAndDough'), url: "/productos/harina-masa" },
  { name: t('footer.popularProducts.saucesAndDressings'), url: "/productos/salsas-aderezos" },
  { name: t('footer.popularProducts.snacks'), url: "/productos/paquetes-snacks" }
];

// Enlaces para regiones gastronómicas
const getFoodRegions = (t: any) => [
  { name: t('footer.gastronomy.northAmerica'), url: "/comidas/norte-america" },
  { name: t('footer.gastronomy.centralAmerica'), url: "/comidas/centro-america" },
  { name: t('footer.gastronomy.southAmerica'), url: "/comidas/sur-america" }
];

// Enlaces para categorías de boutique
const getBoutiqueCategories = (t: any) => [
  { name: t('footer.boutique.clothing'), url: "/boutique/ropa" },
  { name: t('footer.boutique.accessories'), url: "/boutique/accesorios" },
  { name: t('footer.boutique.souvenirs'), url: "/boutique/souvenirs" }
];

// Enlaces para información corporativa
const getCompanyLinks = (t: any) => [
  { name: t('footer.company.aboutUs'), url: "/sobre-nosotros" },
  { name: t('footer.company.blog'), url: "/blog" },
  { name: t('footer.company.terms'), url: "/terminos" },
  { name: t('footer.company.privacy'), url: "/politicas" },
  { name: t('footer.company.shipping'), url: "/envios" },
  { name: t('footer.company.faq'), url: "/faq" }
];

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  const mainCategories = getMainCategories(t);
  const productCategories = getProductCategories(t);
  const foodRegions = getFoodRegions(t);
  const boutiqueCategories = getBoutiqueCategories(t);
  const companyLinks = getCompanyLinks(t);

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6" itemScope itemType="https://schema.org/WPFooter">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <Globe2 className="h-6 w-6 text-indigo-400 mr-2" />
              <h2 className="text-xl font-bold">{t('footer.about.title')}</h2>
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-4">
              {t('footer.about.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-full transition-colors duration-200"
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

          {/* Categorías principales */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">
              {t('footer.explore.title')}
            </h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    {t('footer.explore.home')}
                  </Link>
                </li>
                {mainCategories.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.url} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center"
                    >
                      <span className="mr-1">›</span> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>          {/* Productos Populares */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">
              {t('footer.popularProducts.title')}
            </h3>
            <nav>
              <ul className="space-y-2">
                {productCategories.map((cat, index) => (
                  <li key={index}>
                    <Link 
                      href={cat.url} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center"
                    >
                      <span className="mr-1">›</span> {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Gastronomía por Región */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">
              {t('footer.gastronomy.title')}
            </h3>            <nav>
              <ul className="space-y-2">
                {foodRegions.map((region, index) => (
                  <li key={index}>
                    <Link 
                      href={region.url} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center"
                    >
                      <span className="mr-1">›</span> {region.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    href="/blog/recetas" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center"
                  >
                    <span className="mr-1">›</span> {t('footer.gastronomy.authenticRecipes')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/productos/alimentos" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center"
                  >
                    <span className="mr-1">›</span> {t('footer.gastronomy.specialIngredients')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contacto e Información */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">
              {t('footer.contact.title')}
            </h3>
            <address className="not-italic" itemScope itemType="https://schema.org/Organization">
              <meta itemProp="name" content="Tout à un Clic LA" />
              <ul className="space-y-2">
                <li className="flex items-start text-sm md:text-base">
                  <MapPin className="h-5 w-5 text-indigo-400 mr-2 mt-0.5 flex-shrink-0" />                  <span className="text-gray-400" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    {t('footer.contact.address')}
                  </span>
                </li>
                <li className="flex items-center text-sm md:text-base">
                  <Phone className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                  <a href="tel:+15141234567" className="text-gray-400 hover:text-white transition-colors duration-200" itemProp="telephone">
                    {t('footer.contact.phone')}
                  </a>
                </li>
                <li className="flex items-center text-sm md:text-base">
                  <Mail className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                  <a href="mailto:info@toutaunclicla.com" className="text-gray-400 hover:text-white transition-colors duration-200" itemProp="email">
                    {t('footer.contact.email')}
                  </a>
                </li>
                <li className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent border-indigo-500 text-indigo-300 hover:bg-indigo-500 hover:text-white"
                    onClick={() => window.location.href = '/contacto'}
                  >
                    {t('footer.contact.contactNow')}
                  </Button>
                </li>
              </ul>
            </address>
          </div>
        </div>

        {/* Enlaces de Información */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {companyLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.url}
                className="text-gray-500 hover:text-indigo-300 text-sm transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>        {/* Cambiador de idioma y copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 sm:mb-0">
              <Link href="/es" className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">
                {t('footer.languages.spanish')}
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/fr" className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">
                {t('footer.languages.french')}
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/en" className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">
                {t('footer.languages.english')}
              </Link>
            </div>            <p className="text-gray-500 text-xs md:text-sm">
              {t('footer.copyright').replace('{year}', currentYear.toString())}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}