"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ProductGrid } from '@/components/features/modules/catalog/ProductGrid';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';
import { getSubcategoryId } from '@/lib/constants/subcategories';

function BoutiqueContent() {
  const { t } = useTranslation();
  const [subcategoriaId, setSubcategoriaId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  // Se lee window.location.search directo (no useSearchParams) al montar para
  // no forzar que todo el contenido quede detrás de un Suspense renderizado
  // solo en cliente (rompe el SSR/prerender de la página completa).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSubcategoriaId(params.get('subcategoria'));
    setSearchQuery(params.get('search'));
  }, []);

  // Set SEO metadata
  useEffect(() => {
    document.title = t('seo.boutique.title');
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('seo.boutique.description'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('seo.boutique.description');
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', t('seo.boutique.keywords'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = t('seo.boutique.keywords');
      document.head.appendChild(meta);
    }
  }, [t]);

  return (
    <>
      <SEOMetaTags page="boutique" />
      <StructuredData type="organization" />
      <ProductGrid 
        categoryId={3} 
        categoryName="boutique" 
        title={t('catalog.productList.boutiqueTitle')}
        initialSubcategory={subcategoriaId ? getSubcategoryId(subcategoriaId) : null}
        initialSearch={searchQuery || undefined}
      />
    </>
  );
}

export default function BoutiquePage() {
  return <BoutiqueContent />;
}