"use client";

import Link from "next/link";
import { Globe2, Mail, MapPin, Phone, ShoppingBag, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

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
const mainCategories = [
  { name: "Inicio", url: "/" },
  { name: "Productos", url: "/productos" },
  { name: "Comidas", url: "/comidas" },
  { name: "Boutique", url: "/boutique" }
];

// Enlaces para subcategorías de productos
const productCategories = [
  { name: "Harina y Masa", url: "/productos/harina-masa" },
  { name: "Salsas y Aderezos", url: "/productos/salsas-aderezos" },
  { name: "Paquetes y Snacks", url: "/productos/paquetes-snacks" }
];

// Enlaces para regiones gastronómicas
const foodRegions = [
  { name: "Norte América", url: "/comidas/norte-america", altFr: "Amérique du Nord", altEn: "North America" },
  { name: "Centro América", url: "/comidas/centro-america", altFr: "Amérique Centrale", altEn: "Central America" },
  { name: "Sur América", url: "/comidas/sur-america", altFr: "Amérique du Sud", altEn: "South America" }
];

// Enlaces para categorías de boutique
const boutiqueCategories = [
  { name: "Ropa", url: "/boutique/ropa", altFr: "Vêtements", altEn: "Clothing" },
  { name: "Accesorios", url: "/boutique/accesorios", altFr: "Accessoires", altEn: "Accessories" },
  { name: "Souvenirs", url: "/boutique/souvenirs", altFr: "Souvenirs", altEn: "Souvenirs" }
];

// Enlaces para información corporativa
const companyLinks = [
  { name: "Quiénes Somos", url: "/sobre-nosotros" },
  { name: "Blog Latino", url: "/blog" },
  { name: "Términos y Condiciones", url: "/terminos" },
  { name: "Política de Privacidad", url: "/politicas" },
  { name: "Política de Envíos", url: "/envios" },
  { name: "Preguntas Frecuentes", url: "/faq" }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6" itemScope itemType="https://schema.org/WPFooter">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <Globe2 className="h-6 w-6 text-indigo-400 mr-2" />
              <h2 className="text-xl font-bold">Tout à un Clic LA</h2>
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-4">
              Conectando las Américas a través de productos auténticos y experiencias únicas. Entrega en todo Montreal, Quebec y Canadá.
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
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">Explorar</h3>
            <nav>
              <ul className="space-y-2">
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
          </div>

          {/* Productos Populares */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">Productos Populares</h3>
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
                {boutiqueCategories.map((cat, index) => (
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
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">Gastronomía</h3>
            <nav>
              <ul className="space-y-2">
                {foodRegions.map((region, index) => (
                  <li key={index}>
                    <Link 
                      href={region.url} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center"
                      title={`${region.altFr} | ${region.altEn}`}
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
                    <span className="mr-1">›</span> Recetas Auténticas
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/productos/alimentos" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center"
                  >
                    <span className="mr-1">›</span> Ingredientes Especiales
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contacto e Información */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">Contacto</h3>
            <address className="not-italic" itemScope itemType="https://schema.org/Organization">
              <meta itemProp="name" content="Tout à un Clic LA" />
              <ul className="space-y-2">
                <li className="flex items-start text-sm md:text-base">
                  <MapPin className="h-5 w-5 text-indigo-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <span itemProp="streetAddress">123 Rue Latino</span>, 
                    <span itemProp="addressLocality"> Montreal</span>, 
                    <span itemProp="addressRegion"> QC</span> 
                    <span itemProp="postalCode">H1H 1H1</span>, 
                    <span itemProp="addressCountry"> Canadá</span>
                  </span>
                </li>
                <li className="flex items-center text-sm md:text-base">
                  <Phone className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                  <a href="tel:+15141234567" className="text-gray-400 hover:text-white transition-colors duration-200" itemProp="telephone">
                    +1 (514) 123-4567
                  </a>
                </li>
                <li className="flex items-center text-sm md:text-base">
                  <Mail className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                  <a href="mailto:info@toutaunclicla.com" className="text-gray-400 hover:text-white transition-colors duration-200" itemProp="email">
                    info@toutaunclicla.com
                  </a>
                </li>
                <li className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent border-indigo-500 text-indigo-300 hover:bg-indigo-500 hover:text-white"
                    onClick={() => window.location.href = '/contacto'}
                  >
                    Contactar Ahora
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
        </div>

        {/* Cambiador de idioma y copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 sm:mb-0">
              <Link href="/es" className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">
                Español
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/fr" className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">
                Français
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/en" className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">
                English
              </Link>
            </div>
            <p className="text-gray-500 text-xs md:text-sm">
              © {currentYear} Tout à un Clic LA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}