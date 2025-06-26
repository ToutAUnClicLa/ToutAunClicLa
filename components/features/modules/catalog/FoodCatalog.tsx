"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChefHat, Filter, Search, SlidersHorizontal, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterBy, setFilterBy] = useState('all');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-yellow-50/30">
      <div className={`mx-auto px-4 sm:px-6 py-6 sm:py-8 ${showProducts ? 'max-w-7xl' : 'container'}`}>
        
        {/* Vista principal: Listado de restaurantes */}
        {!showProducts && (
          <div className="mb-6">
            {/* Encabezado consistente con otras secciones */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Título y icono - Centrado en mobile, izquierda en desktop */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <ChefHat className="h-6 w-6 text-amber-600" strokeWidth={2} fill="none" />
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{t('catalog.foodCatalog.title')}</h1>
                  <p className="text-sm text-gray-600">
                    {t('catalog.foodCatalog.subtitle')}
                  </p>
                </div>
              </div>

              {/* Buscador - Responsivo */}
              <div className="w-full sm:w-auto sm:max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder={t('catalog.foodCatalog.searchPlaceholder')}
                    className="pl-10 h-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Lista de restaurantes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-1 sm:px-0"
            >
              <RestaurantList
                categoryId={categoryId}
                onRestaurantSelect={handleRestaurantSelect}
              />
            </motion.div>
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
              {/* Header mejorado con botón de regreso */}
              <div className="mb-6 sm:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
                >
                  <Button
                    variant="outline"
                    onClick={handleBackToRestaurants}
                    className="inline-flex items-center gap-2 px-4 py-3 h-12 bg-white/90 backdrop-blur-sm border-2 border-orange-200/60 text-orange-700 hover:bg-orange-50 hover:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 rounded-xl shadow-md hover:shadow-lg font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('catalog.foodCatalog.backToRestaurants')}</span>
                  </Button>
                  
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50/80 rounded-lg border border-orange-200/40">
                    <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {selectedRestaurant?.name || t('catalog.foodCatalog.selectedRestaurant')}
                    </span>
                  </div>
                </motion.div>

                {/* Título elegante para la vista de productos */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center space-y-3 sm:space-y-4"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {t('catalog.foodCatalog.menuTitle')} {selectedRestaurant?.name}
                  </h1>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">
                      {t('catalog.foodCatalog.menuSubtitle')}
                    </p>
                    <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
                  </div>
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
