"use client";

import { Suspense, useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { RestaurantProductGrid } from '@/components/features/modules/catalog/RestaurantProductGrid';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';
import { getRestaurantNameFromSlug } from '@/lib/utils/restaurant-routes';
import { MapPin, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/common/ui/badge';

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
            <div key={i} className="bg-gray-200 rounded-lg h-64" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

function RestaurantPageContent() {
  const params = useParams();
  const { t } = useTranslation();
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  
  useEffect(() => {
    const slug = params?.restaurante as string;
    const name = getRestaurantNameFromSlug(slug);
    
    if (!name) {
      notFound();
      return;
    }
    
    setRestaurantName(name);
  }, [params]);

  if (!restaurantName) {
    return <LoadingFallback />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": restaurantName,
    "description": `Deliciosos platos de ${restaurantName} disponibles para entrega`,
    "servesCuisine": "Cocina Latina",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CA",
      "addressRegion": "QC"
    }
  };

  return (
    <>
      <SEOMetaTags 
        title={`${restaurantName} - Pedidos Online | ToutAunClicLa`}
        description={`Ordena en línea desde ${restaurantName}. Entrega rápida en Montreal y Riviera Sur. Platillos frescos y auténticos.`}
        keywords={`${restaurantName}, comida latina, entrega Montreal, pedidos online`}
      />
      
      <StructuredData data={structuredData} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header del Restaurante */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{restaurantName}</h1>
              </div>
              
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                {t('catalog.restaurantBanner.description').replace('{restaurantName}', restaurantName)}
              </p>
              
              {/* Info del restaurante */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('catalog.restaurantBanner.deliveryAvailable')}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Clock className="h-4 w-4 mr-2" />
                  {t('catalog.restaurantBanner.businessHours')}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Star className="h-4 w-4 mr-2" />
                  {t('catalog.restaurantBanner.authenticCuisine')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Productos del Restaurante */}
        <div className="container mx-auto px-4 py-8">
          <RestaurantProductGrid restaurantName={restaurantName} />
        </div>
      </div>
    </>
  );
}

export default function RestaurantPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RestaurantPageContent />
    </Suspense>
  );
}