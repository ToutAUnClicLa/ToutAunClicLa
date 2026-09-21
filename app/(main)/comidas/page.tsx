"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { FoodCatalog } from '@/components/features/modules/catalog/FoodCatalog';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';

function ComidasContent() {
  const { t } = useTranslation();
  const [subcategoriaId, setSubcategoriaId] = useState<string | null>(null);

  // Se lee window.location.search directo (no useSearchParams) al montar para
  // no forzar que todo el contenido quede detrás de un Suspense renderizado
  // solo en cliente (rompe el SSR/prerender de la página completa).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSubcategoriaId(params.get('subcategoria'));
  }, []);

  // Set SEO metadata
  useEffect(() => {
    document.title = t('seo.comidas.title');
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('seo.comidas.description'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('seo.comidas.description');
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', t('seo.comidas.keywords'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = t('seo.comidas.keywords');
      document.head.appendChild(meta);
    }
  }, [t]);

  return (
    <>
      <SEOMetaTags page="comidas" />
      <StructuredData type="organization" />
      <FoodCatalog
        categoryId={2}
        initialSubcategory={subcategoriaId ? parseInt(subcategoriaId) : null}
      />
    </>
  );
}

export default function ComidasPage() {
  return <ComidasContent />;
}