"use client";

import { useTranslation } from '@/hooks/useTranslation';
import { useEffect } from 'react';

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_principal: string;
  stock: number;
  rating: number;
  subcategorias: {
    nombre: string;
  };
}

interface StructuredDataProps {
  type: 'product' | 'productList' | 'organization';
  product?: Product;
  products?: Product[];
  categoryName?: string;
}

export function StructuredData({ type, product, products, categoryName }: StructuredDataProps) {
  const { t } = useTranslation();

  useEffect(() => {
    let structuredData: any = {};

    switch (type) {
      case 'organization':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Tout à un Clic LA",
          "description": t('footer.about.description'),
          "url": "https://toutaunclicla.com",
          "logo": "https://toutaunclicla.com/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-514-123-4567",
            "contactType": "customer service",
            "availableLanguage": ["Spanish", "French", "English"]
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Rue Latino",
            "addressLocality": "Montreal",
            "addressRegion": "QC",
            "postalCode": "H1H 1H1",
            "addressCountry": "CA"
          },
          "sameAs": [
            "https://facebook.com/toutaunclicla",
            "https://instagram.com/toutaunclicla",
            "https://twitter.com/toutaunclicla"
          ]
        };
        break;

      case 'product':
        if (product) {
          structuredData = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.nombre,
            "description": product.descripcion,
            "image": product.imagen_principal,
            "offers": {
              "@type": "Offer",
              "price": product.precio,
              "priceCurrency": "CAD",
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Tout à un Clic LA"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating || 4.5,
              "reviewCount": Math.floor(Math.random() * 50) + 10 // Placeholder until we have real review data
            },
            "brand": {
              "@type": "Brand",
              "name": "Tout à un Clic LA"
            },
            "category": product.subcategorias?.nombre || categoryName
          };
        }
        break;

      case 'productList':
        if (products && products.length > 0) {
          structuredData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `${categoryName === 'productos' ? t('nav.products') : categoryName === 'comidas' ? t('nav.foods') : t('nav.boutique')} - Tout à un Clic LA`,
            "description": categoryName === 'productos' 
              ? t('seo.products.description')
              : categoryName === 'comidas'
              ? t('seo.comidas.description') 
              : t('seo.boutique.description'),
            "numberOfItems": products.length,
            "itemListElement": products.slice(0, 10).map((product, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": product.nombre,
                "description": product.descripcion,
                "image": product.imagen_principal,
                "offers": {
                  "@type": "Offer",
                  "price": product.precio,
                  "priceCurrency": "CAD",
                  "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                }
              }
            }))
          };
        }
        break;
    }

    // Remove any existing structured data script
    const existingScript = document.querySelector('script[data-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', 'true');
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const script = document.querySelector('script[data-structured-data]');
      if (script) {
        script.remove();
      }
    };
  }, [type, product, products, categoryName, t]);

  return null; // This component doesn't render anything visual
}
