"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ProductGrid } from '@/components/features/modules/catalog/ProductGrid';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';
import { getSubcategoryId } from '@/lib/constants/subcategories';

function ProductosContent() {
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
    document.title = t('seo.products.title');
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('seo.products.description'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('seo.products.description');
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', t('seo.products.keywords'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = t('seo.products.keywords');
      document.head.appendChild(meta);
    }
  }, [t]);

  return (
    <>
      <SEOMetaTags page="products" />
      <StructuredData type="organization" />
      <ProductGrid 
        categoryId={1} 
        categoryName="productos" 
        title={t('catalog.productList.productsTitle')}
        initialSubcategory={subcategoriaId ? getSubcategoryId(subcategoriaId) : null}
        initialSearch={searchQuery || undefined}
      />
    </>
  );
}

export default function ProductosPage() {
  return <ProductosContent />;
}