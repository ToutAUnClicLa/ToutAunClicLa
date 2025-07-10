"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Star, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useSubcategories } from '@/hooks/useCategories';
import { Subcategory } from '@/lib/services/categories';
import { Card, CardContent } from '@/components/common/ui/card';
import { Button } from '@/components/common/ui/button';
import { Skeleton } from '@/components/common/ui/skeleton';
import { cn, getImageUrl } from '@/lib/utils';

interface RestaurantListProps {
  categoryId: number;
  onRestaurantSelect?: (subcategoryId: number, restaurantName: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export function RestaurantList({ categoryId, onRestaurantSelect }: RestaurantListProps) {
  const router = useRouter();
  const { t } = useTranslation();
  
  // Usar el hook de subcategorías (restaurantes)
  const { subcategories: restaurants, loading, error } = useSubcategories(categoryId);

  const handleRestaurantClick = (restaurant: Subcategory) => {
    if (onRestaurantSelect) {
      onRestaurantSelect(restaurant.id, restaurant.nombre);
    } else {
      router.push(`/comidas?subcategoria=${restaurant.id}`);
    }
  };

  // Función para obtener datos enriquecidos del restaurante
  const getRestaurantData = (restaurant: Subcategory) => {
    const mockRatings = [4.2, 4.5, 4.8, 4.1, 4.6, 4.3, 4.7, 4.4];
    const cuisineTypes = ["Mexicana", "Peruana", "Colombiana", "Argentina", "Venezolana", "Chilena", "Ecuatoriana", "Brasileña"];
    
    const index = restaurant.id % mockRatings.length;
    
    return {
      rating: mockRatings[index],
      reviewCount: Math.floor(Math.random() * 500) + 50,
      cuisineType: cuisineTypes[index]
    };
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border-0 bg-white shadow-lg h-[240px] sm:h-[280px] rounded-2xl">
          <CardContent className="p-4 sm:p-6 h-full flex flex-col">
            <div className="space-y-3 sm:space-y-4 flex-1">
              {/* Header con logo */}
              <div className="flex items-center gap-3 sm:gap-4">
                <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <Skeleton className="h-4 sm:h-5 w-full max-w-[120px] sm:max-w-[160px]" />
                  <Skeleton className="h-3 w-full max-w-[80px] sm:max-w-[100px]" />
                </div>
              </div>
              
              {/* Descripción */}
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              
              {/* Rating y estado */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-5 w-20" />
              </div>
              
              {/* Botón */}
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
            <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {t('catalog.restaurantList.errorTitle')}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">
            {t('catalog.restaurantList.errorDesc')}
          </p>
        </motion.div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
            <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {t('catalog.restaurantList.noRestaurants')}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">
            {t('catalog.restaurantList.noRestaurantsDesc')}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
    >
      {restaurants.map((restaurant) => {
        const restaurantData = getRestaurantData(restaurant);
        
        return (
          <motion.div key={restaurant.id} variants={item} className="h-full">
            <Card 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white shadow-lg hover:shadow-orange-100/50 hover:-translate-y-1 sm:hover:-translate-y-2 relative h-[240px] sm:h-[280px] flex flex-col rounded-2xl"
              onClick={() => handleRestaurantClick(restaurant)}
              role="button"
              tabIndex={0}
              aria-label={`${t('catalog.restaurantList.viewMenuFor')} ${restaurant.nombre}`}
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="flex flex-col h-full">
                  
                  {/* Header: Logo e Info básica - Altura fija */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {/* Logo circular profesional - SIEMPRE CIRCULAR */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 border-2 sm:border-3 border-white shadow-lg sm:shadow-xl transition-all duration-500 ring-1 sm:ring-2 ring-orange-100 group-hover:ring-orange-200 group-hover:shadow-2xl group-hover:scale-105">
                        {restaurant.Imagen ? (
                          <Image
                            src={getImageUrl(restaurant.Imagen)}
                            alt={`${restaurant.nombre} logo`}
                            fill
                            className="object-cover rounded-full"
                            sizes="(max-width: 640px) 56px, 64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center rounded-full">
                            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info básica */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg leading-tight text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
                        {restaurant.nombre}
                      </h3>
                    </div>
                  </div>

                  {/* Descripción - Altura fija para consistencia */}
                  <div className="mb-3 sm:mb-4" style={{ height: '36px' }}>
                    {restaurant.Descripcion ? (
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {restaurant.Descripcion}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-400 italic leading-relaxed">
                        {t('catalog.restaurantList.noDescription')}
                      </p>
                    )}
                  </div>

                  {/* Spacer para empujar el contenido inferior */}
                  <div className="flex-1"></div>

                  {/* Rating y estado - Posición fija en la parte inferior */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">

                    {/* Estado disponible */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
                      <span className="text-emerald-600 font-medium text-xs sm:text-sm">
                        {t('catalog.restaurantList.available')}
                      </span>
                    </div>
                  </div>

                  {/* Call to Action Button Premium - Posición fija */}
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white font-semibold text-sm sm:text-base h-10 sm:h-12 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl relative overflow-hidden group-hover:scale-[1.02]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestaurantClick(restaurant);
                    }}
                    aria-label={`${t('catalog.restaurantList.viewMenu')} - ${restaurant.nombre}`}
                  >
                    {/* Efecto shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {t('catalog.restaurantList.viewMenu')}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
