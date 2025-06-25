"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChefHat, Clock, Star, MapPin, Truck } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { RestaurantGrid } from './RestaurantGrid';
import { ProductList } from './ProductList';

interface AdaptiveFoodCatalogProps {
  categoryId: number;
  initialSubcategory?: number | null;
}

export function AdaptiveFoodCatalog({ categoryId, initialSubcategory = null }: AdaptiveFoodCatalogProps) {
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
      description: t('catalog.foodCatalog.benefits.fastDeliveryDesc') || "En 50 minutos"
    },
    {
      icon: Truck,
      title: t('catalog.foodCatalog.benefits.freeShipping') || "Envío gratis",
      description: t('catalog.foodCatalog.benefits.freeShippingDesc') || "En pedidos +$200"
    },
    {
      icon: Star,
      title: t('catalog.foodCatalog.benefits.quality') || "Calidad garantizada",
      description: t('catalog.foodCatalog.benefits.qualityDesc') || "Restaurantes verificados"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className={`mx-auto px-4 py-8 ${showProducts ? 'max-w-7xl' : 'container'}`}>
        {/* Header mejorado para comidas */}
        {!showProducts && (
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <ChefHat className="h-8 w-8 text-amber-600" />
                <h1 className="text-4xl font-bold text-gray-900">
                  {t('catalog.foodCatalog.title') || 'Comidas Tradicionales'}
                </h1>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('catalog.foodCatalog.subtitle') || 'Sabores auténticos de toda América Latina - Gastronomía tradicional en Montreal'}
              </p>
            </motion.div>

            {/* Benefits grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8"
            >
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-amber-100 hover:shadow-lg transition-all duration-300"
                >
                  <benefit.icon className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </motion.div>

            <Badge 
              variant="outline" 
              className="bg-white/80 text-amber-600 border-amber-200 px-4 py-2 text-sm"
            >
              🍕 +50 restaurantes disponibles
            </Badge>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!showProducts ? (
            <motion.div
              key="restaurants"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RestaurantGrid
                categoryId={categoryId}
                onRestaurantSelect={handleRestaurantSelect}
              />
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header con botón de regreso */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <Button
                    variant="outline"
                    onClick={handleBackToRestaurants}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-orange-200 text-orange-700 hover:bg-orange-50 transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('catalog.foodCatalog.backToRestaurants') || 'Volver a restaurantes'}</span>
                  </Button>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <ChefHat className="w-5 h-5 text-orange-500" />
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
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {t('catalog.foodCatalog.menuTitle') || 'Menú de'} {selectedRestaurant?.name}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {t('catalog.foodCatalog.menuSubtitle') || 'Descubre los platos auténticos y tradicionales'}
                  </p>
                </motion.div>
              </div>

              {/* ProductList sin el header propio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ProductList 
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
