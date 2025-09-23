"use client";

import { Suspense, useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { RestaurantProductGrid } from '@/components/features/modules/catalog/RestaurantProductGrid';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';
import { getRestaurantNameFromSlug } from '@/lib/utils/restaurant-routes';
import { MapPin, Clock, Star, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/common/ui/badge';
import { Button } from '@/components/common/ui/button';

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
  const router = useRouter();
  const { t } = useTranslation();
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  
  const handleBackToRestaurants = () => {
    router.push('/comidas');
  };
  
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


  return (
    <>
      <SEOMetaTags page="comidas" />
      
      <StructuredData type="organization" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header del Restaurante */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative">
          <div className="container mx-auto px-4">
            {/* Layout Responsivo del Header */}
            <div className="relative pt-4 pb-8">
              {/* Botón Volver - Posicionamiento Optimizado */}
              <div className="
                flex 
                sm:absolute sm:top-4 sm:left-0 sm:z-10
                justify-start
                mb-4 sm:mb-0
              ">
                <Button
                  onClick={handleBackToRestaurants}
                  variant="ghost"
                  size="sm"
                  className="
                    group
                    text-white 
                    hover:text-white
                    hover:bg-transparent
                    border border-white
                    hover:border-white
                    transition-colors duration-200
                    rounded-md
                    backdrop-blur-sm
                    px-2 py-1 sm:px-3 sm:py-1.5
                    text-xs sm:text-sm
                    font-normal
                    min-w-fit
                    h-auto
                    shadow-none
                  "
                  aria-label={`${t('catalog.restaurantBanner.backToRestaurants')} - Navegar hacia atrás`}
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                  <span className="text-xs sm:text-sm whitespace-nowrap">
                    {t('catalog.restaurantBanner.backToRestaurants')}
                  </span>
                </Button>
              </div>
              
              {/* Contenido Principal del Banner - Centrado Perfecto */}
              <div className="text-center space-y-4 
                sm:pt-2
                max-w-4xl mx-auto
              ">
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
                    <Star className="h-4 w-4 mr-2" />
                    {t('catalog.restaurantBanner.authenticCuisine')}
                  </Badge>
                </div>
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