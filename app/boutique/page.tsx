"use client";

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { ProductGrid } from '@/components/features/modules/catalog/ProductGrid';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';
import { getSubcategoryId } from '@/lib/constants/subcategories';

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6">
    <div className="container">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

function BoutiqueContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const subcategoriaId = searchParams.get('subcategoria');

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
      />
    </>
  );
}

export default function BoutiquePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BoutiqueContent />
    </Suspense>
  );
}