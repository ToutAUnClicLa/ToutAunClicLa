"use client";

import { Suspense, useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantDetails } from '@/hooks/useRestaurantDetails';
import { RestaurantProductGrid } from '@/components/features/modules/catalog/RestaurantProductGrid';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';
import { getRestaurantNameFromSlug } from '@/lib/utils/restaurant-routes';
import { getImageUrl } from '@/lib/utils';
import { MapPin, Clock, Star, ArrowLeft, ChefHat } from 'lucide-react';
import { Badge } from '@/components/common/ui/badge';
import { Button } from '@/components/common/ui/button';

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header Banner Skeleton */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative">
      <div className="container mx-auto px-4">
        <div className="relative pt-4 pb-8">
          <div className="flex sm:absolute sm:top-4 sm:left-0 sm:z-10 justify-start mb-4 sm:mb-0">
            <div className="h-8 w-28 bg-white/20 rounded-md animate-pulse" />
          </div>
          <div className="text-center space-y-4 sm:pt-2 max-w-4xl mx-auto">
            <div className="mb-4">
              <div className="h-12 bg-white/20 rounded w-1/2 mx-auto animate-pulse" />
            </div>
            <div className="h-6 bg-white/20 rounded w-2/3 mx-auto animate-pulse" />
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <div className="h-8 w-32 bg-white/20 rounded-full animate-pulse" />
              <div className="h-8 w-28 bg-white/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Content with Sidebar Layout */}
    <div className="container mx-auto px-4 py-8">
      <div className="lg:flex lg:gap-8">
        {/* Desktop Sidebar Skeleton - Solo visible en desktop */}
        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <div className="sticky top-20">
            <div className="bg-white shadow-lg border-0 p-4 rounded-lg animate-pulse">
              {/* Header del horario */}
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Lista de días */}
              <div className="space-y-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="lg:flex-1 space-y-8 animate-pulse">
          {/* Mobile Schedule Button Skeleton - Solo visible en mobile */}
          <div className="lg:hidden">
            <div className="w-full h-12 bg-gray-200 rounded-xl" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="text-center">
            <div className="max-w-4xl mx-auto">
              <div className="h-12 bg-gray-200 rounded-lg" />
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64" />
            ))}
          </div>
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
  const { restaurant } = useRestaurantDetails(restaurantName);

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
                <div className="mb-4 flex items-center justify-center gap-3 sm:gap-4">
                  {/* Logo circular del restaurante - al lado del título */}
                  <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white/15 border-2 border-white shadow-lg ring-2 ring-white/40">
                    {restaurant?.Imagen ? (
                      <Image
                        src={getImageUrl(restaurant.Imagen)}
                        alt={`${restaurantName} logo`}
                        fill
                        className="object-cover rounded-full"
                        sizes="(max-width: 768px) 64px, 80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white/80" />
                      </div>
                    )}
                  </div>
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