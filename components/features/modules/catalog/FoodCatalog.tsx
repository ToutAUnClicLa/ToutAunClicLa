"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChefHat, Clock, Star, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { RestaurantList } from './RestaurantList';
import { ProductGrid } from './ProductGrid';

interface FoodCatalogProps {
  categoryId: number;
  initialSubcategory?: number | null;
}

export function FoodCatalog({ categoryId, initialSubcategory = null }: FoodCatalogProps) {
  const { t } = useTranslation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    id: number;
    name: string;
  } | null>(initialSubcategory ? { id: initialSubcategory, name: 'Restaurante' } : null);
  const [showProducts, setShowProducts] = useState(!!initialSubcategory);

  // Si hay una subcategoría inicial, mostrar directamente los productos
  useEffect(() => {
    if (initialSubcategory) {
      setSelectedRestaurant({ id: initialSubcategory, name: 'Restaurante' });
      setShowProducts(true);
    }
  }, [initialSubcategory]);

  const handleRestaurantSelect = (subcategoryId: number, restaurantName: string) => {
    setSelectedRestaurant({ id: subcategoryId, name: restaurantName });
    setShowProducts(true);
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setShowProducts(false);
  };

  const benefits = [
    {
      icon: Clock,
      title: t('catalog.foodCatalog.benefits.fastDelivery') || "Entrega rápida",
      description: t('catalog.foodCatalog.benefits.fastDeliveryDesc') || "En 30-45 minutos"
    },
    {
      icon: Truck,
      title: t('catalog.foodCatalog.benefits.freeShipping') || "Envío gratis",
      description: t('catalog.foodCatalog.benefits.freeShippingDesc') || "En pedidos +$200"
    },
    {
      icon: Shield,
      title: t('catalog.foodCatalog.benefits.quality') || "Calidad garantizada",
      description: t('catalog.foodCatalog.benefits.qualityDesc') || "Restaurantes verificados"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className={`mx-auto px-4 py-6 sm:py-8 ${showProducts ? 'max-w-7xl' : 'container'}`}>
        
        {/* Vista principal: Listado de restaurantes */}
        {!showProducts && (
          <div className="mb-8 sm:mb-12">
            {/* Título principal */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
                <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {t('catalog.foodCatalog.title') || 'Comidas Tradicionales'}
                </h1>
              </div>
              <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                {t('catalog.foodCatalog.subtitle') || 'Sabores auténticos de toda América Latina - Gastronomía tradicional en Montreal'}
              </p>
            </motion.div>

            {/* Layout responsive: Benefits a la izquierda, Restaurantes a la derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              
              {/* Benefits - columna izquierda en desktop, arriba en móvil */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1 space-y-4"
              >
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-amber-100 shadow-lg">
                  <h3 className="font-bold text-lg sm:text-xl text-amber-700 mb-4 text-center lg:text-left">
                    ¿Por qué elegirnos?
                  </h3>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                          <benefit.icon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                            {benefit.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-amber-200">
                    <Badge 
                      variant="outline" 
                      className="bg-amber-50 text-amber-700 border-amber-300 px-3 py-1 text-sm w-full justify-center"
                    >
                      🍕 +50 restaurantes disponibles
                    </Badge>
                  </div>
                </div>
              </motion.div>

              {/* Restaurantes - columna derecha en desktop, abajo en móvil */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3"
              >
                <RestaurantList
                  categoryId={categoryId}
                  onRestaurantSelect={handleRestaurantSelect}
                />
              </motion.div>
            </div>
          </div>
        )}

        {/* Vista de productos del restaurante seleccionado */}
        <AnimatePresence mode="wait">
          {showProducts && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header con botón de regreso */}
              <div className="mb-6 sm:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
                >
                  <Button
                    variant="outline"
                    onClick={handleBackToRestaurants}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border-orange-200 text-orange-700 hover:bg-orange-50 transition-all duration-300 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('catalog.foodCatalog.backToRestaurants') || 'Volver a restaurantes'}</span>
                  </Button>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    <span className="text-sm">
                      {selectedRestaurant?.name || 'Restaurante seleccionado'}
                    </span>
                  </div>
                </motion.div>

                {/* Título para la vista de productos */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center space-y-2"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    {t('catalog.foodCatalog.menuTitle') || 'Menú de'} {selectedRestaurant?.name}
                  </h1>
                  <p className="text-sm sm:text-lg text-gray-600">
                    {t('catalog.foodCatalog.menuSubtitle') || 'Descubre los platos auténticos y tradicionales'}
                  </p>
                </motion.div>
              </div>

              {/* ProductGrid sin el header propio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ProductGrid 
                  categoryId={categoryId} 
                  categoryName="comidas" 
                  title=""
                  showHeader={false}
                  initialSubcategory={selectedRestaurant?.id || null}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
