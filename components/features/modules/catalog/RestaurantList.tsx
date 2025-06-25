"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Star, Clock, MapPin, ArrowRight, Phone, Globe, Users, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useSubcategories } from '@/hooks/useCategories';
import { Subcategory } from '@/lib/services/categories';
import { Card, CardContent } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
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

  // Función para obtener datos mock del restaurante
  const getRestaurantData = (restaurant: Subcategory) => {
    const mockRatings = [4.2, 4.5, 4.8, 4.1, 4.6, 4.3, 4.7, 4.4];
    const mockDeliveryTimes = ["25-35", "30-40", "20-30", "35-45", "25-40", "30-35", "20-35", "25-45"];
    const mockSpecialties = [
      ["Arepas", "Empanadas"], 
      ["Tacos", "Quesadillas"], 
      ["Ceviche", "Lomo Saltado"],
      ["Pupusas", "Yuca Frita"],
      ["Gallo Pinto", "Casado"],
      ["Bandeja Paisa", "Sancocho"],
      ["Asado", "Milanesa"],
      ["Mole", "Pozole"]
    ];
    
    const index = restaurant.id % mockRatings.length;
    
    return {
      rating: mockRatings[index],
      deliveryTime: mockDeliveryTimes[index],
      specialties: mockSpecialties[index],
      reviewCount: Math.floor(Math.random() * 500) + 50
    };
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border border-amber-100">
          {/* Skeleton móvil */}
          <div className="block sm:hidden">
            <div className="p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-8 w-full mt-3" />
            </div>
          </div>
          
          {/* Skeleton desktop */}
          <div className="hidden sm:block">
            <div className="aspect-[4/3] relative bg-gray-100">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
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
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
            <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Error al cargar restaurantes
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">{error}</p>
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
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
            <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            No hay restaurantes disponibles
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">
            Próximamente tendremos más opciones de comida tradicional para ti.
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
    >
      {restaurants.map((restaurant) => {
        const restaurantData = getRestaurantData(restaurant);
        
        return (
          <motion.div key={restaurant.id} variants={item}>
            <Card 
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-amber-100 bg-white/90 backdrop-blur-sm"
              onClick={() => handleRestaurantClick(restaurant)}
            >
              {/* Diseño móvil: Layout horizontal compacto */}
              <div className="block sm:hidden">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar circular del restaurante - prominente en móvil */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0 border-2 border-amber-200 shadow-md">
                      {restaurant.Imagen ? (
                        <Image
                          src={getImageUrl(restaurant.Imagen)}
                          alt={restaurant.nombre}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ChefHat className="w-8 h-8 text-amber-600" />
                        </div>
                      )}
                      
                      {/* Rating badge sobre la imagen circular */}
                      <div className="absolute -top-1 -right-1 bg-white rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow-md border border-amber-200">
                        <Star className="h-2.5 w-2.5 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold text-gray-900">
                          {restaurantData.rating}
                        </span>
                      </div>
                    </div>

                    {/* Info del restaurante - al lado de la imagen */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {restaurant.nombre}
                        </h3>
                        {restaurantData.specialties.length > 0 && (
                          <Badge className="bg-amber-500 text-white text-xs px-1.5 py-0.5 ml-2 flex-shrink-0">
                            {restaurantData.specialties[0]}
                          </Badge>
                        )}
                      </div>
                      
                      {restaurant.Descripcion && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {restaurant.Descripcion}
                        </p>
                      )}
                      
                      {/* Información adicional compacta */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{restaurantData.deliveryTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{restaurantData.reviewCount}+</span>
                        </div>
                      </div>
                      
                      {/* Especialidades */}
                      {restaurantData.specialties.length > 1 && (
                        <div className="flex flex-wrap gap-1">
                          {restaurantData.specialties.slice(1, 3).map((specialty, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-700 border-amber-200"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botón de acción para móvil */}
                  <Button 
                    className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium text-sm h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestaurantClick(restaurant);
                    }}
                  >
                    <span>Ver menú</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </div>

              {/* Diseño desktop: Layout vertical con imagen de fondo */}
              <div className="hidden sm:block">
                {/* Imagen del restaurante */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {restaurant.Imagen && (
                    <Image
                      src={getImageUrl(restaurant.Imagen)}
                      alt={restaurant.nombre}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  
                  {/* Overlay con gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-semibold text-gray-900">
                      {restaurantData.rating}
                    </span>
                  </div>

                  {/* Especialidades badge */}
                  {restaurantData.specialties.length > 0 && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-amber-500 text-white text-xs font-medium">
                        {restaurantData.specialties[0]}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header con imagen circular del restaurante y info básica */}
                    <div className="flex items-start gap-3">
                      {/* Avatar circular del restaurante */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0 border-2 border-white shadow-md">
                        {restaurant.Imagen ? (
                          <Image
                            src={getImageUrl(restaurant.Imagen)}
                            alt={restaurant.nombre}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ChefHat className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                          </div>
                        )}
                      </div>

                      {/* Info del restaurante */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {restaurant.nombre}
                        </h3>
                        {restaurant.Descripcion && (
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                            {restaurant.Descripcion}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{restaurantData.deliveryTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{restaurantData.reviewCount}+ reseñas</span>
                      </div>
                    </div>

                    {/* Especialidades */}
                    {restaurantData.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {restaurantData.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Botón de acción */}
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium text-sm sm:text-base group-hover:shadow-lg transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestaurantClick(restaurant);
                      }}
                    >
                      <span>Ver menú</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
