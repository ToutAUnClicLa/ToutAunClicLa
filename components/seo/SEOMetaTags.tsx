"use client";

import { useTranslation } from '@/hooks/useTranslation';
import { useEffect } from 'react';

interface SEOMetaTagsProps {
  page: 'products' | 'comidas' | 'boutique' | 'product';
  product?: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_principal: string;
    subcategorias: {
      nombre: string;
    };
  };
  categoryName?: string;
}

export function SEOMetaTags({ page, product, categoryName }: SEOMetaTagsProps) {
  const { t } = useTranslation();

  useEffect(() => {
    // Remove existing meta tags
    const existingTags = document.querySelectorAll('meta[data-seo-generated]');
    existingTags.forEach(tag => tag.remove());

    // Common meta tags
    const metaTags = [];

    if (page === 'product' && product) {
      // Product-specific meta tags
      metaTags.push(
        { property: 'og:type', content: 'product' },
        { property: 'og:title', content: product.nombre },
        { property: 'og:description', content: product.descripcion },
        { property: 'og:image', content: product.imagen_principal },
        { property: 'og:url', content: `https://toutaunclicla.com/${categoryName}/${product.id}` },
        { property: 'product:price:amount', content: product.precio.toString() },
        { property: 'product:price:currency', content: 'CAD' },
        { property: 'product:availability', content: 'in stock' },
        { property: 'product:category', content: product.subcategorias.nombre },
        { name: 'twitter:card', content: 'product' },
        { name: 'twitter:site', content: '@toutaunclicla' },
        { name: 'twitter:title', content: product.nombre },
        { name: 'twitter:description', content: product.descripcion },
        { name: 'twitter:image', content: product.imagen_principal },
        { name: 'twitter:label1', content: 'Price' },
        { name: 'twitter:data1', content: `$${product.precio} CAD` },
        { name: 'twitter:label2', content: 'Category' },
        { name: 'twitter:data2', content: product.subcategorias.nombre }
      );
    } else {
      // Category pages meta tags
      const seoKey = page === 'products' ? 'products' : page;
      metaTags.push(
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: t(`seo.${seoKey}.title`) },
        { property: 'og:description', content: t(`seo.${seoKey}.description`) },
        { property: 'og:image', content: 'https://toutaunclicla.com/fondoEscritorio.png' },
        { property: 'og:url', content: `https://toutaunclicla.com/${page}` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@toutaunclicla' },
        { name: 'twitter:title', content: t(`seo.${seoKey}.title`) },
        { name: 'twitter:description', content: t(`seo.${seoKey}.description`) },
        { name: 'twitter:image', content: 'https://toutaunclicla.com/fondoEscritorio.png' }
      );
    }

    // Common meta tags for all pages
    metaTags.push(
      { name: 'author', content: 'Tout à un Clic LA' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'bingbot', content: 'index, follow' },
      { name: 'theme-color', content: '#6366f1' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:site_name', content: 'Tout à un Clic LA' },
      { property: 'og:locale', content: 'es_CA' },
      { property: 'og:locale:alternate', content: 'en_CA' },
      { property: 'og:locale:alternate', content: 'fr_CA' }
    );

    // Create and append meta tags
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('data-seo-generated', 'true');
      
      if (tag.name) {
        meta.name = tag.name;
      }
      if (tag.property) {
        meta.setAttribute('property', tag.property);
      }
      meta.content = tag.content;
      
      document.head.appendChild(meta);
    });

    // Add canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    
    if (page === 'product' && product && categoryName) {
      canonicalLink.setAttribute('href', `https://toutaunclicla.com/${categoryName}/${product.id}`);
    } else {
      canonicalLink.setAttribute('href', `https://toutaunclicla.com/${page}`);
    }

    // Add hreflang tags for multilingual SEO
    const languages = ['es', 'en', 'fr'];
    languages.forEach(lang => {
      let hrefLang = document.querySelector(`link[hreflang="${lang}"]`);
      if (!hrefLang) {
        hrefLang = document.createElement('link');
        hrefLang.setAttribute('rel', 'alternate');
        hrefLang.setAttribute('hreflang', lang);
        document.head.appendChild(hrefLang);
      }
      
      if (page === 'product' && product && categoryName) {
        hrefLang.setAttribute('href', `https://toutaunclicla.com/${lang}/${categoryName}/${product.id}`);
      } else {
        hrefLang.setAttribute('href', `https://toutaunclicla.com/${lang}/${page}`);
      }
    });

    // Cleanup function
    return () => {
      const generatedTags = document.querySelectorAll('meta[data-seo-generated]');
      generatedTags.forEach(tag => tag.remove());
    };
  }, [page, product, categoryName, t]);

  return null;
}
