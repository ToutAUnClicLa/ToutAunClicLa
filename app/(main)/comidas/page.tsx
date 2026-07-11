"use client";

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { ProductGrid } from '@/components/features/modules/catalog/ProductGrid';
import { FoodCatalog } from '@/components/features/modules/catalog/FoodCatalog';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';

const LoadingFallback = () => (
  <div className="min-h-screen bg-white py-6">
    <div className="container">
      <div className="animate-pulse">
        <div className="text-center space-y-4 mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4" />
          <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

function ComidasContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const subcategoriaId = searchParams.get('subcategoria');

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
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ComidasContent />
    </Suspense>
  );
}