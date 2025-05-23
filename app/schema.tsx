'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

// Definición de tipos para los datos estructurados
type SchemaType = Record<string, any>;

// Datos de la organización
const organizationData: SchemaType = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://toutaunclicla.com/#organization",
  "name": "Tout à un Clic LA",
  "url": "https://toutaunclicla.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://toutaunclicla.com/logoaunclic.svg",
    "width": 180,
    "height": 60
  },
  "description": "Tienda online especializada en productos latinoamericanos auténticos en Montreal. Alimentos, artesanías, ropa y más con entrega a domicilio en Quebec y Canadá.",
  "sameAs": [
    "https://facebook.com/toutaunclicla",
    "https://instagram.com/toutaunclicla",
    "https://twitter.com/toutaunclicla",
    "https://youtube.com/toutaunclicla"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Rue Latino",
    "addressLocality": "Montreal",
    "addressRegion": "QC",
    "postalCode": "H1H 1H1",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.5017,
    "longitude": -73.5673
  },
  "telephone": "+15141234567",
  "email": "info@toutaunclicla.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://toutaunclicla.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Datos de la tienda local
const localBusinessData: SchemaType = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": "https://toutaunclicla.com/#store",
  "name": "Tout à un Clic LA - Tienda de Productos Latinoamericanos",
  "image": "https://toutaunclicla.com/store-image.jpg",
  "priceRange": "$$",
  "telephone": "+15141234567",
  "email": "info@toutaunclicla.com",
  "url": "https://toutaunclicla.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Rue Latino",
    "addressLocality": "Montreal",
    "addressRegion": "QC",
    "postalCode": "H1H 1H1",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.5017,
    "longitude": -73.5673
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday"],
      "opens": "10:00",
      "closes": "17:00"
    }
  ],
  "department": [
    {
      "@type": "Department",
      "name": "Alimentos",
      "description": "Productos alimenticios latinoamericanos"
    },
    {
      "@type": "Department",
      "name": "Artesanías",
      "description": "Artesanías tradicionales de América Latina"
    },
    {
      "@type": "Department",
      "name": "Ropa",
      "description": "Ropa y accesorios de estilo latinoamericano"
    }
  ],
  "currenciesAccepted": "CAD",
  "paymentAccepted": "Cash, Credit Card, Debit Card",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 45.5017,
      "longitude": -73.5673
    },
    "geoRadius": "50000"
  }
};

// Datos para el sitio web
const websiteData: SchemaType = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://toutaunclicla.com/#website",
  "url": "https://toutaunclicla.com",
  "name": "Tout à un Clic LA - Productos Latinoamericanos en Montreal",
  "description": "Tienda online de productos latinoamericanos en Montreal con envío a todo Quebec y Canadá",
  "inLanguage": ["es-ES", "fr-CA", "en-CA"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://toutaunclicla.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Datos para el e-commerce
const ecommerceSchema: SchemaType = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "Tout à un Clic LA",
  "url": "https://toutaunclicla.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://toutaunclicla.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "acceptsReservations": false,
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Catálogo de Productos Latinoamericanos",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Alimentos",
        "url": "https://toutaunclicla.com/productos/alimentos"
      },
      {
        "@type": "OfferCatalog",
        "name": "Artesanías",
        "url": "https://toutaunclicla.com/productos/artesanias"
      },
      {
        "@type": "OfferCatalog",
        "name": "Ropa",
        "url": "https://toutaunclicla.com/boutique/ropa"
      }
    ]
  }
};

// Datos de breadcrumbs
const getBreadcrumbSchema = (pathname: string): SchemaType => {
  // Dividir la ruta en segmentos
  const segments = pathname.split('/').filter(Boolean);
  
  // Crear los elementos de la lista de breadcrumbs
  const itemListElement = segments.map((segment, index) => {
    // Construir la URL para este nivel de breadcrumb
    const url = `/${segments.slice(0, index + 1).join('/')}`;
    
    // Obtener un nombre legible para cada segmento
    let name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    // Personalizar algunos nombres comunes
    if (segment === 'productos') name = 'Productos';
    if (segment === 'comidas') name = 'Comidas';
    if (segment === 'boutique') name = 'Boutique';
    
    return {
      "@type": "ListItem",
      "position": index + 2, // +2 porque la posición 1 es la página de inicio
      "name": name,
      "item": `https://toutaunclicla.com${url}`
    };
  });
  
  // Añadir la página de inicio al principio
  itemListElement.unshift({
    "@type": "ListItem",
    "position": 1,
    "name": "Inicio",
    "item": "https://toutaunclicla.com"
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://toutaunclicla.com/#breadcrumb",
    "name": "Breadcrumbs",
    "url": `https://toutaunclicla.com${pathname}`,
    "itemListElement": itemListElement
  };
};

export function StructuredData() {
  const pathname = usePathname();
  
  // Datos combinados para todas las páginas
  const allPagesSchema: SchemaType[] = [
    organizationData,
    websiteData,
    localBusinessData,
    ecommerceSchema
  ];
  
  // Agregar breadcrumbs si no es la página principal
  if (pathname !== '/') {
    allPagesSchema.push(getBreadcrumbSchema(pathname));
  }
  
  return (
    <Script 
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(allPagesSchema) }}
      strategy="afterInteractive"
    />
  );
}

// Exportar el componente por defecto
export default StructuredData; 